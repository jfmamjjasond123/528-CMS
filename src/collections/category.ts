import { CollectionConfig } from 'payload'

const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
  ],
}

export default Categories
