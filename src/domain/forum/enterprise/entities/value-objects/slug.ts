export class Slug {
  private constructor(public value: string) {}

  static create(slug: string) {
    return new Slug(slug)
  }

  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // substitui espaços por -
      .replace(/[^\w-]+/g, '') // remove tudo que não for palavra ou -
      .replace(/_/g, '-') // substitui underline por -
      .replace(/--+/g, '-') // substitui múltiplos - por um só
      .replace(/-$/g, '') // remove - do final

    return new Slug(slugText)
  }
}
