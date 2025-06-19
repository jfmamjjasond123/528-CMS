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
// import Questions from './collections/question'
import Modules from './collections/module'
import Courses from './collections/course'
import Media from './collections/Media'
import Categories from './collections/category'
import Instructors from './collections/instructor'
import Levels from './collections/level'
import Exams from './collections/exams'
import Passages from './collections/passages'
import PassageQuestions from './collections/passageQuestions'
import Subjects from './collections/subjects'
import SubjectCategory from './collections/subjectCategory'
import QuestionSkill from './collections/questionSkill'
import QuestionType from './collections/questionTypes'
import QuestionOptionDistractor from './collections/questionOptionDistractors'
import { muxVideoPlugin } from '@oversightstudio/mux-video'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  cors: '*',
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      graphics: {
        Logo: '@/components/CustomLogo',
      },
      // afterLogin: ['@/components/LoginButton'],
    },
  },
  routes: {
    admin: '/',
  },
  collections: [
    Users,
    Media,
    Lessons,
    // Questions,
    Modules,
    Courses,
    Categories,
    Instructors,
    Levels,
    Passages,
    PassageQuestions,
    Exams,
    Subjects,
    SubjectCategory,
    QuestionSkill,
    QuestionType,
    QuestionOptionDistractor,
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
    idType: 'uuid',
    schemaName: 'payload_cms',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
    muxVideoPlugin({
      enabled: true,
      access: () => true,
      initSettings: {
        tokenId: process.env.MUX_TOKEN_ID || '',
        tokenSecret: process.env.MUX_TOKEN_SECRET || '',
        webhookSecret: process.env.MUX_WEBHOOK_SIGNING_SECRET || '',
      },
      uploadSettings: {
        cors_origin: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
      },
    }),
  ],
})
