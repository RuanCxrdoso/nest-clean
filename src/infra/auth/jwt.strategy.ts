import { Env } from '@/infra/env'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import z from 'zod'

const accessTokenPayloadSchema = z.object({
  sub: z.uuid(),
})

export type AccessTokenPayloadDTO = z.infer<typeof accessTokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  validate(payload: AccessTokenPayloadDTO) {
    return accessTokenPayloadSchema.parse(payload)
  }
}
