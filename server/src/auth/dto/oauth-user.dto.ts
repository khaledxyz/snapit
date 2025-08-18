export class OAuthUserDto {
  provider: string;
  providerId: string;
  username?: string;
  email?: string;
  profile?: any;
  accessToken?: string;
}
