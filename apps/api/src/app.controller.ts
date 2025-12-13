import { Controller, Get, HttpStatus, Param, Res } from "@nestjs/common";

import { UrlsService } from "@modules/urls/urls.service";

import { Response } from "express";

@Controller()
export class AppController {
  constructor(private readonly urlsService: UrlsService) {}

  @Get(":code")
  async redirectToLongUrl(@Param("code") code: string, @Res() res: Response) {
    const url = await this.urlsService.findUrlByCode(code);
    if (!url) {
      return res.status(HttpStatus.NOT_FOUND).send("Short URL not found");
    }
    return res.redirect(url.originalUrl);
  }
}
