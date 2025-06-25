import { CollectionConfig } from 'payload'
import { Title } from '@/Fields/Title'
import { slateEditor } from '@payloadcms/richtext-slate'

const Passages: CollectionConfig = {
  slug: 'passages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'subject', 'exam'],
  },
  access: {
    read: () => true,
  },
  fields: [
    Title,
    {
      name: 'subject',
      type: 'relationship',
      relationTo: 'subjects',
      admin: {
        description: 'Subject this passage belongs to',
      },
    },
    {
      name: 'exam',
      type: 'relationship',
      relationTo: 'exams',
      required: true,
    },
    {
      name: 'content',
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
            'upload',
            'textAlign',
            'relationship',
          ],
          leaves: ['bold', 'italic', 'underline', 'strikethrough', 'code'],
        },
      }),
      required: true,
    },
    {
      name: 'questions',
      type: 'relationship',
      relationTo: 'passageQuestions',
      hasMany: true,
      admin: {
        description: 'Questions associated with this passage',
      },
    },
  ],
  // hooks: {
  //   /**
  //    * Keep the `passages` array on the related Subject in-sync whenever a Passage
  //    * is created or updated.
  //    */
  //   afterChange: [
  //     async ({ doc, previousDoc, operation, req }) => {
  //       try {
  //         const currentSubjectId = doc.subject as string | undefined
  //         const previousSubjectId = previousDoc?.subject as string | undefined

  //         // Helper to add this passage ID to a Subject document
  //         const addPassageToSubject = (subjectId: string): void => {
  //           if (!subjectId) return

  //           // Run outside the current call stack so we don't block the main transaction
  //           process.nextTick(async () => {
  //             try {
  //               const subjectDoc = await req.payload.findByID({
  //                 collection: 'subjects',
  //                 id: subjectId,
  //                 depth: 0,
  //                 overrideAccess: true,
  //               })

  //               const passages: string[] = (subjectDoc.passages || []).map((p: any) =>
  //                 typeof p === 'string' ? p : p?.id,
  //               )

  //               if (!passages.includes(doc.id)) {
  //                 await req.payload.update({
  //                   collection: 'subjects',
  //                   id: subjectId,
  //                   data: { passages: [...passages, doc.id] },
  //                   overrideAccess: true,
  //                 })
  //               }
  //             } catch (e) {
  //               req.payload.logger.error('Failed to add passage to subject', e)
  //             }
  //           })
  //         }

  //         // Helper to remove this passage ID from a Subject document
  //         const removePassageFromSubject = (subjectId: string): void => {
  //           if (!subjectId) return

  //           process.nextTick(async () => {
  //             try {
  //               const subjectDoc = await req.payload.findByID({
  //                 collection: 'subjects',
  //                 id: subjectId,
  //                 depth: 0,
  //                 overrideAccess: true,
  //               })

  //               const passages: string[] = (subjectDoc.passages || []).map((p: any) =>
  //                 typeof p === 'string' ? p : p?.id,
  //               )

  //               if (passages.includes(doc.id)) {
  //                 await req.payload.update({
  //                   collection: 'subjects',
  //                   id: subjectId,
  //                   data: { passages: passages.filter((p) => p !== doc.id) },
  //                   overrideAccess: true,
  //                 })
  //               }
  //             } catch (e) {
  //               req.payload.logger.error('Failed to remove passage from subject', e)
  //             }
  //           })
  //         }

  //         // When creating a passage, simply add the passage ID to the chosen subject
  //         if (operation === 'create') {
  //           if (currentSubjectId) addPassageToSubject(currentSubjectId)
  //           return
  //         }

  //         // When updating, handle possible subject changes
  //         if (operation === 'update') {
  //           if (currentSubjectId !== previousSubjectId) {
  //             // relationship was changed or cleared
  //             if (previousSubjectId) removePassageFromSubject(previousSubjectId)
  //             if (currentSubjectId) addPassageToSubject(currentSubjectId)
  //           }
  //           return
  //         }
  //       } catch (err) {
  //         req.payload.logger.error('Failed to sync passage with subject', err)
  //       }
  //     },
  //   ],
  //   /** Remove passage reference from its subject after the passage itself is deleted */
  //   afterDelete: [
  //     async ({ doc, req }) => {
  //       try {
  //         const subjectId = (doc as any)?.subject as string | undefined
  //         if (!subjectId) return

  //         // Schedule removal to avoid locking inside delete txn
  //         process.nextTick(async () => {
  //           try {
  //             const subjectDoc = await req.payload.findByID({
  //               collection: 'subjects',
  //               id: subjectId,
  //               depth: 0,
  //               overrideAccess: true,
  //             })

  //             const passages: string[] = (subjectDoc.passages || []).map((p: any) =>
  //               typeof p === 'string' ? p : p?.id,
  //             )

  //             if (passages.includes(doc.id)) {
  //               await req.payload.update({
  //                 collection: 'subjects',
  //                 id: subjectId,
  //                 data: { passages: passages.filter((p) => p !== doc.id) },
  //                 overrideAccess: true,
  //               })
  //             }
  //           } catch (err) {
  //             req.payload.logger.error('Failed to cleanup subject after passage delete', err)
  //           }
  //         })
  //       } catch (err) {
  //         req.payload.logger.error('afterDelete hook error (passage)', err)
  //       }
  //     },
  //   ],
  // },
}

export default Passages
