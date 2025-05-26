import { CollectionConfig } from 'payload'

const Instructors: CollectionConfig = {
  slug: 'instructors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
  ],
}

export default Instructors
