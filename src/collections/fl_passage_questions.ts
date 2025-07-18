import { CollectionConfig } from 'payload'
import { slateEditor } from '@payloadcms/richtext-slate'
import { v4 as uuidv4 } from 'uuid'

// Debounce mechanism to prevent rapid syncs
const syncDebounceMap = new Map<string, NodeJS.Timeout>()

// Utility function to sync passage questions
const syncPassageQuestions = async ({
  payload,
  passageId,
  operation,
  questionId,
}: {
  payload: any
  passageId: string
  operation: string
  questionId: string
}) => {
  // Clear existing timeout for this passage
  if (syncDebounceMap.has(passageId)) {
    clearTimeout(syncDebounceMap.get(passageId)!)
  }

  // Set a new timeout to debounce the sync
  const timeoutId = setTimeout(async () => {
    try {
      // Get all questions for this passage with optimized query
      const questions = await payload.find({
        collection: 'FL_passage_questions',
        where: {
          passage: {
            equals: passageId,
          },
        },
        limit: 1000,
        depth: 0, // Don't populate relationships to speed up query
      })

      // Extract question IDs
      const questionIds = questions.docs.map((q: any) => q.id)

      // Update the passage with the new questions array
      // Add header to prevent infinite loops
      await payload.update({
        collection: 'FL_Passages',
        id: passageId,
        data: {
          questions: questionIds,
        },
        headers: {
          'x-sync-update': 'true',
        },
      })

      console.log(`✅ Synced passage ${passageId} with ${questionIds.length} questions`)
    } catch (error) {
      console.error(`❌ Error syncing passage ${passageId}:`, error)
    } finally {
      // Clean up the timeout reference
      syncDebounceMap.delete(passageId)
    }
  }, 100) // 100ms debounce

  // Store the timeout reference
  syncDebounceMap.set(passageId, timeoutId)
}

const FL_PassageQuestions: CollectionConfig = {
  slug: 'FL_passage_questions',
  admin: {
    useAsTitle: 'questionTitle',
    defaultColumns: ['questionTitle', 'passage', 'skill', 'questionType'],
    pagination: {
      defaultLimit: 10,
      limits: [10, 50, 100, 1000],
    },
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [
      async ({ doc, req, operation, previousDoc }) => {
        if (req.payload) {
          // Handle passage changes (when a question is moved from one passage to another)
          if (
            operation === 'update' &&
            previousDoc?.passage &&
            doc?.passage &&
            previousDoc.passage !== doc.passage
          ) {
            console.log(
              `🔄 Question ${doc.id} moved from passage ${previousDoc.passage} to ${doc.passage}`,
            )

            // Sync the old passage (remove the question)
            await syncPassageQuestions({
              payload: req.payload,
              passageId: previousDoc.passage,
              operation: 'move_from',
              questionId: doc.id,
            })

            // Sync the new passage (add the question)
            await syncPassageQuestions({
              payload: req.payload,
              passageId: doc.passage,
              operation: 'move_to',
              questionId: doc.id,
            })
          } else if (doc?.passage) {
            // Normal sync for create/update operations
            await syncPassageQuestions({
              payload: req.payload,
              passageId: doc.passage,
              operation,
              questionId: doc.id,
            })
          }
        }
      },
    ],
    afterDelete: [
      async ({ doc, req }) => {
        // Sync the passage questions after deletion
        if (doc?.passage && req.payload) {
          await syncPassageQuestions({
            payload: req.payload,
            passageId: doc.passage,
            operation: 'delete',
            questionId: doc.id,
          })
        }
      },
    ],
  },
  fields: [
    {
      name: 'passage',
      type: 'relationship',
      relationTo: 'FL_Passages',
      admin: {
        description: 'Please select the passage this question belongs to',
      },
      required: true,
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            console.log('🧪 TEST: passage field beforeValidate triggered')
            console.log('🧪 Passage value:', value)
            return value
          },
        ],
      },
    },
    {
      name: 'skill',
      type: 'relationship',
      relationTo: 'questionSkills',
      admin: {
        description: 'Select the skill this question tests',
      },
      required: true,
    },
    {
      name: 'questionType',
      type: 'relationship',
      relationTo: 'questionTypes',
      admin: {
        description: 'Select the type of question',
      },
      required: true,
    },
    {
      name: 'questionTitle',
      type: 'text',
      admin: {
        description: 'Please enter the question title',
      },
      required: true,
    },
    {
      name: 'options',
      type: 'array',
      minRows: 2,
      validate: (value) => {
        const opts = (value ?? []) as { isCorrect?: boolean; distractorType?: any }[]
        const correctOpts = opts.filter((o) => o?.isCorrect)
        if (correctOpts.length === 0) return 'You must mark one option as the correct answer.'
        if (correctOpts.length > 1) return 'Only one option can be marked as correct.'
        if (correctOpts[0]?.distractorType)
          return 'The correct option cannot have a distractor type.'
        return true
      },
      fields: [
        {
          name: 'id',
          type: 'text',
          defaultValue: () => uuidv4(),
          admin: {
            readOnly: true,
            hidden: true,
          },
        },
        {
          name: 'text',
          type: 'text',
          required: true,
        },
        {
          name: 'distractorType',
          type: 'relationship',
          relationTo: 'distractorTypes',
          admin: {
            description: 'Select the distractor type for this option (optional)',
            condition: (_, siblingData) => siblingData?.isCorrect === false,
          },
        },
        {
          name: 'isCorrect',
          type: 'checkbox',
          label: 'Correct Answer',
          admin: {
            description: 'Mark this option as the correct answer',
          },
          required: true,
        },
        {
          name: 'optionExplanation',
          type: 'richText',
          editor: slateEditor({
            admin: {
              elements: [
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'blockquote',
                'link',
                'ol',
                'ul',
                'indent',
                'textAlign',
              ],
              leaves: [
                'bold',
                'italic',
                'underline',
                'code',
                {
                  name: 'highlight',
                  Button: '@/components/HighlightButton',
                  Leaf: '@/components/HighlightLeaf',
                },
              ],
            },
          }),
          admin: {
            description: 'Provide an explanation for this option (optional)',
          },
        },
      ],
      admin: {
        description: 'Add options for the question. Mark exactly one as correct.',
      },
    },
    {
      name: 'Question Explanation',
      type: 'richText',
      admin: {
        description: 'Give the explanation for the question if available',
      },
      editor: slateEditor({
        admin: {
          elements: [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'blockquote',
            'link',
            'ol',
            'ul',
            'indent',
            'textAlign',
          ],
          leaves: [
            'bold',
            'italic',
            'underline',
            'code',
            {
              name: 'highlight',
              Button: '@/components/HighlightButton',
              Leaf: '@/components/HighlightLeaf',
            },
          ],
        },
      }),
    },
  ],
}

export default FL_PassageQuestions
