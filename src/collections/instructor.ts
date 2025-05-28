import { CollectionConfig } from 'payload'

const Instructors: CollectionConfig = {
  slug: 'instructors',
  access: {
    read: () => true,
  },
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
