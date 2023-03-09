import { Injectable } from "@nestjs/common";
import axios from "axios";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }
  async Auth(code: string) {
    const payload = {
      grant_type: "authorization_code",
      client_id: 'af6ee2092070d65383c01524be873ff60db72f8db7a5a806ccc6bfb4d7154ff7',
      client_secret: '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',
      code: code,
      redirect_uri: 'http://localhost:8080/auth/token',
    }
    try {
      const rest = await axios.post("https://api.intra.42.fr/oauth/token", payload);
      let res = await axios.get("https://api.intra.42.fr/v2/me", {
        headers: {
          Authorization: `Bearer ${rest.data.access_token}`
        }
      });
      const { email, login, first_name, last_name, image } = res.data;
      const { link } = image;
      // return { email, login, first_name, last_name, link };
      // return res.data
      const user = await this.prisma.user.findUnique({
        where: { email: email }
      })
      if (user) {
        return { code: 200, message: "User already exists" }
      }
      const newUser = await this.prisma.user.create({
        data: {
          email: email,
          login: login,
          firstName: first_name,
          lastName: last_name,
          Image: link
        }
      })
      console.log(newUser);
      return { code: 200, message: "User created" }
    } catch (error) {
      console.log(error);
      
    }
  }
}