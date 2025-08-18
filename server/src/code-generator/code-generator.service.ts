import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

@Injectable()
export class CodeGeneratorService {
  private readonly defaultAlphabet =
    '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

  generate(
    length: number = 7,
    alphabet: string = this.defaultAlphabet,
  ): string {
    const generator = customAlphabet(alphabet, length);
    return generator();
  }
}
