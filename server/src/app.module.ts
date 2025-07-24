import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlsModule } from './urls/urls.module';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './account/account.module';
import { CodeGeneratorModule } from './code-generator/code-generator.module';
import { MailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UrlsModule,
    UsersModule,
    UserModule,
    CodeGeneratorModule,
    MailerModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }