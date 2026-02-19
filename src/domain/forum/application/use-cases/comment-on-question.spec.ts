import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryQuestionRepository } from '../../../../../test/repositories/in-memory-question-repository.js'
import { makeQuestion } from '../../../../../test/factories/make-question.js'
import { InMemoryQuestionCommentRepository } from '../../../../../test/repositories/in-memory-question-comment-repository.js'
import { CommentOnQuestionUseCase } from './comment-on-question.js'
import { InMemoryQuestionAttachmentsRepository } from '../../../../../test/repositories/in-memory-question-attachments-repository.js'

let questionAttachmentRepository: InMemoryQuestionAttachmentsRepository
let questionRepository: InMemoryQuestionRepository
let questionCommentsRepository: InMemoryQuestionCommentRepository
let sut: CommentOnQuestionUseCase

describe('Comment on question tests', () => {
  beforeEach(() => {
    questionAttachmentRepository = new InMemoryQuestionAttachmentsRepository()
    questionRepository = new InMemoryQuestionRepository(
      questionAttachmentRepository,
    )
    questionCommentsRepository = new InMemoryQuestionCommentRepository()
    sut = new CommentOnQuestionUseCase(
      questionCommentsRepository,
      questionRepository,
    )
  })

  it('should be able to comment on a question', async () => {
    const newQuestion = makeQuestion({ content: 'Conteúdo da questão' })
    await questionRepository.create(newQuestion)

    await sut.execute({
      authorId: newQuestion.authorId.toString(),
      questionId: newQuestion.id.toString(),
      content: newQuestion.content,
    })

    expect(questionCommentsRepository.questionComments[0]?.content).toEqual(
      'Conteúdo da questão',
    )
  })
})
