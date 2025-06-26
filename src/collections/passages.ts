import { CollectionConfig } from 'payload'
import { Title } from '@/Fields/Title'
import { slateEditor } from '@payloadcms/richtext-slate'

const Passages: CollectionConfig = {
  slug: 'passages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subject', 'exam'],
    pagination: {
      defaultLimit: 10,
      limits: [10, 50, 100, 1000],
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    Title,
    {
      name: 'subject',
      type: 'relationship',
      relationTo: 'subjects',
      admin: {
        description: 'Subject this passage belongs to',
      },
    },
    {
      name: 'exam',
      type: 'relationship',
      relationTo: 'exams',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      editor: slateEditor({
        admin: {
          elements: [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'blockquote',
            'link',
            'ol',
            'ul',
            'indent',
            'upload',
            'textAlign',
            'relationship',
          ],
          leaves: ['bold', 'italic', 'underline', 'strikethrough', 'code'],
        },
      }),
      required: true,
    },
    // {
    //   name: 'questions',
    //   type: 'relationship',
    //   relationTo: 'passageQuestions',
    //   hasMany: true,
    //   admin: {
    //     description: 'Questions associated with this passage',
    //   },
    // },
  ],
}

export default Passages
