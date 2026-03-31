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
    fetch(`http://localhost:800/api/admin/enterprises/${enterpriseId}/session-feedback-form`)
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
    </div>
  )
}