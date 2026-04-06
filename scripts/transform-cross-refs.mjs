import fs from 'node:fs'
import path from 'node:path'

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

function parseCrossRefs() {
  const crossRefs = {}
  let totalEntries = 0

  for (let i = 0; i < 7; i++) {
    const sql = fs.readFileSync(`/tmp/cross_refs_${i}.sql`, 'utf-8')
    const insertRegex = /VALUES\s*\(\s*'([^']+)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*'([^']+)'\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/g
    let match
    while ((match = insertRegex.exec(sql)) !== null) {
      const [, fromBook, fromChapter, fromVerse, toBook, toChapter, toVerseStart, toVerseEnd, votes] = match
      const fromBookId = BIBLE_NAMES_TO_IDS[fromBook]
      const toBookId = BIBLE_NAMES_TO_IDS[toBook]

      if (!fromBookId || !toBookId) continue

      if (!crossRefs[fromBookId]) crossRefs[fromBookId] = {}
      if (!crossRefs[fromBookId][fromChapter]) crossRefs[fromBookId][fromChapter] = {}
      if (!crossRefs[fromBookId][fromChapter][fromVerse]) crossRefs[fromBookId][fromChapter][fromVerse] = []

      crossRefs[fromBookId][fromChapter][fromVerse].push({
        bookId: toBookId,
        chapter: Number(toChapter),
        verseStart: Number(toVerseStart),
        verseEnd: Number(toVerseEnd),
        votes: Number(votes),
      })
      totalEntries++
    }
  }
  return { crossRefs, totalEntries }
}

const { crossRefs, totalEntries } = parseCrossRefs()

const bookCount = Object.keys(crossRefs).length
let chapterRefCount = 0
let verseRefCount = 0
for (const book of Object.values(crossRefs)) {
  for (const chapters of Object.values(book)) {
    chapterRefCount++
    for (const refs of Object.values(chapters)) {
      verseRefCount++
    }
  }
}

const outPath = path.resolve('src/data/crossReferences/data.ts')
const content = `// Auto-generated from scrollmapper/bible_databases (openbible.info cross-references)
// ${totalEntries} cross-reference entries across ${bookCount} books

import type { CrossReferenceMap } from '@/types'

const crossReferenceData: CrossReferenceMap = ${JSON.stringify(crossRefs, null, 2)} as CrossReferenceMap

export default crossReferenceData
`

fs.writeFileSync(outPath, content, 'utf-8')
console.log(`Cross-references: ${totalEntries} entries, ${bookCount} books, ${chapterRefCount} chapters, ${verseRefCount} verses with refs`)
console.log(`Output: ${outPath}`)
