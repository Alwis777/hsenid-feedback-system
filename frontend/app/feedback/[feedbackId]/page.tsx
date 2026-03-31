"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"

interface FeedbackPageData {
  feedbackId: string
  enterpriseId: string
  responded: boolean
  expired: boolean
  headerText: string
  headerDescription: string
  footerText: string
  ratingLabels: string[]
  thankYouText: string
  expiredReplyText: string
  invalidReplyText: string
}

export default function FeedbackPage() {
  const params = useParams()
  const feedbackId = params.feedbackId as string

  const [data, setData] = useState<FeedbackPageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedRating, setSelectedRating] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`http://localhost:8080/api/public/feedback/${feedbackId}`)
      .then(res => {
        if (res.status === 404) {
          setNotFound(true)
          setLoading(false)
          return null
        }
        return res.json()
      })
      .then(json => {
        if (json) {
          setData(json)
          setLoading(false)
        }
      })
      .catch(() => {
        setNotFound(true)
        setLoading(false)
      })
  }, [feedbackId])

  if (loading) return <div className="p-8">Loading...</div>
  if (notFound) return <div className="p-8 text-red-500">Feedback request not found</div>
  if (!data) return <div className="p-8 text-red-500">Something went wrong</div>

  if (data.expired) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold text-orange-500">Link Expired</h2>
        <p className="text-gray-600 mt-2">{data.expiredReplyText}</p>
      </div>
    )
  }

  if (data.responded) {
    return (
      <div className="p-8 max-w-md mx-auto text-center">
        <h2 className="text-xl font-bold">Already Submitted</h2>
        <p className="text-gray-600 mt-2">You have already submitted feedback for this session</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">{data.headerText}</h1>
      <p className="text-gray-600 mt-2">{data.headerDescription}</p>

      <div className="mt-6">
        <p className="font-medium mb-3">Select your rating:</p>
        <div className="flex gap-3">
          {data.ratingLabels.map((label, i) => (
            <div key={i} className="flex flex-col items-center">
              <button
                className={`w-12 h-12 rounded-full border-2 font-bold
                  ${selectedRating === i + 1
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-300 hover:border-blue-400"}`}
                onClick={() => setSelectedRating(i + 1)}
              >
                {i + 1}
              </button>
              <span className="text-xs mt-1 text-center">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="mt-4 text-red-500">{error}</p>}

      <button
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={async () => {
          if (!selectedRating) {
            setError("Please select a rating first")
            return
          }
          const res = await fetch(
            `http://localhost:8080/api/public/feedback/${feedbackId}/respond`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ rating: selectedRating })
            }
          )
          if (res.ok) {
            setSubmitted(true)
          } else {
            const json = await res.json()
            setError(json.error || "Something went wrong")
          }
        }}
      >
        Submit Feedback
      </button>

      {data.footerText && (
        <p className="mt-6 text-sm text-gray-400">{data.footerText}</p>
      )}
    </div>
  )
}