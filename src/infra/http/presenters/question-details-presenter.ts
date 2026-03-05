import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from '@/infra/http/presenters/attachment-presenter'

export class QuestionDetailsPresenter {
  static toHTTP(question: QuestionDetails) {
    const {
      questionId,
      authorId,
      author,
      title,
      content,
      slug,
      attachments,
      bestAnswerId,
      createdAt,
      updatedAt,
    } = question

    return {
      questionId: questionId.toString(),
      authorId: authorId.toString(),
      author: author,
      title: title,
      content,
      slug: slug.value,
      attachments: attachments.map(AttachmentPresenter.toHTTP),
      bestAnswerId,
      createdAt,
      updatedAt,
    }
  }
}
