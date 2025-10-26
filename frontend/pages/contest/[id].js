import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Contest() {
  const router = useRouter()
  const { id } = router.query

  const [contest, setContest] = useState(null)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [code, setCode] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState('')

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId')
    const storedUsername = localStorage.getItem('username')
    
    if (!storedUserId) {
      router.push('/')
      return
    }
    
    setUserId(parseInt(storedUserId))
    setUsername(storedUsername)
  }, [router])

  useEffect(() => {
    if (!id) return
    fetchContest()
    fetchLeaderboard()

    const leaderboardInterval = setInterval(fetchLeaderboard, 15000)
    return () => clearInterval(leaderboardInterval)
  }, [id])

  useEffect(() => {
    if (submissions.length === 0) return

    const interval = setInterval(() => {
      submissions.forEach(sub => {
        if (sub.status === 'PENDING' || sub.status === 'RUNNING') {
          fetchSubmissionStatus(sub.id)
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [submissions])

  const fetchContest = async () => {
    try {
      const response = await fetch(`/api/contests/${id}`)
      const data = await response.json()
      setContest(data)
      if (data.problems.length > 0) {
        setSelectedProblem(data.problems[0])
      }
    } catch (err) {
      console.error('Failed to fetch contest:', err)
    }
  }

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`/api/contests/${id}/leaderboard`)
      const data = await response.json()
      setLeaderboard(data)
    } catch (err) {
      console.error('Failed to fetch leaderboard:', err)
    }
  }

  const fetchSubmissionStatus = async (submissionId) => {
    try {
      const response = await fetch(`/api/submissions/${submissionId}`)
      const data = await response.json()
      
      setSubmissions(prev => 
        prev.map(sub => sub.id === submissionId ? data : sub)
      )

      if (data.status === 'ACCEPTED' || data.status === 'WRONG_ANSWER') {
        fetchLeaderboard()
      }
    } catch (err) {
      console.error('Failed to fetch submission:', err)
    }
  }

  const handleSubmit = async () => {
    if (!code.trim()) {
      alert('Please write some code before submitting!')
      return
    }

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          problemId: selectedProblem.id,
          code
        })
      })

      const submission = await response.json()
      setSubmissions(prev => [submission, ...prev])
    } catch (err) {
      alert('Failed to submit code. Please try again.')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED': return 'text-green-600 bg-green-50'
      case 'WRONG_ANSWER': return 'text-red-600 bg-red-50'
      case 'RUNNING': return 'text-yellow-600 bg-yellow-50'
      case 'PENDING': return 'text-blue-600 bg-blue-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading contest...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{contest.name}</h1>
              <p className="text-sm text-gray-600">Welcome, {username}!</p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Exit Contest
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {contest.problems.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem)}
                    className={`px-4 py-2 rounded-md whitespace-nowrap ${
                      selectedProblem?.id === problem.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {problem.title}
                  </button>
                ))}
              </div>

              {selectedProblem && (
                <div>
                  <h2 className="text-xl font-bold mb-2">{selectedProblem.title}</h2>
                  <div className="mb-4 p-4 bg-blue-50 rounded border border-blue-200">
                    <span className="text-sm font-semibold text-blue-900">
                      Points: {selectedProblem.points}
                    </span>
                  </div>
                  <div className="prose max-w-none mb-4">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">
                      {selectedProblem.description}
                    </pre>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-gray-50 rounded">
                      <h4 className="font-semibold text-sm mb-1">Sample Input</h4>
                      <pre className="text-xs text-gray-700">{selectedProblem.sampleInput}</pre>
                    </div>
                    <div className="p-3 bg-gray-50 rounded">
                      <h4 className="font-semibold text-sm mb-1">Expected Output</h4>
                      <pre className="text-xs text-gray-700">{selectedProblem.expectedOutput}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">Code Editor</h3>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-64 p-4 font-mono text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="// Write your code here..."
              />
              <button
                onClick={handleSubmit}
                className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
              >
                Submit Solution
              </button>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">My Submissions</h3>
              <div className="space-y-2">
                {submissions.length === 0 ? (
                  <p className="text-gray-500 text-sm">No submissions yet</p>
                ) : (
                  submissions.map((sub) => (
                    <div key={sub.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-sm font-semibold">
                            Submission #{sub.id}
                          </div>
                          <div className="text-xs text-gray-600">
                            {new Date(sub.submittedAt).toLocaleString()}
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sub.status)}`}>
                          {sub.status.replace('_', ' ')}
                        </span>
                      </div>
                      {sub.result && (
                        <div className="mt-2 text-xs text-gray-600">
                          {sub.result}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h3 className="text-lg font-bold mb-4">Leaderboard</h3>
              <div className="space-y-2">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      entry.username === username
                        ? 'bg-blue-100 border-2 border-blue-400'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-500">
                          #{index + 1}
                        </span>
                        <div>
                          <div className="font-semibold text-sm">
                            {entry.username}
                          </div>
                          <div className="text-xs text-gray-600">
                            Solved: {entry.solvedProblems}
                          </div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-blue-600">
                        {entry.totalScore}
                      </div>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-gray-500 text-sm">No submissions yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
