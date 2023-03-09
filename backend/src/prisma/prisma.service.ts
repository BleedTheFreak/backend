import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: "postgresql://bleedthefreak:bleedthefreak@ytaya@localhost:5432/pong_db?schema=public",
                },
            },
        });
    }
}
