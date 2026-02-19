import { authDTO } from '@/infra/http/controllers/auth.controller'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { randomUUID } from 'node:crypto'

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async signIn(data: authDTO) {
    // TODO: Implements a user module/service and injects here
    // to find the user by email
    const payload = { sub: randomUUID(), ...data }

    const access_token = await this.jwtService.signAsync(payload)

    return {
      access_token,
    }
  }
}
