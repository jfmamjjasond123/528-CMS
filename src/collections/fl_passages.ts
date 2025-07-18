// collections/fl_passages.ts

import { CollectionConfig } from 'payload'
import { Title } from '@/Fields/Title'
import { slateEditor } from '@payloadcms/richtext-slate'

const FL_Passages: CollectionConfig = {
  slug: 'FL_Passages',
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
  hooks: {
    beforeChange: [
      async ({ data, req, originalDoc }) => {
        // Only log if this is a manual update (not from sync)
        const isSyncUpdate =
          req.headers && 'x-sync-update' in req.headers && req.headers['x-sync-update'] === 'true'

        if (!isSyncUpdate && data.questions) {
          console.log(
            `📝 Manual questions update for passage ${originalDoc?.id || 'new'}: ${data.questions.length} questions`,
          )
        }

        return data
      },
    ],
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
      required: true,
    },
    // {
    //   name: 'exam',
    //   type: 'relationship',
    //   relationTo: 'FL_exams',
    //   required: true,
    // },
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
          leaves: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            'code',
            {
              name: 'highlight',
              Button: '@/components/HighlightButton',
              Leaf: '@/components/HighlightLeaf',
            },
          ],
        },
      }),
      required: true,
    },
    {
      name: 'questions',
      type: 'relationship',
      relationTo: 'FL_passage_questions',
      hasMany: true,
      admin: {
        description: 'Questions associated with this passage (automatically managed)',
        readOnly: true,
        // disabled: true,
      },
    },
  ],
}

export default FL_Passages
