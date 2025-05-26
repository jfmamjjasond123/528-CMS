import { Slug } from '@/Fields/slug'
import { Title } from '@/Fields/Title'
import { CollectionConfig } from 'payload'

export const Lessons: CollectionConfig = {
  slug: 'lessons',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'module.course.title'],
  },
  fields: [
    Title,
    Slug,
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Video', value: 'video' },
        { label: 'Lesson', value: 'lesson' },
        { label: 'Quiz', value: 'quiz' },
        { label: 'Exercise', value: 'exercise' },
      ],
    },
    {
      name: 'duration',
      type: 'text',
      admin: {
        condition: (data: any) => ['video', 'lesson'].includes(data.type),
      },
    },
    {
      name: 'video',
      type: 'relationship',
      relationTo: 'media',

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
