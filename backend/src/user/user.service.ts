import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) { }
    me(user: any) {
        return user;
    }
    async all() : Promise<{login : string , firstName : string, lastName : string, Image : string}[]>{
        const users = this.prisma.user.findMany({
            select: {
                login: true,
                firstName: true,
                lastName: true,
                Image: true,
            }
        });
        return users;
    }
}
