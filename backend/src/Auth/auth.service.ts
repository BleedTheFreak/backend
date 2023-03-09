import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import axios from "axios";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService , private config : ConfigService) { }
  async Auth(code: string) {
    const payload = {
      grant_type: this.config.get('GRANT_TYPE'),
      client_id: this.config.get('CLIENT_ID'),
      client_secret: this.config.get('CLIENT_SECRET'),
      code: code,
      redirect_uri:  this.config.get('REDIRECT_URI'),
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
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') 
          return { code: 400, message: "User already exists" }
      }
    }
  }
}