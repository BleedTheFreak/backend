import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { AuthService } from "./auth.service";
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private config: ConfigService) { }
  @Get('token')
  @Redirect()
  async Auth(@Query('code') code: string, @Res({ passthrough: true }) resp: Response) {
    const res = await this.authService.Auth(code);
    resp.cookie('access_token', res.access_tokens, { httpOnly: true, domain: 'localhost' });
    return { url: 'http://localhost' };
  }

  @Get('login')
  @Redirect()
  async login() {
    const url = `https://api.intra.42.fr/oauth/authorize?client_id=${this.config.get('CLIENT_ID')}&redirect_uri=${this.config.get('REDIRECT_URI')}&response_type=code`
    return { url }
  }
}
