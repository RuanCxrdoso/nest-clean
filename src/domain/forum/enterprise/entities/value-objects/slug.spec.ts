import { describe, expect, it } from 'vitest'
import { Slug } from './slug'

describe('VOs Slug tests', () => {
  it('should be able to format a title to a slug pattern', () => {
    const text = '  Como    criar um    Slug em    TypeScript !!!  '

    const slug = Slug.createFromText(text)

    expect(slug.value).toEqual('como-criar-um-slug-em-typescript')
  })
})
