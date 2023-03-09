import { Controller, Get, Query, Redirect, Res } from '@nestjs/common';
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }
  @Get('token')
  async Auth(@Query('code') code) {
      const res = await this.authService.Auth(code);
      return res;
  }
}
