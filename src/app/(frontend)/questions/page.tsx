// QuizViewer.tsx
'use client'
import React, { MouseEventHandler, useEffect, useState } from 'react'

type Question = {
  id: string
  questionText: string
  type: string
  options: { option: string }[]
  correctAnswer: string
  lesson?: {
    title: string
    module?: {
      title: string
    }
  }
}

function QuizViewer() {
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    fetch('http://localhost:3000/api/questions?depth=2')
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.docs || [])
      })
  }, [])

  function handleSubmit(e: any) {
    console.log(questions)
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Quiz</h1>
      {questions.map((q, i) => (
        <div key={q.id} className="mb-6 p-4 border rounded-lg shadow">
          <h2 className="font-semibold">
            Q{i + 1}: {q.questionText}
          </h2>
          <ul className="mt-2 space-y-2">
            {q.options.map((opt, idx) => (
              <li key={idx}>
                <label>
                  <input type="radio" name={`q-${q.id}`} /> {opt.option}
                </label>
              </li>
            ))}
          </ul>
          <button type="button" onClick={handleSubmit}>
            Submit
          </button>
          <p>
            {' '}
            Right answer : <span> {q?.correctAnswer} </span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Lesson: {q.lesson?.title || 'N/A'} — Module: {q.lesson?.module?.title || 'N/A'}
          </p>
        </div>
      ))}
    </div>
  )
}

export default QuizViewer
