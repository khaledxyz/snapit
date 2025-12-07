import { Injectable } from "@nestjs/common";

import { Algorithm, hash, Options, Version, verify } from "@node-rs/argon2";

const MEMORY_COST_EXPONENT = 12; // 2^12 = 4 MiB
const TIME_COST = 3; // 3 iterations
const OUTPUT_LENGTH = 32; // 32 bytes
const PARALLELISM = 1;

@Injectable()
export class PasswordService {
  private readonly defaultOptions: Options = {
    memoryCost: 2 ** MEMORY_COST_EXPONENT,
    timeCost: TIME_COST,
    outputLen: OUTPUT_LENGTH,
    parallelism: PARALLELISM,
    algorithm: Algorithm.Argon2id,
    version: Version.V0x13,
  };

  async hashPassword(
    password: string,
    options?: Partial<Options>
  ): Promise<string> {
    return await hash(password, { ...this.defaultOptions, ...options });
  }

  async verifyPassword(hashed: string, password: string): Promise<boolean> {
    return await verify(hashed, password);
  }
}
