import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Join() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [contestId, setContestId] = useState('1')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/contests/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, contestId: parseInt(contestId) })
      })

      if (!response.ok) throw new Error('Failed to join contest')

      const user = await response.json()
      localStorage.setItem('userId', user.id)
      localStorage.setItem('username', user.username)
      router.push(`/contest/${contestId}`)
    } catch (err) {
      setError('Failed to join contest. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Shodh-a-Code
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Contest Platform
        </p>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contest ID
            </label>
            <input
              type="number"
              value={contestId}
              onChange={(e) => setContestId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {loading ? 'Joining...' : 'Join Contest'}
          </button>
        </form>
      </div>
    </div>
  )
}
