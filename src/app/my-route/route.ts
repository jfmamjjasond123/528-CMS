import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import {
  syncPassageQuestions,
  getPassageQuestions,
  syncSinglePassage,
  syncAffectedPassages,
  handleQuestionChange,
  handleQuestionDelete,
} from '@/utils/syncPassageQuestions'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({
      config: configPromise,
    })
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const passageId = searchParams.get('passageId')
    const questionId = searchParams.get('questionId')
    const oldPassageId = searchParams.get('oldPassageId')
    const newPassageId = searchParams.get('newPassageId')

    if (action === 'sync') {
      await syncPassageQuestions(payload)
      return NextResponse.json({ success: true, message: 'Passage questions synced successfully' })
    }

    if (action === 'syncSingle' && passageId) {
      const questions = await syncSinglePassage(payload, passageId)
      return NextResponse.json({ success: true, questions })
    }

    if (action === 'syncAffected' && questionId) {
      await syncAffectedPassages(
        payload,
        questionId,
        oldPassageId || undefined,
        newPassageId || undefined,
      )
      return NextResponse.json({ success: true, message: 'Affected passages synced successfully' })
    }

    if (action === 'handleQuestionChange' && questionId && passageId) {
      await handleQuestionChange(payload, questionId, passageId)
      return NextResponse.json({ success: true, message: 'Question change handled successfully' })
    }

    if (action === 'handleQuestionDelete' && passageId) {
      await handleQuestionDelete(payload, passageId)
      return NextResponse.json({ success: true, message: 'Question deletion handled successfully' })
    }

    if (action === 'getQuestions' && passageId) {
      const questions = await getPassageQuestions(payload, passageId)
      return NextResponse.json({ success: true, questions })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in sync route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({
      config: configPromise,
    })
    const body = await request.json()
    const { action, passageId, questionId, oldPassageId, newPassageId } = body

    if (action === 'sync') {
      await syncPassageQuestions(payload)
      return NextResponse.json({ success: true, message: 'Passage questions synced successfully' })
    }

    if (action === 'syncSingle' && passageId) {
      const questions = await syncSinglePassage(payload, passageId)
      return NextResponse.json({ success: true, questions })
    }

    if (action === 'syncAffected' && questionId) {
      await syncAffectedPassages(payload, questionId, oldPassageId, newPassageId)
      return NextResponse.json({ success: true, message: 'Affected passages synced successfully' })
    }

    if (action === 'handleQuestionChange' && questionId && passageId) {
      await handleQuestionChange(payload, questionId, passageId)
      return NextResponse.json({ success: true, message: 'Question change handled successfully' })
    }

    if (action === 'handleQuestionDelete' && passageId) {
      await handleQuestionDelete(payload, passageId)
      return NextResponse.json({ success: true, message: 'Question deletion handled successfully' })
    }

    if (action === 'getQuestions' && passageId) {
      const questions = await getPassageQuestions(payload, passageId)
      return NextResponse.json({ success: true, questions })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Error in sync route:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
