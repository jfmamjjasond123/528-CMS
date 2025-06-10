import { CollectionConfig } from 'payload'
import { Title } from '@/Fields/Title'
import { Slug } from '@/Fields/slug'

const Exams: CollectionConfig = {
  slug: 'exams',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'totalTimeInMinutes'],
  },
  access: {
    read: () => true,
  },
  fields: [
    Title,
    Slug,
    {
      name: 'totalTimeInMinutes',
      label: 'Total Time (Minutes)',
      type: 'number',
      required: true,
    },
    {
      name: 'passages',
      type: 'relationship',
      relationTo: 'passages',
      hasMany: true,
      admin: {
        description: 'Please select the passages for this exam',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: ['Full-Length Exam', 'Q-bank', 'Timed-Q-bank'],
      defaultValue: 'Q-bank',
      required: true,
    },
  ],
}

export default Exams
