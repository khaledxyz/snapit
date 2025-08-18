export interface SelfSignedCertificate {
  key: string;
  cert: string;
  rootCA?: string;
}

export interface CertificateOptions {
  host?: string;
  certDir?: string;
  hosts?: string[];
}
