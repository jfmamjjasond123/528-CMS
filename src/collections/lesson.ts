import { Slug } from '@/Fields/slug'
import { Title } from '@/Fields/Title'
import { CollectionConfig } from 'payload'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'module.course.title'],
  },
  fields: [
    Title,
    Slug,
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Video', value: 'video' },
        { label: 'Lesson', value: 'lesson' },
        // { label: 'Quiz', value: 'quiz' },
        // { label: 'Exercise', value: 'exercise' },
      ],
    },
    {
      name: 'duration',
      type: 'text',
      label: 'Duration',
      admin: {
        placeholder: 'Enter duration in minutes',
      },
    },
    {
      name: 'video',
      type: 'relationship',
      relationTo: 'mux-video',
      access: {
        read: () => true,
      },
      admin: {
        condition: (data: any) => data.type === 'video',
      },
    },

    {
      name: 'content',
      type: 'richText',
      admin: {
        condition: (data: any) => data.type === 'lesson',
      },
    },
    {
      name: 'questions',
      type: 'relationship',
      relationTo: 'questions',
      hasMany: true,
      admin: {
        condition: (data: any) => ['quiz', 'exercise'].includes(data.type),
      },
    },
    {
      name: 'module',
      type: 'relationship',
      relationTo: 'modules',
      required: true,
    },
    {
      name: 'order',
      type: 'number',
      required: true,
    },
  ],
}

export default Lessons
