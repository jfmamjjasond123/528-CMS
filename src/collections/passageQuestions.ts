// import { DistractorType } from './../payload-types'
import { CollectionConfig } from 'payload'
import { slateEditor } from '@payloadcms/richtext-slate'
import { v4 as uuidv4 } from 'uuid'

const Questions: CollectionConfig = {
  slug: 'passageQuestions',
  admin: {
    useAsTitle: 'questionTitle',
    defaultColumns: ['questionTitle', 'passage', 'skill', 'questionType'],
    pagination: {
      defaultLimit: 10,
      limits: [10, 50, 100, 1000],
    },
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'passage',
      type: 'relationship',
      relationTo: 'passages',
      admin: {
        description: 'Please select the passage this question belongs to',
      },
      required: true,
    },
    {
      name: 'skill',
      type: 'relationship',
      relationTo: 'questionSkills',
      admin: {
        description: 'Select the skill this question tests',
      },
    },
    {
      name: 'questionType',
      type: 'relationship',
      relationTo: 'questionTypes',
      admin: {
        description: 'Select the type of question',
      },
    },
    {
      name: 'questionTitle',
      type: 'text',
      admin: {
        description: 'Please enter the question title',
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
            // 'upload',
            'textAlign',
            // 'relationship',
          ],
          leaves: [
            'bold',
            'italic',
            'underline',
            'code',
            'strikethrough',
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
      minRows: 2,
      validate: (value) => {
        const opts =
          (value as {
            isCorrect?: boolean
            distractorType?: any
          }[]) ?? []
        const correctCount = (value ?? []).filter((opt: any) => opt?.isCorrect === true).length
        const correctOpts = opts.filter((o: any) => o?.isCorrect)
        if (correctCount === 0) {
          return 'You must mark one option as the correct answer.'
        }
        if (correctCount > 1) {
          return 'Only one option can be marked as correct.'
        }
        if (correctOpts[0]?.distractorType) {
          return 'The correct option cannot have a distractor type.'
        }
        return true
      },
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
          name: 'distractorType',
          type: 'relationship',
          relationTo: 'distractorTypes',
          admin: {
            description: 'Select the distractor type for this option (optional)',
            condition: (data, siblingData, {}) => {
              return siblingData?.isCorrect === false // Show only if NOT correct
            },
          },
        },
        // {
        //   name: 'image',
        //   type: 'upload',
        //   relationTo: 'media',
        //   admin: {
        //     description: 'Upload an image for this option (optional)',
        //   },
        // },
        {
          name: 'isCorrect',
          type: 'checkbox',
          label: 'Correct Answer',
          admin: {
            description: 'Mark this option as the correct answer',
          },
          required: true,
        },
        {
          name: 'optionExplanation',
          type: 'text',
          admin: {
            description: 'Provide an explanation for this option (optional)',
          },
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
            // 'upload',
            'textAlign',
            // 'relationship',
          ],
          leaves: [
            'bold',
            'italic',
            'underline',
            'code',
            {
              name: 'highlight',
              Button: '@/components/HighlightButton',
              Leaf: '@/components/HighlightLeaf',
            },
          ],
        },
      }),
    },
  ],
}

export default Questions
