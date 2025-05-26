import { CollectionConfig } from 'payload'

const Levels: CollectionConfig = {
  slug: 'levels',
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
