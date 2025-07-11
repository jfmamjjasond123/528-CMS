import { CollectionConfig } from 'payload'
import { Title } from '@/Fields/Title'

const QuestionOptionDistractor: CollectionConfig = {
  slug: 'distractorTypes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'improvementText'],
    description: 'Manage distractor types for question options',
  },
  access: {
    read: () => true,
  },
  fields: [
    Title,
    {
      name: 'improvementText',
      type: 'text',
      label: 'Improvement Text',
      admin: {
        description: 'Suggestion for how to improve or avoid this type of distractor',
      },
    },
  ],
}

export default QuestionOptionDistractor
