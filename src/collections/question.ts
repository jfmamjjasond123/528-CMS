import { CollectionConfig } from 'payload'

const Questions: CollectionConfig = {
  slug: 'questions',
  admin: {
    useAsTitle: 'questionText',
    listSearchableFields: ['questionText'],
    defaultColumns: ['questionText', 'type', 'lesson.module.title'],
  },
  fields: [
    {
      name: 'questionText',
      type: 'text',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Quiz', value: 'quiz' },
        { label: 'Exercise', value: 'exercise' },
      ],
    },
    {
      name: 'options',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'option',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'correctAnswer',
      type: 'text',
      required: true,
    },
    {
      name: 'lessons',
      type: 'relationship',
      relationTo: 'lessons',
      required: true,
    },
  ],
}

export default Questions
