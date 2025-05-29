import { Title } from '@/Fields/Title'
import { CollectionConfig } from 'payload'

const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'mediaType', 'externalUrl'],
  },
  fields: [
    Title,
    {
      name: 'mediaType',
      type: 'select',
      required: true,
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
      ],
    },
    // {
    //   name: 'externalUrl',
    //   type: 'text',
    //   label: 'External URL (e.g., S3, YouTube)',
    //   required: false,
    //   admin: {
    //     description: 'Use this instead of uploading a file directly.',
    //   },
    // },
    {
      name: 'description',
      type: 'richText',
      required: false,
    },
  ],
  access: {
    read: () => true,
  },
}

export default Media
