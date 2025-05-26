import { Field, TextField } from 'payload'

export const Title: Field = {
  name: 'title',
  type: 'text',
  required: true,
  validate: (value: any) => {
    if (typeof value !== 'string' || value.trim() === '') {
      return 'Title is required'
    }

    const isValid = /^[a-zA-Z0-9 _-]+$/.test(value)

    if (!isValid) {
      return 'Only letters, numbers, spaces, hyphens (-), and underscores (_) are allowed.'
    }

    return true
  },
}
