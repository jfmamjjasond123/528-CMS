import { Field } from 'payload'

export const Slug: Field = {
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  validate: (value: any) => {
    if (typeof value !== 'string' || value.trim() === '') {
      return 'Slug is required'
    }

    const isValid = /^[a-zA-Z0-9 _-]+$/.test(value)

    if (!isValid) {
      return 'Only letters, numbers, spaces, hyphens (-), and underscores (_) are allowed.'
    }

    return true
  },
}
