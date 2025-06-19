import { CollectionConfig } from 'payload'
import { Title } from '@/Fields/Title'

const SubjectCategory: CollectionConfig = {
  slug: 'subjectCategories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subjects'],
  },
  access: {
    read: () => true,
  },
  fields: [
    Title,
    {
      name: 'subjects',
      type: 'relationship',
      relationTo: 'subjects',
      hasMany: true,
      admin: {
        description: 'Subjects belonging to this category',
      },
    },
  ],
}

export default SubjectCategory
