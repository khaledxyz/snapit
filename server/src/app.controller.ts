import { Controller, Get, NotFoundException, Param, Redirect, Req, Res } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UrlsService } from "./urls/urls.service";

@Controller()
export class AppController {
    constructor(
        private readonly config: ConfigService,
        private readonly urlsService: UrlsService
    ) { }

    @Get(':shortCode([0-9A-Za-z]{7})')
    @Redirect(undefined, 302)
    async redirectShortUrl(
        @Param('shortCode') shortCode: string,
    ) {
        if (shortCode.length !== 7) {
            return { url: `${this.config.get<string>('CLIENT_URL')}/${shortCode}` };
        }

        const url = await this.urlsService.findOne(shortCode);
        return { url: url.originalUrl }
    }

    @Get()
    @Redirect(undefined, 301)
    root() {
        const clientUrl = this.config.get<string>('CLIENT_URL');
        return { url: clientUrl };
    }
}