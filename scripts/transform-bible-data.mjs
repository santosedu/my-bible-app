import fs from 'node:fs'
import path from 'node:path'

const BOOK_MAPPING = {
  gn: 'genesis', ex: 'exodus', lv: 'leviticus', nm: 'numbers', dt: 'deuteronomy',
  js: 'joshua', jz: 'judges', rt: 'ruth', '1sm': '1-samuel', '2sm': '2-samuel',
  '1rs': '1-kings', '2rs': '2-kings', '1cr': '1-chronicles', '2cr': '2-chronicles',
  ed: 'ezra', ne: 'nehemiah', et: 'esther', 'jó': 'job', sl: 'psalms',
  pv: 'proverbs', ec: 'ecclesiastes', ct: 'song-of-solomon', is: 'isaiah',
  jr: 'jeremiah', lm: 'lamentations', ez: 'ezekiel', dn: 'daniel', os: 'hosea',
  jl: 'joel', am: 'amos', ob: 'obadiah', jn: 'jonah', mq: 'micah',
  na: 'nahum', hc: 'habakkuk', sf: 'zephaniah', ag: 'haggai', zc: 'zechariah',
  ml: 'malachi', mt: 'matthew', mc: 'mark', lc: 'luke', jo: 'john',
  atos: 'acts', rm: 'romans', '1co': '1-corinthians', '2co': '2-corinthians',
  gl: 'galatians', ef: 'ephesians', fp: 'philippians', cl: 'colossians',
  '1ts': '1-thessalonians', '2ts': '2-thessalonians', '1tm': '1-timothy',
  '2tm': '2-timothy', tt: 'titus', fm: 'philemon', hb: 'hebrews',
  tg: 'james', '1pe': '1-peter', '2pe': '2-peter', '1jo': '1-john',
  '2jo': '2-john', '3jo': '3-john', jd: 'jude', ap: 'revelation',
}

const BIBLE_NAMES_TO_IDS = {
  'Genesis': 'genesis', 'Exodus': 'exodus', 'Leviticus': 'leviticus',
  'Numbers': 'numbers', 'Deuteronomy': 'deuteronomy', 'Joshua': 'joshua',
  'Judges': 'judges', 'Ruth': 'ruth', '1 Samuel': '1-samuel',
  '2 Samuel': '2-samuel', '1 Kings': '1-kings', '2 Kings': '2-kings',
  '1 Chronicles': '1-chronicles', '2 Chronicles': '2-chronicles',
  'Ezra': 'ezra', 'Nehemiah': 'nehemiah', 'Esther': 'esther',
  'Job': 'job', 'Psalms': 'psalms', 'Psalm': 'psalms',
  'Proverbs': 'proverbs', 'Ecclesiastes': 'ecclesiastes',
  'Song of Solomon': 'song-of-solomon', 'Isaiah': 'isaiah',
  'Jeremiah': 'jeremiah', 'Lamentations': 'lamentations',
  'Ezekiel': 'ezekiel', 'Daniel': 'daniel', 'Hosea': 'hosea',
  'Joel': 'joel', 'Amos': 'amos', 'Obadiah': 'obadiah',
  'Jonah': 'jonah', 'Micah': 'micah', 'Nahum': 'nahum',
  'Habakkuk': 'habakkuk', 'Zephaniah': 'zephaniah', 'Haggai': 'haggai',
  'Zechariah': 'zechariah', 'Malachi': 'malachi', 'Matthew': 'matthew',
  'Mark': 'mark', 'Luke': 'luke', 'John': 'john', 'Acts': 'acts',
  'Romans': 'romans', '1 Corinthians': '1-corinthians',
  '2 Corinthians': '2-corinthians', 'Galatians': 'galatians',
  'Ephesians': 'ephesians', 'Philippians': 'philippians',
  'Colossians': 'colossians', '1 Thessalonians': '1-thessalonians',
  '2 Thessalonians': '2-thessalonians', '1 Timothy': '1-timothy',
  '2 Timothy': '2-timothy', 'Titus': 'titus', 'Philemon': 'philemon',
  'Hebrews': 'hebrews', 'James': 'james', '1 Peter': '1-peter',
  '2 Peter': '2-peter', '1 John': '1-john', '2 John': '2-john',
  '3 John': '3-john', 'Jude': 'jude', 'Revelation': 'revelation',
}

function transformBible(rawData) {
  const result = {}
  for (const book of rawData) {
    const bookId = BOOK_MAPPING[book.abbrev]
    if (!bookId) {
      console.warn(`Unknown abbreviation: ${book.abbrev} (${book.name})`)
      continue
    }
    const chapters = {}
    book.chapters.forEach((verses, chapterIdx) => {
      const chapterNum = chapterIdx + 1
      const verseMap = {}
      verses.forEach((text, verseIdx) => {
        verseMap[verseIdx + 1] = text
      })
      chapters[chapterNum] = verseMap
    })
    result[bookId] = chapters
  }
  return result
}

const translations = [
  { id: 'ara', file: 'pt_aa_raw.json' },
  { id: 'acf', file: 'pt_acf_raw.json' },
  { id: 'nvi', file: 'pt_nvi_raw.json' },
]

const outDir = path.resolve('src/data/bible')

for (const { id, file } of translations) {
  const rawPath = path.join(outDir, file)
  const rawText = fs.readFileSync(rawPath, 'utf-8').replace(/^\uFEFF/, '')
  const raw = JSON.parse(rawText)
  const normalized = transformBible(raw)
  const bookCount = Object.keys(normalized).length
  const outPath = path.join(outDir, `${id}.ts`)
  const content = `// Auto-generated from thiagobodruk/bible (${id.toUpperCase()} translation)
// ${bookCount} books

import type { BibleBookData } from '@/types'

const data: BibleBookData = ${JSON.stringify(normalized, null, 2)} as BibleBookData

export default data
`
  fs.writeFileSync(outPath, content, 'utf-8')
  console.log(`Transformed ${id}: ${bookCount} books -> ${outPath}`)
}

console.log('\nBible data transformation complete.')
