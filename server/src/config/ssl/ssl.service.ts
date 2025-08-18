import { promises as fs, existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { X509Certificate, createPrivateKey } from 'crypto';
import { execSync } from 'child_process';
import { Logger } from '@nestjs/common';
import { MkcertDownloader } from './mkcert-downloader';
import { SelfSignedCertificate, CertificateOptions } from './types';

const DEFAULT_CERT_DIR = 'certificates';
const DEFAULT_HOSTS = ['localhost', '127.0.0.1', '::1'];

export class SSLService {
  private static readonly logger = new Logger(SSLService.name);
  /**
   * Create or retrieve SSL certificates for development
   */
  static async createSelfSignedCertificate(
    options: CertificateOptions = {},
  ): Promise<SelfSignedCertificate | undefined> {
    const {
      host = 'localhost',
      certDir = DEFAULT_CERT_DIR,
      hosts = DEFAULT_HOSTS,
    } = options;

    try {
      const binaryPath = await MkcertDownloader.downloadBinary();
      if (!binaryPath) {
        throw new Error('Missing mkcert binary');
      }

      const resolvedCertDir = resolve(process.cwd(), certDir);
      await fs.mkdir(resolvedCertDir, { recursive: true });

      const keyPath = resolve(resolvedCertDir, 'localhost-key.pem');
      const certPath = resolve(resolvedCertDir, 'localhost.pem');

      // Check if valid certificates already exist
      const existingCert = await this.validateExistingCertificate(
        keyPath,
        certPath,
        host,
        binaryPath,
      );
      if (existingCert) {
        return existingCert;
      }

      // Generate new certificates
      return await this.generateNewCertificate(
        binaryPath,
        keyPath,
        certPath,
        host,
        hosts,
        certDir,
      );
    } catch (err) {
      this.logger.error('Failed to generate self-signed certificate', err);
      this.logger.error(
        '💡 If you see permission errors, try running as administrator/sudo',
      );
      this.logger.warn('🔄 Falling back to HTTP mode');
      return undefined;
    }
  }

  private static async validateExistingCertificate(
    keyPath: string,
    certPath: string,
    host: string,
    binaryPath: string,
  ): Promise<SelfSignedCertificate | undefined> {
    if (!existsSync(keyPath) || !existsSync(certPath)) {
      return undefined;
    }

    try {
      const cert = new X509Certificate(readFileSync(certPath));
      const key = readFileSync(keyPath);

      if (cert.checkHost(host) && cert.checkPrivateKey(createPrivateKey(key))) {
        this.logger.log('🔄 Using existing valid self-signed certificate');
        const caLocation = await MkcertDownloader.getCARoot(binaryPath);

        return {
          key: keyPath,
          cert: certPath,
          rootCA: `${caLocation}/rootCA.pem`,
        };
      }
    } catch (err) {
      this.logger.warn(
        '⚠️ Existing certificate validation failed, generating new certificate',
      );
      this.logger.debug('Certificate validation error:', err);
    }

    return undefined;
  }

  private static async generateNewCertificate(
    binaryPath: string,
    keyPath: string,
    certPath: string,
    host: string,
    defaultHosts: string[],
    certDir: string,
  ): Promise<SelfSignedCertificate> {
    this.logger.log(
      '🔐 Generating self-signed certificate with automatic CA installation...',
    );
    this.logger.log(
      '📋 This process will install a root CA certificate in your system trust store',
    );

    const hostsToUse =
      host && !defaultHosts.includes(host)
        ? [...defaultHosts, host]
        : defaultHosts;

    this.logger.debug(
      `🌐 Certificate will be valid for: ${hostsToUse.join(', ')}`,
    );

    try {
      execSync(
        `"${binaryPath}" -install -key-file "${keyPath}" -cert-file "${certPath}" ${hostsToUse.join(' ')}`,
        { stdio: 'inherit' },
      );
    } catch (error) {
      this.logger.error('Failed to execute mkcert command');
      this.logger.error(
        '💡 You may need to run with administrator/sudo privileges',
      );
      this.logger.error(
        '💡 On Windows: Right-click terminal and "Run as administrator"',
      );
      this.logger.error('💡 On macOS/Linux: Use "sudo" before your command');
      throw error;
    }

    const caLocation = await MkcertDownloader.getCARoot(binaryPath);

    if (!existsSync(keyPath) || !existsSync(certPath)) {
      throw new Error('Certificate files not found after generation');
    }

    this.logger.log(`🔒 CA Root certificate installed in system trust store`);
    this.logger.log(`📍 CA location: ${caLocation}`);
    this.logger.log(
      `📄 Certificate files created in: ${resolve(process.cwd(), certDir)}`,
    );

    // Add certificates to .gitignore if it exists
    await this.addToGitignore(certDir);

    return {
      key: keyPath,
      cert: certPath,
      rootCA: `${caLocation}/rootCA.pem`,
    };
  }

  private static async addToGitignore(certDir: string): Promise<void> {
    try {
      const gitignorePath = resolve(process.cwd(), '.gitignore');
      if (existsSync(gitignorePath)) {
        const gitignore = await fs.readFile(gitignorePath, 'utf8');
        if (!gitignore.includes(certDir)) {
          this.logger.log('📝 Adding certificates directory to .gitignore');
          await fs.appendFile(gitignorePath, `\n${certDir}\n`);
        } else {
          this.logger.debug('📝 Certificates directory already in .gitignore');
        }
      } else {
        this.logger.debug(
          '📝 No .gitignore file found, skipping certificate directory exclusion',
        );
      }
    } catch (err) {
      this.logger.warn('⚠️ Failed to update .gitignore', err);
    }
  }

  /**
   * Create HTTPS options for NestJS application
   */
  static async createHttpsOptions(): Promise<
    Record<string, unknown> | undefined
  > {
    if (process.env.NODE_ENV !== 'development') {
      this.logger.debug(
        '⏭️ Skipping SSL certificate generation (not in development mode)',
      );
      return undefined;
    }

    this.logger.log(
      '🚀 Initializing SSL certificate setup for development server',
    );

    try {
      const cert = await this.createSelfSignedCertificate();

      if (!cert) {
        this.logger.warn(
          '⚠️ SSL certificate generation failed, starting server in HTTP mode',
        );
        return undefined;
      }

      this.logger.log(
        '✅ SSL certificates ready - HTTPS server will be available',
      );
      this.logger.log('🌐 Server will be accessible at: https://localhost');

      return {
        key: readFileSync(cert.key),
        cert: readFileSync(cert.cert),
        passphrase: '',
      };
    } catch (error) {
      this.logger.error('❌ Failed to create SSL certificates', error);
      this.logger.warn('🔄 Starting server in HTTP mode as fallback');
      return undefined;
    }
  }
}
