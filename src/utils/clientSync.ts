// Client-side utility for syncing passage questions relationships

export const clientSync = {
  // Sync after creating or updating a question
  async handleQuestionChange(questionId: string, passageId: string) {
    console.log('🔄 Client: Starting question change sync')
    console.log('📋 Question ID:', questionId)
    console.log('📋 Passage ID:', passageId)

    try {
      const response = await fetch('/api/my-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'handleQuestionChange',
          questionId,
          passageId,
        }),
      })

      console.log('📡 API Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error response:', errorText)
        throw new Error('Failed to sync question change')
      }

      const result = await response.json()
      console.log('✅ API Response:', result)
      console.log('✅ Question change synced successfully')
    } catch (error) {
      console.error('❌ Error syncing question change:', error)
    }
  },

  // Sync after deleting a question
  async handleQuestionDelete(passageId: string) {
    console.log('🔄 Client: Starting question deletion sync')
    console.log('📋 Passage ID:', passageId)

    try {
      const response = await fetch('/api/my-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'handleQuestionDelete',
          passageId,
        }),
      })

      console.log('📡 API Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error response:', errorText)
        throw new Error('Failed to sync question deletion')
      }

      const result = await response.json()
      console.log('✅ API Response:', result)
      console.log('✅ Question deletion synced successfully')
    } catch (error) {
      console.error('❌ Error syncing question deletion:', error)
    }
  },

  // Sync after changing a question's passage
  async handlePassageChange(questionId: string, oldPassageId: string, newPassageId: string) {
    console.log('🔄 Client: Starting passage change sync')
    console.log('📋 Question ID:', questionId)
    console.log('📤 Old Passage ID:', oldPassageId)
    console.log('📥 New Passage ID:', newPassageId)

    try {
      const response = await fetch('/api/my-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'syncAffected',
          questionId,
          oldPassageId,
          newPassageId,
        }),
      })

      console.log('📡 API Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error response:', errorText)
        throw new Error('Failed to sync passage change')
      }

      const result = await response.json()
      console.log('✅ API Response:', result)
      console.log('✅ Passage change synced successfully')
    } catch (error) {
      console.error('❌ Error syncing passage change:', error)
    }
  },

  // Full sync for all passages
  async fullSync() {
    console.log('🔄 Client: Starting full sync')

    try {
      const response = await fetch('/api/my-route?action=sync', {
        method: 'GET',
      })

      console.log('📡 API Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error response:', errorText)
        throw new Error('Failed to perform full sync')
      }

      const result = await response.json()
      console.log('✅ API Response:', result)
      console.log('✅ Full sync completed successfully')
    } catch (error) {
      console.error('❌ Error performing full sync:', error)
    }
  },

  // Sync a single passage
  async syncPassage(passageId: string) {
    console.log('🔄 Client: Starting single passage sync')
    console.log('📋 Passage ID:', passageId)

    try {
      const response = await fetch('/api/my-route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'syncSingle',
          passageId,
        }),
      })

      console.log('📡 API Response status:', response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ API Error response:', errorText)
        throw new Error('Failed to sync passage')
      }

      const result = await response.json()
      console.log('✅ API Response:', result)
      console.log('✅ Passage synced successfully')
    } catch (error) {
      console.error('❌ Error syncing passage:', error)
    }
  },
}

// Usage examples:
/*
// After creating/updating a question
await clientSync.handleQuestionChange('question-id', 'passage-id')

// After deleting a question
await clientSync.handleQuestionDelete('passage-id')

// After changing a question's passage
await clientSync.handlePassageChange('question-id', 'old-passage-id', 'new-passage-id')

// Full sync
await clientSync.fullSync()

// Sync specific passage
await clientSync.syncPassage('passage-id')
*/
