// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Lessons } from './collections/lesson'
import Questions from './collections/question'
import Modules from './collections/module'
import Courses from './collections/course'
import Media from './collections/Media'
import Categories from './collections/category'
import Instructors from './collections/instructor'
import Levels from './collections/level'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cors: '*',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Lessons,
    Questions,
    Modules,
    Courses,
    Categories,
    Instructors,
    Levels,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
<<<<<<< HEAD
    idType: 'uuid',
=======
    schemaName: 'payload_cms',
>>>>>>> 21474cda0db6d5fc347e6d91c1a59ea6614ffdf6
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
