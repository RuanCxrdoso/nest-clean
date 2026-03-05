import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper'
import {
  Attachment as PrismaAttachment,
  Question,
  User,
} from 'generated/prisma/client'

type QuestionWithDetails = Question & { author: User } & {
  attachments: PrismaAttachment[]
}

export class QuestionWithDetailsMapper {
  static toDomain(raw: QuestionWithDetails) {
    return QuestionDetails.create({
      questionId: new UniqueEntityId(raw.id),
      authorId: new UniqueEntityId(raw.author.id),
      author: raw.author.name,
      title: raw.title,
      slug: Slug.create(raw.slug),
      content: raw.content,
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityId(raw.bestAnswerId)
        : null,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    })
  }
}
