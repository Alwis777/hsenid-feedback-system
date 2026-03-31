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
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Feedback Form Configuration</h1>
      <p className="text-gray-500">Enterprise: {enterpriseId}</p>

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
          <label className="block font-medium mb-1">Header Text *</label>
          <input
            className="w-full border rounded p-2"
            value={config.headerText}
            onChange={e => setConfig({ ...config, headerText: e.target.value })}
            aria-label="Header text for feedback form"
            aria-required="true"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Header Description</label>
          <input
            className="w-full border rounded p-2"
            value={config.headerDescription || ""}
            onChange={e => setConfig({ ...config, headerDescription: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Rating Labels (exactly 5)</label>
          {config.ratingLabels.map((label, i) => (
            <input
              key={i}
              className="w-full border rounded p-2 mb-1"
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
          <label className="block font-medium mb-1">Thank You Text *</label>
          <input
            className="w-full border rounded p-2"
            value={config.thankYouText}
            onChange={e => setConfig({ ...config, thankYouText: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Footer Text</label>
          <input
            className="w-full border rounded p-2"
            value={config.footerText || ""}
            onChange={e => setConfig({ ...config, footerText: e.target.value })}
          />
        </div>
     
       <div>
          <label className="block font-medium mb-1">Invalid Reply Text *</label>
          <input
            className="w-full border rounded p-2"
            value={config.invalidReplyText}
            onChange={e => setConfig({ ...config, invalidReplyText: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Expired Reply Text *</label>
          <input
            className="w-full border rounded p-2"
            value={config.expiredReplyText}
            onChange={e => setConfig({ ...config, expiredReplyText: e.target.value })}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Skip For Channels</label>
          <p className="text-sm text-gray-400 mb-1">Allowed: WHATSAPP, INSTAGRAM, MESSENGER, WEB</p>
          <input
            className="w-full border rounded p-2"
            value={config.skipForChannels.join(", ")}
            onChange={e => setConfig({
              ...config,
              skipForChannels: e.target.value.split(",").map(s => s.trim().toUpperCase()).filter(Boolean)
            })}
          />
        </div>
      </div>

      <button
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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
          <h2 className="text-xl font-bold mb-4">Feedback Statistics</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="border rounded p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.totalRequests}</p>
              <p className="text-sm text-gray-500">Total Requests</p>
            </div>
            <div className="border rounded p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{stats.totalResponded}</p>
              <p className="text-sm text-gray-500">Responded</p>
            </div>
            <div className="border rounded p-4 text-center">
              <p className="text-2xl font-bold text-yellow-500">{stats.averageRating}</p>
              <p className="text-sm text-gray-500">Average Rating</p>
            </div>
          </div>
          <div className="border rounded p-4">
            <p className="font-medium mb-3">Rating Breakdown</p>
            {Object.entries(stats.ratingBreakdown).map(([rating, count]) => (
              <div key={rating} className="flex items-center gap-3 mb-2">
                <span className="w-4 text-sm font-medium">{rating}</span>
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
                <span className="text-sm text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    
    <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-bold mb-4">Preview</h2>
        <div className="border rounded p-6 bg-gray-50">
          <h3 className="text-lg font-bold">{config.headerText}</h3>
          <p className="text-gray-600 mt-1">{config.headerDescription}</p>

          <div className="mt-4">
            <p className="font-medium mb-2">Select a rating:</p>
            <div className="flex gap-2">
              {config.ratingLabels.map((label, i) => (
                <div key={i} className="flex flex-col items-center">
                  <button className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-blue-500">
                    {i + 1}
                  </button>
                  <span className="text-xs mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 text-sm text-gray-400">{config.footerText}</p>
        </div>
      </div>
    </div>
  )
}


      