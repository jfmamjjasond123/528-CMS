'use client'
import React from 'react'
import { Editor } from 'slate'
import { useSlate } from 'slate-react'

const base = 'rich-text__button'

const HighlightButton: React.FC = () => {
  const editor = useSlate()

  const isActive = (Editor.marks(editor) as any)?.highlight === 'yellow'

  return (
    <button
      type="button"
      className={[base, isActive && `${base}__button--active`].filter(Boolean).join(' ')}
      onMouseDown={(e) => {
        e.preventDefault()
        if (isActive) {
          Editor.removeMark(editor, 'highlight')
        } else {
          Editor.addMark(editor, 'highlight', 'yellow')
        }
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: '14px',
          height: '14px',
          backgroundColor: 'yellow',
          borderRadius: '2px',
        }}
      />
    </button>
  )
}

export default HighlightButton
