import { AggregateRoot } from '@/core/entities/aggregate-root.js'
import { Slug } from './value-objects/slug.js'
import type { UniqueEntityId } from '@/core/entities/unique-entity-id.js'
import type { Optional } from '@/core/types/optional.js'
import dayjs from 'dayjs'
import { QuestionAttachmentList } from './question-attachment-list.js'
import { BestQuestionAnswerChooseEvent } from '../events/best-question-answer-choose-event.js'

export interface QuestionProps {
  authorId: UniqueEntityId
  bestAnswerId?: UniqueEntityId | null
  attachments: QuestionAttachmentList
  slug: Slug
  title: string
  content: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId() {
    return this.props.authorId
  }

  get bestAnswerId(): UniqueEntityId | undefined | null {
    return this.props.bestAnswerId
  }

  get attachments() {
    return this.props.attachments
  }

  get slug() {
    return this.props.slug
  }

  get title() {
    return this.props.title
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'day') <= 3
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...')
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments

    this.touch()
  }

  set content(content: string) {
    this.props.content = content

    this.touch()
  }

  set title(title: string) {
    this.props.title = title
    this.props.slug = Slug.createFromText(title)

    this.touch()
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined | null) {
    if (bestAnswerId && this.props.bestAnswerId !== bestAnswerId) {
      const bestQuestionAnswerChooseEvent = new BestQuestionAnswerChooseEvent(
        this,
        bestAnswerId,
      )

      this.addDomainEvent(bestQuestionAnswerChooseEvent)
    }

    this.props.bestAnswerId = bestAnswerId

    this.touch()
  }

  static create(
    props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>,
    id?: UniqueEntityId,
  ) {
    const question = new Question(
      {
        ...props,
        attachments: props.attachments ?? new QuestionAttachmentList(),
        slug: props.slug ?? Slug.createFromText(props.title),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return question
  }
}
