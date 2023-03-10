import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import axios from "axios";
import { User } from "src/dto";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private config: ConfigService, private jwt: JwtService) { }
  async Auth(code: string) {
    const token = await this.GetToken(code);
    const user = await this.GetMe(token);
    const UserSearch = await this.prisma.user.findUnique({ where: { email: user.email } });
    if (UserSearch)
      return this.signToken({ id: UserSearch.id, login: UserSearch.login, email: UserSearch.email });
    const newUser = await this.CreateUser(user);
    return this.signToken({ id: newUser.id, login: newUser.login, email: newUser.email });
  }

  async GetToken(code: string) {
    const payload = {
      grant_type: this.config.get('GRANT_TYPE'),
      client_id: this.config.get('CLIENT_ID'),
      client_secret: this.config.get('CLIENT_SECRET'),
      code: code,
      redirect_uri: this.config.get('REDIRECT_URI'),
    }
    try {
      const rest = await axios.post("https://api.intra.42.fr/oauth/token", payload);
      return rest.data.access_token;
    } catch (error) {
      throw new ForbiddenException(error.response.data);
    }
  }

  async GetMe(token: string): Promise<User> {
    let user: User
    try {
      let res = await axios.get("https://api.intra.42.fr/v2/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const { email, login, first_name, last_name, image } = res.data;
      const { link } = image;
      user = {
        email: email,
        login: login,
        firstName: first_name,
        lastName: last_name,
        Image: link
      }
      return user;
    } catch (error) {
      throw new ForbiddenException(error.response.data);
    }
  }

  async CreateUser(user: User) {
    try {
      const { email, login, firstName, lastName, Image } = user;
      const newUser = await this.prisma.user.create({
        data: {
          email: email,
          login: login,
          firstName: firstName,
          lastName: lastName,
          Image: Image
        }
      })
      return newUser;
    }
    catch (error) {
      throw new ForbiddenException("User already exists");
    }
  }

  async signToken(payload: {
    id: number,
    login: string,
    email: string
  }): Promise<{ access_tokens: string }> {
    const token = await this.jwt.signAsync(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '12h'
    });
    return { access_tokens: token };
  }

  async verifyToken(token: { access_tokens: string }) {
    try {
      const payload = await this.jwt.verifyAsync(token.access_tokens, {
        secret: this.config.get('JWT_SECRET')
      });
      return payload;
    } catch (error) {
      throw new ForbiddenException("Invalid Token");
    }
  }
}