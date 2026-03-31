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

export default function AdminPage() {
  const [config, setConfig] = useState<FeedbackFormConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [errors, setErrors] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  const enterpriseId = "enterprise-001"
  useEffect(() => {
    fetch(`http://localhost:8080/api/admin/enterprises/${enterpriseId}/session-feedback-form`)
      .then(res => res.json())
      .then(data => {
        setConfig(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
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
      </div>
      </div>
  )
}


      