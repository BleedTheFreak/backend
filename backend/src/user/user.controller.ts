import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';
import { GetUser } from './decorator';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }
    @Get('me')
    me(@GetUser() user: any) {
        return this.userService.me(user);
    }
    @Get('all')
    async all(): Promise<{ login: string, firstName: string, lastName: string, Image: string }[]> {
        return await this.userService.all();
    }
}