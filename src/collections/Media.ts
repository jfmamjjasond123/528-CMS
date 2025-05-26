import { CollectionConfig } from 'payload'

const Media: CollectionConfig = {
  slug: 'media',
  upload: true, // ← just enable upload
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'mediaType'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'mediaType',
      type: 'select',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
      ],
      required: true,
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'External URL (e.g. S3, YouTube)',
      admin: {
        description: 'Optional: Use this instead of uploading a file.',
      },
    },
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
