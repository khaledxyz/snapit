import { NestApplicationOptions } from '@nestjs/common';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';
import { SSLService } from './ssl';

/**
 * Create application configuration with SSL support in development
 */
export async function getAppConfig(): Promise<
  NestApplicationOptions & NestApplicationContextOptions
> {
  const httpsOptions = await SSLService.createHttpsOptions();

  const config: NestApplicationOptions & NestApplicationContextOptions = {};

  if (httpsOptions) {
    Object.assign(config, { httpsOptions });
  }

  return config;
}

// For backward compatibility
export const AppConfig = getAppConfig();
