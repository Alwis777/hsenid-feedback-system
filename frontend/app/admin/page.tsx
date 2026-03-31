"use client"

import { useEffect, useState } from "react"

interface FeedbackFormConfig {
  headerText: string
  headerDescription: string
  footerText: string
  ratingLabels: string[]
  thankYouText: string
  invalidReplyText: string
  expiredReplyText: string
  skipForChannels: string[]
}

interface FeedbackStats {
  totalRequests: number
  totalResponded: number
  averageRating: string
  ratingBreakdown: { [key: string]: number }
}

export default function AdminPage() {
  const [config, setConfig] = useState<FeedbackFormConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<string[]>([])
  const [saved, setSaved] = useState(false)
  const [stats, setStats] = useState<FeedbackStats | null>(null)

  const enterpriseId = "enterprise-001"
  useEffect(() => {
    fetch(`http://localhost:8080/api/admin/enterprises/${enterpriseId}/session-feedback-form`)
      .then(res => res.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))

    fetch(`http://localhost:8080/api/admin/enterprises/${enterpriseId}/feedback-stats`)
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  if (loading) return <div className="p-8">Loading...</div>
  if (!config) return <div className="p-8 text-red-500">Failed to load config</div>

  return (
    <div className="min-h-screen bg-gray-100 py-10">
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-xl shadow-md">
      <div className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Feedback Form Configuration</h1>
        <p className="text-sm text-blue-500 mt-1">⚙️ Enterprise: {enterpriseId}</p>
      </div>

{saved && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Saved successfully!</div>}
      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <ul>
            {errors.map((e, i) => <li key={i}>• {e}</li>)}
          </ul>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1 text-gray-700">Header Text *</label>
          <input
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={config.headerText}
            onChange={e => setConfig({ ...config, headerText: e.target.value })}
            aria-label="Header text for feedback form"
            aria-required="true"
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-700">Header Description</label>
          <input
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={config.headerDescription || ""}
            onChange={e => setConfig({ ...config, headerDescription: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-2 text-gray-700">Rating Labels <span className="text-xs text-gray-400">(exactly 5)</span></label>
          {config.ratingLabels.map((label, i) => (
            <input
              key={i}
              className="w-full border border-gray-300 rounded-lg p-2 mb-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={label}
              onChange={e => {
                const updated = [...config.ratingLabels]
                updated[i] = e.target.value
                setConfig({ ...config, ratingLabels: updated })
              }}
            />
          ))}
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-700">Thank You Text *</label>
          <input
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={config.thankYouText}
            onChange={e => setConfig({ ...config, thankYouText: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-700">Footer Text</label>
          <input
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={config.footerText || ""}
            onChange={e => setConfig({ ...config, footerText: e.target.value })}
          />
        </div>
     
       <div>
          <label className="block font-medium mb-1 text-gray-700">Invalid Reply Text *</label>
          <input
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={config.invalidReplyText}
            onChange={e => setConfig({ ...config, invalidReplyText: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-700">Expired Reply Text *</label>
          <input
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={config.expiredReplyText}
            onChange={e => setConfig({ ...config, expiredReplyText: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-1 text-gray-700">Skip For Channels</label>
          <p className="text-sm text-gray-400 mb-1">Allowed: WHATSAPP, INSTAGRAM, MESSENGER, WEB</p>
          <input
            className="w-full border border-gray-300 rounded-lg p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={config.skipForChannels.join(", ")}
            onChange={e => setConfig({
              ...config,
              skipForChannels: e.target.value.split(",").map(s => s.trim().toUpperCase()).filter(Boolean)
            })}
          />
        </div>
      </div>

      <button
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium w-full"
        aria-label="Save feedback form configuration"
        onClick={async () => {
          setErrors([])
          setSaved(false)
          const res = await fetch(
            `http://localhost:8080/api/admin/enterprises/${enterpriseId}/session-feedback-form`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(config)
            }
          )
          const data = await res.json()
          if (!res.ok) {
            setErrors(data.errors || ["Something went wrong"])
          } else {
            setSaved(true)
          }
        }}
      >
        Save Configuration
      </button>

      {stats && (
        <div className="mt-10 border-t pt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Feedback Statistics</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="border rounded p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalRequests}</p>
              <p className="text-sm text-gray-600 font-medium">Total Requests</p>
            </div>
            <div className="border rounded p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.totalResponded}</p>
              <p className="text-sm text-gray-600 font-medium">Responded</p>
            </div>
            <div className="border rounded p-4 text-center">
              <p className="text-2xl font-bold text-yellow-500">{stats.averageRating}</p>
              <p className="text-sm text-gray-600 font-medium">Average Rating</p>
            </div>
          </div>
          <div className="border rounded p-4">
            <p className="font-medium mb-3 text-gray-700">Rating Breakdown</p>
            {Object.entries(stats.ratingBreakdown).map(([rating, count]) => (
              <div key={rating} className="flex items-center gap-3 mb-2">
                <span className="w-4 text-sm font-medium text-gray-700">{rating}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full"
                    style={{
                      width: stats.totalResponded > 0
                        ? `${(count / stats.totalResponded) * 100}%`
                        : "0%"
                    }}
                  />
                </div>
                <span className="text-sm text-gray-700 font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    
    <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Live Preview</h2>
        <div className="border border-gray-200 rounded-xl p-6 bg-gray-50 shadow-inner">
          <h3 className="text-2xl font-bold text-gray-800">{config.headerText || "Header Text"}</h3>
          <p className="text-gray-600 mt-2">{config.headerDescription}</p>

          <div className="mt-8">
            <p className="font-medium mb-3 text-gray-700">Select your rating:</p>
            <div className="flex gap-3">
              {config.ratingLabels.map((label, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-gray-400 bg-gray-50 text-gray-700 font-bold text-sm">
                    {i + 1}
                  </div>
                  <span className="text-xs mt-1 text-center text-gray-600 font-medium">{label || `Label ${i + 1}`}</span>
                </div>
              ))}
            </div>
          </div>

          {config.footerText && (
            <p className="mt-8 text-sm text-gray-400 text-center border-t border-gray-200 pt-4">{config.footerText}</p>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}


      