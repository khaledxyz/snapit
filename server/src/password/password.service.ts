import { Injectable } from '@nestjs/common';
import { hash, verify, Algorithm, Version, Options } from '@node-rs/argon2';

@Injectable()
export class PasswordService {
  private readonly defaultOptions: Options = {
    memoryCost: 2 ** 12, // 4 MiB
    timeCost: 3, // 3 iterations
    outputLen: 32, // 32 bytes
    parallelism: 1,
    algorithm: Algorithm.Argon2id,
    version: Version.V0x13,
  };

  async hashPassword(
    password: string,
    options?: Partial<Options>,
  ): Promise<string> {
    return hash(password, { ...this.defaultOptions, ...options });
  }

  async verifyPassword(hashed: string, password: string): Promise<boolean> {
    return verify(hashed, password);
  }
}
