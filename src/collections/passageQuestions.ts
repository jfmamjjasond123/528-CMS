import { CollectionConfig } from 'payload'
import { slateEditor } from '@payloadcms/richtext-slate'
import { v4 as uuidv4 } from 'uuid'

const Questions: CollectionConfig = {
  slug: 'passageQuestions',
  admin: {
    useAsTitle: 'questionNumber',
    defaultColumns: ['questionNumber', 'passage'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'passage',
      type: 'relationship',
      relationTo: 'passages',
      // required: true,
      admin: {
        description: 'Please select the passage this question belongs to',
      },
    },
    {
      name: 'questionNumber',
      type: 'number',
      // required: true,
      admin: {
        description: 'Please enter the question number',
      },
    },
    {
      name: 'text',
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
          leaves: ['bold', 'italic', 'underline', 'code'],
        },
      }),
      required: true,
    },
    // {
    //   name: 'image',
    //   type: 'upload',
    //   relationTo: 'media',
    //   admin: {
    //     description: 'Upload an image for the question (optional)',
    //   },
    // },
    {
      name: 'options',
      type: 'array',
      fields: [
        {
          name: 'id',
          type: 'text',
          defaultValue: () => uuidv4(),
          admin: {
            readOnly: true,
            hidden: true,
          },
        },
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Upload an image for this option (optional)',
          },
        },
        {
          name: 'isCorrect',
          type: 'checkbox',
          label: 'Correct Answer',
          admin: {
            description: 'Mark this option as the correct answer',
          },
          required: true,
        },
      ],
      admin: {
        description:
          'Add options for the question. Make sure to mark exactly one option as correct.',
      },
    },
    {
      name: 'Question Explanation',
      type: 'richText',
      admin: {
        description: 'Give the explanation for the question if available',
      },
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
          leaves: ['bold', 'italic', 'underline', 'code'],
        },
      }),
    },
  ],
}

export default Questions
