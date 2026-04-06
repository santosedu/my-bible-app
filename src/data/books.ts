import type { BookMeta } from '@/types'

export const books: BookMeta[] = [
  { id: 'genesis', name: 'Gênesis', abbrev: 'Gn', testament: 'old', chapters: 50 },
  { id: 'exodus', name: 'Êxodo', abbrev: 'Êx', testament: 'old', chapters: 40 },
  { id: 'leviticus', name: 'Levítico', abbrev: 'Lv', testament: 'old', chapters: 27 },
  { id: 'numbers', name: 'Números', abbrev: 'Nm', testament: 'old', chapters: 36 },
  { id: 'deuteronomy', name: 'Deuteronômio', abbrev: 'Dt', testament: 'old', chapters: 34 },
  { id: 'joshua', name: 'Josué', abbrev: 'Js', testament: 'old', chapters: 24 },
  { id: 'judges', name: 'Juízes', abbrev: 'Jz', testament: 'old', chapters: 21 },
  { id: 'ruth', name: 'Rute', abbrev: 'Rt', testament: 'old', chapters: 4 },
  { id: '1-samuel', name: '1 Samuel', abbrev: '1Sm', testament: 'old', chapters: 31 },
  { id: '2-samuel', name: '2 Samuel', abbrev: '2Sm', testament: 'old', chapters: 24 },
  { id: '1-kings', name: '1 Reis', abbrev: '1Rs', testament: 'old', chapters: 22 },
  { id: '2-kings', name: '2 Reis', abbrev: '2Rs', testament: 'old', chapters: 25 },
  { id: '1-chronicles', name: '1 Crônicas', abbrev: '1Cr', testament: 'old', chapters: 29 },
  { id: '2-chronicles', name: '2 Crônicas', abbrev: '2Cr', testament: 'old', chapters: 36 },
  { id: 'ezra', name: 'Esdras', abbrev: 'Ed', testament: 'old', chapters: 10 },
  { id: 'nehemiah', name: 'Neemias', abbrev: 'Ne', testament: 'old', chapters: 13 },
  { id: 'esther', name: 'Ester', abbrev: 'Et', testament: 'old', chapters: 10 },
  { id: 'job', name: 'Jó', abbrev: 'Jó', testament: 'old', chapters: 42 },
  { id: 'psalms', name: 'Salmos', abbrev: 'Sl', testament: 'old', chapters: 150 },
  { id: 'proverbs', name: 'Provérbios', abbrev: 'Pv', testament: 'old', chapters: 31 },
  { id: 'ecclesiastes', name: 'Eclesiastes', abbrev: 'Ec', testament: 'old', chapters: 12 },
  { id: 'song-of-solomon', name: 'Cânticos', abbrev: 'Ct', testament: 'old', chapters: 8 },
  { id: 'isaiah', name: 'Isaías', abbrev: 'Is', testament: 'old', chapters: 66 },
  { id: 'jeremiah', name: 'Jeremias', abbrev: 'Jr', testament: 'old', chapters: 52 },
  { id: 'lamentations', name: 'Lamentações', abbrev: 'Lm', testament: 'old', chapters: 5 },
  { id: 'ezekiel', name: 'Ezequiel', abbrev: 'Ez', testament: 'old', chapters: 48 },
  { id: 'daniel', name: 'Daniel', abbrev: 'Dn', testament: 'old', chapters: 12 },
  { id: 'hosea', name: 'Oséias', abbrev: 'Os', testament: 'old', chapters: 14 },
  { id: 'joel', name: 'Joel', abbrev: 'Jl', testament: 'old', chapters: 3 },
  { id: 'amos', name: 'Amós', abbrev: 'Am', testament: 'old', chapters: 9 },
  { id: 'obadiah', name: 'Obadias', abbrev: 'Ob', testament: 'old', chapters: 1 },
  { id: 'jonah', name: 'Jonas', abbrev: 'Jn', testament: 'old', chapters: 4 },
  { id: 'micah', name: 'Miquéias', abbrev: 'Mq', testament: 'old', chapters: 7 },
  { id: 'nahum', name: 'Naum', abbrev: 'Na', testament: 'old', chapters: 3 },
  { id: 'habakkuk', name: 'Habacuque', abbrev: 'Hc', testament: 'old', chapters: 3 },
  { id: 'zephaniah', name: 'Sofonias', abbrev: 'Sf', testament: 'old', chapters: 3 },
  { id: 'haggai', name: 'Ageu', abbrev: 'Ag', testament: 'old', chapters: 2 },
  { id: 'zechariah', name: 'Zacarias', abbrev: 'Zc', testament: 'old', chapters: 14 },
  { id: 'malachi', name: 'Malaquias', abbrev: 'Ml', testament: 'old', chapters: 4 },
  { id: 'matthew', name: 'Mateus', abbrev: 'Mt', testament: 'new', chapters: 28 },
  { id: 'mark', name: 'Marcos', abbrev: 'Mc', testament: 'new', chapters: 16 },
  { id: 'luke', name: 'Lucas', abbrev: 'Lc', testament: 'new', chapters: 24 },
  { id: 'john', name: 'João', abbrev: 'Jo', testament: 'new', chapters: 21 },
  { id: 'acts', name: 'Atos', abbrev: 'At', testament: 'new', chapters: 28 },
  { id: 'romans', name: 'Romanos', abbrev: 'Rm', testament: 'new', chapters: 16 },
  { id: '1-corinthians', name: '1 Coríntios', abbrev: '1Co', testament: 'new', chapters: 16 },
  { id: '2-corinthians', name: '2 Coríntios', abbrev: '2Co', testament: 'new', chapters: 13 },
  { id: 'galatians', name: 'Gálatas', abbrev: 'Gl', testament: 'new', chapters: 6 },
  { id: 'ephesians', name: 'Efésios', abbrev: 'Ef', testament: 'new', chapters: 6 },
  { id: 'philippians', name: 'Filipenses', abbrev: 'Fp', testament: 'new', chapters: 4 },
  { id: 'colossians', name: 'Colossenses', abbrev: 'Cl', testament: 'new', chapters: 4 },
  { id: '1-thessalonians', name: '1 Tessalonicenses', abbrev: '1Ts', testament: 'new', chapters: 5 },
  { id: '2-thessalonians', name: '2 Tessalonicenses', abbrev: '2Ts', testament: 'new', chapters: 3 },
  { id: '1-timothy', name: '1 Timóteo', abbrev: '1Tm', testament: 'new', chapters: 6 },
  { id: '2-timothy', name: '2 Timóteo', abbrev: '2Tm', testament: 'new', chapters: 4 },
  { id: 'titus', name: 'Tito', abbrev: 'Tt', testament: 'new', chapters: 3 },
  { id: 'philemon', name: 'Filemom', abbrev: 'Fm', testament: 'new', chapters: 1 },
  { id: 'hebrews', name: 'Hebreus', abbrev: 'Hb', testament: 'new', chapters: 13 },
  { id: 'james', name: 'Tiago', abbrev: 'Tg', testament: 'new', chapters: 5 },
  { id: '1-peter', name: '1 Pedro', abbrev: '1Pe', testament: 'new', chapters: 5 },
  { id: '2-peter', name: '2 Pedro', abbrev: '2Pe', testament: 'new', chapters: 3 },
  { id: '1-john', name: '1 João', abbrev: '1Jo', testament: 'new', chapters: 5 },
  { id: '2-john', name: '2 João', abbrev: '2Jo', testament: 'new', chapters: 1 },
  { id: '3-john', name: '3 João', abbrev: '3Jo', testament: 'new', chapters: 1 },
  { id: 'jude', name: 'Judas', abbrev: 'Jd', testament: 'new', chapters: 1 },
  { id: 'revelation', name: 'Apocalipse', abbrev: 'Ap', testament: 'new', chapters: 22 },
]

const bookMap = new Map<string, BookMeta>()
for (const book of books) {
  bookMap.set(book.id, book)
}

export function getBookMeta(bookId: string): BookMeta | null {
  return bookMap.get(bookId) ?? null
}

export function getBookById(bookId: string): BookMeta | undefined {
  return bookMap.get(bookId)
}

export function getAllBooks(): BookMeta[] {
  return books
}

export function getTotalChapters(bookId?: string): number {
  if (bookId) {
    return bookMap.get(bookId)?.chapters ?? 0
  }
  return books.reduce((sum, b) => sum + b.chapters, 0)
}

export function getBooksByTestament(testament: 'old' | 'new'): BookMeta[] {
  return books.filter((b) => b.testament === testament)
}

export interface TestamentGroup {
  testament: 'old' | 'new'
  label: string
  books: BookMeta[]
}

export const testamentGroups: TestamentGroup[] = [
  {
    testament: 'old',
    label: 'Antigo Testamento',
    books: getBooksByTestament('old'),
  },
  {
    testament: 'new',
    label: 'Novo Testamento',
    books: getBooksByTestament('new'),
  },
]
