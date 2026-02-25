import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'

@Injectable()
export class BcryptHasher implements HashComparer, HashGenerator {
  private HASH_SALT_LENGTH = 8

  async hash(plain: string): Promise<string> {
    const passwordHash = await hash(plain, this.HASH_SALT_LENGTH)

    return passwordHash
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    const isPasswordCorrectly = await compare(plain, hash)

    return isPasswordCorrectly
  }
}
