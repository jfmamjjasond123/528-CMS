import { Slug } from '@/Fields/slug'
import { Title } from '@/Fields/Title'
import { CollectionConfig } from 'payload'

const Modules: CollectionConfig = {
  slug: 'modules',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: [
      'title',
      'description',
      'course.category',
      'course.instructor',
      'course.status',
    ],
  },
  fields: [
    Title,
    Slug,
    {
      name: 'description',
      type: 'text',
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
    },
    {
      name: 'lessons',
      type: 'relationship',
      relationTo: 'lessons',
      hasMany: true,
    },
    {
      name: 'order',
      type: 'number',
      required: true,
    },
  ],
}

export default Modules
