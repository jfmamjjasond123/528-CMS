import { CollectionConfig } from 'payload'
import { Title } from '@/Fields/Title'

const FL_Exams: CollectionConfig = {
  slug: 'FL_exams',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'totalTimeInMinutes'],
  },
  access: {
    read: () => true,
  },
  fields: [
    Title,
    {
      name: 'totalTimeInMinutes',
      label: 'Total Time (Minutes)',
      type: 'number',
      required: true,
      admin: {
        description: 'If exam type is Q-bank, total is not required. Please give 0 minute as value',
      },
    },
    {
      name: 'passages',
      type: 'relationship',
      relationTo: 'FL_Passages',
      hasMany: true,
      admin: {
        description: 'Please select the passages for this exam',
      },
    },
    {
      name: 'type',
      type: 'select',
      options: ['Full-Length Exam', 'Q-bank', 'Timed-Q-bank'],
      defaultValue: 'Full-Length Exam',
      required: true,
      admin: {
        readOnly: true,
      },
    },
  ],
}

export default FL_Exams
