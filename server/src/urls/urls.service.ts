import { Injectable, NotFoundException, Redirect } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { customAlphabet } from 'nanoid';
import { InjectModel } from '@nestjs/mongoose';
import { Url, UrlDocument } from './schemas/url.schema';
import { Model } from 'mongoose';

@Injectable()
export class UrlsService {
  private readonly nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 7);
  constructor(@InjectModel(Url.name) private Url: Model<UrlDocument>) { }

  create(body: CreateUrlDto) {
    const { longUrl } = body;
    const shortCode = this.nanoid();

    const url = new this.Url({
      originalUrl: longUrl,
      shortCode,
    });

    return url.save();
  }

  async findOne(shortCode: string) {
    const url = await this.Url.findOne({ shortCode });
    if (!url) new NotFoundException();

    return url;
  }
}
