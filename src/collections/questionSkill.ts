import { CollectionConfig } from 'payload'
import { Title } from '@/Fields/Title'

const QuestionSkill: CollectionConfig = {
  slug: 'questionSkills',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title'],
  },
  access: {
    read: () => true,
  },
  fields: [Title],
}

export default QuestionSkill
