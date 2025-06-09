import { CollectionConfig } from 'payload'
import { Title } from '@/Fields/Title'
import { slateEditor } from '@payloadcms/richtext-slate'

const Passages: CollectionConfig = {
  slug: 'passages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'exam'],
  },
  access: {
    read: () => true,
  },
  fields: [
    Title,
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
    {
      name: 'questions',
      type: 'relationship',
      relationTo: 'passageQuestions',
      hasMany: true,
      admin: {
        description: 'Questions associated with this passage',
      },
    },
  ],
}

export default Passages
