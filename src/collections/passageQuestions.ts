import { CollectionConfig } from 'payload'
import { slateEditor } from '@payloadcms/richtext-slate'
import { v4 as uuidv4 } from 'uuid'

const Questions: CollectionConfig = {
  slug: 'passageQuestions',
  admin: {
    useAsTitle: 'questionTitle',
    defaultColumns: ['questionTitle', 'passage', 'skill', 'questionType'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'passage',
      type: 'relationship',
      relationTo: 'passages',
      admin: {
        description: 'Please select the passage this question belongs to',
      },
    },
    {
      name: 'skill',
      type: 'relationship',
      relationTo: 'questionSkills',
      admin: {
        description: 'Select the skill this question tests',
      },
    },
    {
      name: 'questionType',
      type: 'relationship',
      relationTo: 'questionTypes',
      admin: {
        description: 'Select the type of question',
      },
    },
    {
      name: 'questionTitle',
      type: 'text',
      admin: {
        description: 'Please enter the question title',
      },
    },
    {
      name: 'text',
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
            // 'upload',
            'textAlign',
            // 'relationship',
          ],
          leaves: ['bold', 'italic', 'underline', 'code'],
        },
      }),
      required: true,
    },
    // {
    //   name: 'image',
    //   type: 'upload',
    //   relationTo: 'media',
    //   admin: {
    //     description: 'Upload an image for the question (optional)',
    //   },
    // },
    {
      name: 'options',
      type: 'array',
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
          },
        },
        // {
        //   name: 'image',
        //   type: 'upload',
        //   relationTo: 'media',
        //   admin: {
        //     description: 'Upload an image for this option (optional)',
        //   },
        // },
        {
          name: 'isCorrect',
          type: 'checkbox',
          label: 'Correct Answer',
          admin: {
            description: 'Mark this option as the correct answer',
          },
          required: true,
        },
      ],
      admin: {
        description:
          'Add options for the question. Make sure to mark exactly one option as correct.',
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
            // 'upload',
            'textAlign',
            // 'relationship',
          ],
          leaves: ['bold', 'italic', 'underline', 'code'],
        },
      }),
    },
  ],
  // hooks: {
  //   /**
  //    * Sync the reverse relationship on the Passage whenever a question is created or its passage changes.
  //    */
  //   afterChange: [
  //     async ({ doc, previousDoc, operation, req }) => {
  //       const currentPassageId = doc.passage as string | undefined
  //       const previousPassageId = previousDoc?.passage as string | undefined

  //       const addQuestionToPassage = (passageId: string): void => {
  //         if (!passageId) return

  //         process.nextTick(async () => {
  //           try {
  //             const passage = await req.payload.findByID({
  //               collection: 'passages',
  //               id: passageId,
  //               depth: 0,
  //               overrideAccess: true,
  //             })

  //             const questions: string[] = (passage.questions || []).map((q: any) =>
  //               typeof q === 'string' ? q : q?.id,
  //             )

  //             if (!questions.includes(doc.id)) {
  //               await req.payload.update({
  //                 collection: 'passages',
  //                 id: passageId,
  //                 data: { questions: [...questions, doc.id] },
  //                 overrideAccess: true,
  //               })
  //             }
  //           } catch (e) {
  //             req.payload.logger.error('Failed to add question to passage', e)
  //           }
  //         })
  //       }

  //       const removeQuestionFromPassage = (passageId: string): void => {
  //         if (!passageId) return

  //         process.nextTick(async () => {
  //           try {
  //             const passage = await req.payload.findByID({
  //               collection: 'passages',
  //               id: passageId,
  //               depth: 0,
  //               overrideAccess: true,
  //             })

  //             const questions: string[] = (passage.questions || []).map((q: any) =>
  //               typeof q === 'string' ? q : q?.id,
  //             )

  //             if (questions.includes(doc.id)) {
  //               await req.payload.update({
  //                 collection: 'passages',
  //                 id: passageId,
  //                 data: { questions: questions.filter((q) => q !== doc.id) },
  //                 overrideAccess: true,
  //               })
  //             }
  //           } catch (e) {
  //             req.payload.logger.error('Failed to remove question from passage', e)
  //           }
  //         })
  //       }

  //       if (operation === 'create') {
  //         if (currentPassageId) addQuestionToPassage(currentPassageId)
  //         return
  //       }

  //       if (operation === 'update') {
  //         if (currentPassageId !== previousPassageId) {
  //           if (previousPassageId) removeQuestionFromPassage(previousPassageId)
  //           if (currentPassageId) addQuestionToPassage(currentPassageId)
  //         }
  //       }
  //     },
  //   ],
  // },
}

export default Questions
