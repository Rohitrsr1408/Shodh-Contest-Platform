import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Contest() {
  const router = useRouter()
  const { id } = router.query

  const [contest, setContest] = useState(null)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('JAVA')
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

  useEffect(() => {
    if (selectedProblem) {
      if (language === 'JAVA') {
        setCode(getJavaTemplate(selectedProblem))
      } else if (language === 'CPP') {
        setCode(getCppTemplate(selectedProblem))
      }
    }
  }, [language, selectedProblem])

  const getJavaTemplate = (problem) => {
    return `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        
        // Write your solution here
        
        sc.close();
    }
}`
  }

  const getCppTemplate = (problem) => {
    return `#include <iostream>
using namespace std;

int main() {
    // Write your solution here
    
    return 0;
}`
  }

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
          code,
          language
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
      case 'ACCEPTED': return 'text-green-700 bg-green-100 border-green-300'
      case 'WRONG_ANSWER': return 'text-red-700 bg-red-100 border-red-300'
      case 'RUNNING': return 'text-yellow-700 bg-yellow-100 border-yellow-300'
      case 'PENDING': return 'text-blue-700 bg-blue-100 border-blue-300'
      default: return 'text-gray-700 bg-gray-100 border-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACCEPTED': return '✓'
      case 'WRONG_ANSWER': return '✗'
      case 'RUNNING': return '⟳'
      case 'PENDING': return '○'
      default: return '•'
    }
  }

  const getDifficultyColor = (points) => {
    if (points <= 100) return 'bg-green-100 text-green-800'
    if (points <= 150) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getDifficultyLabel = (points) => {
    if (points <= 100) return 'Easy'
    if (points <= 150) return 'Medium'
    return 'Hard'
  }

  if (!contest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="text-xl font-semibold text-gray-700 animate-pulse">Loading contest...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="bg-white shadow-md border-b-2 border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {contest.name}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">Participant:</span> {username}
              </p>
            </div>
            <button
              onClick={() => router.push('/')}
              className="px-5 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 border border-gray-300"
            >
              Exit Contest
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {contest.problems.map((problem) => (
                  <button
                    key={problem.id}
                    onClick={() => setSelectedProblem(problem)}
                    className={`px-5 py-3 rounded-lg whitespace-nowrap font-medium transition-all duration-200 ${
                      selectedProblem?.id === problem.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }`}
                  >
                    {problem.title}
                  </button>
                ))}
              </div>

              {selectedProblem && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{selectedProblem.title}</h2>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(selectedProblem.points)}`}>
                        {getDifficultyLabel(selectedProblem.points)}
                      </span>
                      <span className="px-4 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-bold">
                        {selectedProblem.points} pts
                      </span>
                    </div>
                  </div>
                  <div className="prose max-w-none mb-6">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
                      {selectedProblem.description}
                    </pre>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-bold text-sm mb-2 text-blue-900">Sample Input</h4>
                      <pre className="text-xs text-gray-800 font-mono">{selectedProblem.sampleInput}</pre>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-bold text-sm mb-2 text-green-900">Expected Output</h4>
                      <pre className="text-xs text-gray-800 font-mono">{selectedProblem.expectedOutput}</pre>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Code Editor</h3>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">Language:</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium bg-white hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="JAVA">Java</option>
                    <option value="CPP">C++</option>
                  </select>
                </div>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-80 p-4 font-mono text-sm border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-gray-50"
                placeholder="// Write your code here..."
              />
              <button
                onClick={handleSubmit}
                className="mt-4 w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
              >
                Submit Solution
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-800">My Submissions</h3>
              <div className="space-y-3">
                {submissions.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No submissions yet. Start coding!</p>
                ) : (
                  submissions.map((sub, index) => (
                    <div key={sub.id} className={`border-2 rounded-lg p-4 transition-all ${getStatusColor(sub.status)}`}>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold">{getStatusIcon(sub.status)}</span>
                            <div className="text-sm font-bold">
                              Submission #{submissions.length - index}
                            </div>
                            <span className="px-2 py-0.5 bg-white rounded text-xs font-semibold">
                              {sub.language}
                            </span>
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {new Date(sub.submittedAt).toLocaleString()}
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold border-2 ${getStatusColor(sub.status)}`}>
                          {sub.status.replace('_', ' ')}
                        </span>
                      </div>
                      {sub.result && (
                        <div className="mt-3 text-sm font-medium bg-white rounded p-2 border">
                          {sub.result}
                        </div>
                      )}
                      {sub.score > 0 && (
                        <div className="mt-2 text-sm font-bold text-green-700">
                          Score: +{sub.score} points
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6 border border-gray-200">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-bold text-gray-800">Leaderboard</h3>
                <span className="text-xs text-gray-500 animate-pulse">● Live</span>
              </div>
              <div className="space-y-3">
                {leaderboard.map((entry, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg transition-all ${
                      entry.username === username
                        ? 'bg-gradient-to-r from-indigo-100 to-purple-100 border-2 border-indigo-400 shadow-md'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className={`text-2xl font-bold ${
                          index === 0 ? 'text-yellow-500' : 
                          index === 1 ? 'text-gray-400' : 
                          index === 2 ? 'text-orange-600' : 
                          'text-gray-500'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                        </span>
                        <div>
                          <div className={`font-bold text-sm ${entry.username === username ? 'text-indigo-900' : 'text-gray-800'}`}>
                            {entry.username}
                            {entry.username === username && <span className="ml-2 text-xs">(You)</span>}
                          </div>
                          <div className="text-xs text-gray-600">
                            {entry.solvedProblems} {entry.solvedProblems === 1 ? 'problem' : 'problems'} solved
                          </div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {entry.totalScore}
                      </div>
                    </div>
                  </div>
                ))}
                {leaderboard.length === 0 && (
                  <p className="text-gray-500 text-center py-8 text-sm">No submissions yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
