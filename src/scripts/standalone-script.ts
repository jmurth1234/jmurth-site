import { getPayload } from 'payload'
import config from '@payload-config'
import 'dotenv/config'

async function run() {
  const payload = await getPayload({ config })

  const pages = await payload.find({
    collection: 'pages',
  })

  console.log(pages)
  process.exit(0)
}

run().catch(console.error)
