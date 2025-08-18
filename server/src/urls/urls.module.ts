import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { DatabaseModule } from '../database/database.module';
import { CodeGeneratorModule } from 'src/code-generator/code-generator.module';
import { PasswordModule } from 'src/password/password.module';

@Module({
  imports: [DatabaseModule, CodeGeneratorModule, PasswordModule],
  controllers: [UrlsController],
  providers: [UrlsService],
  exports: [UrlsService],
})
export class UrlsModule {}
