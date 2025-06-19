import { CollectionConfig } from 'payload'
import { Title } from '@/Fields/Title'

const QuestionType: CollectionConfig = {
  slug: 'questionTypes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title'],
  },
  access: {
    read: () => true,
  },
  fields: [Title],
}

export default QuestionType
