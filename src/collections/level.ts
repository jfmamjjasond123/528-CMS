import { CollectionConfig } from 'payload'

const Levels: CollectionConfig = {
  slug: 'levels',
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

export default Levels
