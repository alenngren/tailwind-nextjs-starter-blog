import { createClient } from 'redis'
import { NextResponse } from 'next/server'

// Labels for /dop-john photos. One Redis set, members are "<photoId>\t<name>".
const KEY = 'dop:labels'

const connect = () => createClient({ url: process.env.dopdb_REDIS_URL }).connect()
let client: ReturnType<typeof connect> | undefined
const redis = () => (client ??= connect())

export const dynamic = 'force-dynamic'

async function all() {
  const members = await (await redis()).sMembers(KEY)
  return members.map((m) => {
    const [id, name] = m.split('\t')
    return { id, name }
  })
}

export async function GET() {
  return NextResponse.json(await all())
}

export async function POST(req: Request) {
  const { action, id, name: rawName } = await req.json()
  const name = String(rawName ?? '')
    .trim()
    .slice(0, 40)
  if (!name || name.includes('\t')) return NextResponse.json({ error: 'bad name' }, { status: 400 })
  if (action !== 'removeAll' && !/^[\w-]+$/.test(String(id)))
    return NextResponse.json({ error: 'bad id' }, { status: 400 })

  const r = await redis()
  if (action === 'add') await r.sAdd(KEY, `${id}\t${name}`)
  else if (action === 'remove') await r.sRem(KEY, `${id}\t${name}`)
  else if (action === 'removeAll') {
    const doomed = (await all()).filter((l) => l.name === name).map((l) => `${l.id}\t${l.name}`)
    if (doomed.length) await r.sRem(KEY, doomed)
  } else return NextResponse.json({ error: 'bad action' }, { status: 400 })

  return NextResponse.json(await all())
}
