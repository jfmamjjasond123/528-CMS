import { Slug } from '@/Fields/slug'
import { Title } from '@/Fields/Title'
import { CollectionConfig } from 'payload'

const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'instructor', 'status'],
  },
  fields: [
    Title,
    Slug,
    {
      name: 'icon_class',
      type: 'text',
      label: 'Icon (Lucide class name)',
    },
    {
      name: 'thumbnail',
      type: 'upload',
      relationTo: 'media',
    },
    // Optional: Uncomment if you'd rather use an image upload
    // {
    //   name: 'icon_image',
    //   type: 'upload',
    //   relationTo: 'media', // Make sure you have a media collection configured
    // },
    {
      name: 'description_short',
      type: 'text',
      required: true,
    },
    {
      name: 'description_long',
      type: 'richText',
    },
    {
      name: 'learning_outcomes',
      type: 'array',
      fields: [
        {
          name: 'outcome',
          type: 'text',
        },
      ],
    },
    {
      name: 'estimated_total_hours',
      type: 'text',
    },
    {
      name: 'modules',
      type: 'relationship',
      relationTo: 'modules',
      hasMany: true,
    },
    {
      name: 'category',
      type: 'text',
    },
    {
      name: 'instructor',
      type: 'text',
    },
    {
      name: 'level',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
}

export default Courses
