import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private config: ConfigService, private prisma : PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        });
    }
    validate(payload: { id: number, login: string, email: string }) {
        if (!payload || !payload.email)
            return null;
        const user = this.prisma.user.findMany({ where: { email : payload.email } , select : {
            login : true,
            email : true,
            firstName : true,
            lastName : true,
            Image : true,
        }});
        if (!user)
            return null;
        return user;
    }
}