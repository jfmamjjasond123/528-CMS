import { Payload } from 'payload'

export async function syncPassageQuestions(payload: Payload) {
  try {
    console.log('🔄 Starting full passage questions sync...')

    // Get all passages
    const passages = await payload.find({
      collection: 'FL_Passages',
      limit: 1000,
    })

    console.log(`📊 Found ${passages.docs.length} passages to sync`)

    // For each passage, get its questions and update the questions field
    for (const passage of passages.docs) {
      console.log(`🔄 Processing passage: ${passage.title} (ID: ${passage.id})`)

      const questions = await payload.find({
        collection: 'FL_passage_questions',
        where: {
          passage: {
            equals: passage.id,
          },
        },
        limit: 1000,
      })

      console.log(`📋 Found ${questions.docs.length} questions for passage ${passage.id}`)
      console.log(
        `📝 Question IDs:`,
        questions.docs.map((q: any) => q.id),
      )

      // Update the passage with the correct questions
      await payload.update({
        collection: 'FL_Passages',
        id: passage.id,
        data: {
          questions: questions.docs.map((q: any) => q.id),
        },
      })

      console.log(`✅ Updated passage ${passage.title} with ${questions.docs.length} questions`)
    }

    console.log('🎉 Full passage questions sync completed successfully!')
  } catch (error) {
    console.error('❌ Error syncing passage questions:', error)
    throw error
  }
}

// Function to get questions for a specific passage
export async function getPassageQuestions(payload: Payload, passageId: string) {
  try {
    console.log(`🔍 Getting questions for passage: ${passageId}`)

    const questions = await payload.find({
      collection: 'FL_passage_questions',
      where: {
        passage: {
          equals: passageId,
        },
      },
      limit: 1000,
    })

    console.log(`📋 Found ${questions.docs.length} questions for passage ${passageId}`)
    console.log(
      `📝 Question IDs:`,
      questions.docs.map((q: any) => q.id),
    )

    return questions.docs
  } catch (error) {
    console.error('❌ Error getting passage questions:', error)
    throw error
  }
}

// Function to sync a single passage
export async function syncSinglePassage(payload: Payload, passageId: string) {
  try {
    console.log(`🔄 Syncing single passage: ${passageId}`)

    const questions = await payload.find({
      collection: 'FL_passage_questions',
      where: {
        passage: {
          equals: passageId,
        },
      },
      limit: 1000,
    })

    console.log(`📋 Found ${questions.docs.length} questions for passage ${passageId}`)
    console.log(
      `📝 Question IDs:`,
      questions.docs.map((q: any) => q.id),
    )

    await payload.update({
      collection: 'FL_Passages',
      id: passageId,
      data: {
        questions: questions.docs.map((q: any) => q.id),
      },
    })

    console.log(`✅ Synced passage ${passageId} with ${questions.docs.length} questions`)
    return questions.docs
  } catch (error) {
    console.error('❌ Error syncing single passage:', error)
    throw error
  }
}

// Function to sync passages affected by a question change
export async function syncAffectedPassages(
  payload: Payload,
  questionId: string,
  oldPassageId?: string,
  newPassageId?: string,
) {
  try {
    console.log(`🔄 Syncing affected passages for question: ${questionId}`)
    console.log(`📤 Old passage ID: ${oldPassageId || 'none'}`)
    console.log(`📥 New passage ID: ${newPassageId || 'none'}`)

    const passagesToSync = new Set<string>()

    if (oldPassageId) {
      passagesToSync.add(oldPassageId)
    }
    if (newPassageId) {
      passagesToSync.add(newPassageId)
    }

    console.log(`📋 Passages to sync:`, Array.from(passagesToSync))

    for (const passageId of passagesToSync) {
      await syncSinglePassage(payload, passageId)
    }

    console.log(`✅ Synced ${passagesToSync.size} affected passages`)
  } catch (error) {
    console.error('❌ Error syncing affected passages:', error)
    throw error
  }
}

// Function to handle question creation/update
export async function handleQuestionChange(
  payload: Payload,
  questionId: string,
  passageId: string,
) {
  try {
    console.log(`🔄 Handling question change for question: ${questionId}`)
    console.log(`📋 Question belongs to passage: ${passageId}`)

    await syncSinglePassage(payload, passageId)
    console.log(`✅ Handled question change for question ${questionId} in passage ${passageId}`)
  } catch (error) {
    console.error('❌ Error handling question change:', error)
    throw error
  }
}

// Function to handle question deletion
export async function handleQuestionDelete(payload: Payload, passageId: string) {
  try {
    console.log(`🔄 Handling question deletion for passage: ${passageId}`)

    await syncSinglePassage(payload, passageId)
    console.log(`✅ Handled question deletion for passage ${passageId}`)
  } catch (error) {
    console.error('❌ Error handling question deletion:', error)
    throw error
  }
}
