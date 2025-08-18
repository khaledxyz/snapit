import { platform } from 'os';
import { promises as fs, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { Logger } from '@nestjs/common';
import { getCacheDirectory } from '../utils/cache-directory';

const MKCERT_VERSION = 'v1.4.4';

export class MkcertDownloader {
  private static readonly logger = new Logger(MkcertDownloader.name);
  private static getBinaryName(): string {
    const currentPlatform = platform();
    const arch = process.arch === 'x64' ? 'amd64' : process.arch;

    const binaryMap = {
      win32: `mkcert-${MKCERT_VERSION}-windows-${arch}.exe`,
      darwin: `mkcert-${MKCERT_VERSION}-darwin-${arch}`,
      linux: `mkcert-${MKCERT_VERSION}-linux-${arch}`,
    };

    const binaryName = binaryMap[currentPlatform as keyof typeof binaryMap];
    if (!binaryName) {
      throw new Error(`Unsupported platform: ${currentPlatform}`);
    }

    return binaryName;
  }

  static async downloadBinary(): Promise<string | undefined> {
    try {
      const binaryName = this.getBinaryName();
      const cacheDirectory = getCacheDirectory('mkcert');
      const binaryPath = join(cacheDirectory, binaryName);

      if (existsSync(binaryPath)) {
        this.logger.debug(`📦 Using cached mkcert binary: ${binaryPath}`);
        return binaryPath;
      }

      const downloadUrl = `https://github.com/FiloSottile/mkcert/releases/download/${MKCERT_VERSION}/${binaryName}`;

      await fs.mkdir(cacheDirectory, { recursive: true });

      this.logger.log(`📦 Downloading mkcert binary (${MKCERT_VERSION})...`);
      this.logger.debug(`📍 Download URL: ${downloadUrl}`);

      const response = await fetch(downloadUrl);

      if (!response.ok || !response.body) {
        throw new Error(`Download failed with status ${response.status}`);
      }

      this.logger.log('✅ Download successful, installing binary...');

      const arrayBuffer = await response.arrayBuffer();
      await fs.writeFile(binaryPath, Buffer.from(arrayBuffer));
      await fs.chmod(binaryPath, 0o755);

      this.logger.log(`🎉 mkcert binary ready: ${binaryPath}`);
      return binaryPath;
    } catch (err) {
      this.logger.error('❌ Error downloading mkcert binary', err);
      this.logger.error('💡 Check your internet connection and try again');
      return undefined;
    }
  }

  static async getCARoot(binaryPath: string): Promise<string> {
    return execSync(`"${binaryPath}" -CAROOT`).toString().trim();
  }
}
