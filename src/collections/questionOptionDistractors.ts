import { CollectionConfig } from 'payload'
import { Title } from '@/Fields/Title'

const QuestionOptionDistractor: CollectionConfig = {
  slug: 'distractorTypes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title'], // Removed 'description'
    description: 'Manage distractor types for question options',
  },
  access: {
    read: () => true,
  },
  fields: [
    Title, // Only title now
  ],
}

export default QuestionOptionDistractor
