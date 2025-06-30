'use client'
import React from 'react'
import { useLeaf } from '@payloadcms/richtext-slate/client'

const HighlightLeaf: React.FC = () => {
  const { attributes, children } = useLeaf()
  return (
    <mark {...attributes} style={{ backgroundColor: 'yellow' }}>
      {children}
    </mark>
  )
}

export default HighlightLeaf
