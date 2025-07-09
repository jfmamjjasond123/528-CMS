import { CollectionConfig } from 'payload'
import { Title } from '@/Fields/Title'

const Subjects: CollectionConfig = {
  slug: 'subjects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subjectCategory', 'passages'],
  },
  access: {
    read: () => true,
  },
  fields: [
    Title,
    {
      name: 'subjectCategory',
      type: 'relationship',
      relationTo: 'subjectCategories',
      admin: {
        description: 'Category this subject belongs to',
      },
    },
    {
      name: 'passages',
      type: 'relationship',
      relationTo: 'passages',
      hasMany: true,
      admin: {
        description: 'Passages associated with this subject',
      },
    },
  ],
}

export default Subjects
