import type { NextApiHandler } from 'next'

import Database from '@/lib/server/notion-api/database'

export async function action () {
  const db = new Database()
  await db.syncAll()
  const entries = Object.values(db.pageMap)
  return {
    pages: db.pages.map(p => p.id),
    posts: db.posts.map(p => p.id),
    entryMap: Object.fromEntries(entries.map(page => [page.id, page.toJson()])),
    // For in-site navigation
    slugMap: Object.fromEntries(entries.map(page => [page.id, page.slug || page.hash])),
  }
}

export type Data = Awaited<ReturnType<typeof action>>

const handler: NextApiHandler = async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json(await action())
  } else {
    return res.status(204).end()
  }
}
export default handler
