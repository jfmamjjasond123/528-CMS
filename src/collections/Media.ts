import { CollectionConfig } from 'payload'

const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'mediaType', 'externalUrl'],
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
<<<<<<< HEAD
  access: {
    read: () => true,
  },
=======
  //
>>>>>>> 21474cda0db6d5fc347e6d91c1a59ea6614ffdf6
}

export default Media
