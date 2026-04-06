export type BookId =
  | 'genesis'
  | 'exodus'
  | 'leviticus'
  | 'numbers'
  | 'deuteronomy'
  | 'joshua'
  | 'judges'
  | 'ruth'
  | '1-samuel'
  | '2-samuel'
  | '1-kings'
  | '2-kings'
  | '1-chronicles'
  | '2-chronicles'
  | 'ezra'
  | 'nehemiah'
  | 'esther'
  | 'job'
  | 'psalms'
  | 'proverbs'
  | 'ecclesiastes'
  | 'song-of-solomon'
  | 'isaiah'
  | 'jeremiah'
  | 'lamentations'
  | 'ezekiel'
  | 'daniel'
  | 'hosea'
  | 'joel'
  | 'amos'
  | 'obadiah'
  | 'jonah'
  | 'micah'
  | 'nahum'
  | 'habakkuk'
  | 'zephaniah'
  | 'haggai'
  | 'zechariah'
  | 'malachi'
  | 'matthew'
  | 'mark'
  | 'luke'
  | 'john'
  | 'acts'
  | 'romans'
  | '1-corinthians'
  | '2-corinthians'
  | 'galatians'
  | 'ephesians'
  | 'philippians'
  | 'colossians'
  | '1-thessalonians'
  | '2-thessalonians'
  | '1-timothy'
  | '2-timothy'
  | 'titus'
  | 'philemon'
  | 'hebrews'
  | 'james'
  | '1-peter'
  | '2-peter'
  | '1-john'
  | '2-john'
  | '3-john'
  | 'jude'
  | 'revelation'

export type TranslationId = 'ara' | 'acf' | 'nvi'

export type BibleBookData = Record<BookId, Record<number, Record<number, string>>>

export interface BookMeta {
  id: string
  name: string
  abbrev: string
  testament: 'old' | 'new'
  chapters: number
}

export interface TranslationMeta {
  id: TranslationId
  name: string
  shortName: string
  language: string
}

export interface BibleTranslation {
  id: TranslationId
  name: string
  shortName: string
  language: string
  data: BibleBookData
}

export interface CrossReferenceEntry {
  bookId: string
  chapter: number
  verse: number
}

export type CrossReferenceMap = Record<
  string,
  Record<number, Record<number, CrossReferenceEntry[]>>
>
