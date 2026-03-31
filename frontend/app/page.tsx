export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-xl shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">hSenid Feedback System</h1>
        <p className="text-gray-500 mb-8 text-sm">Chat session feedback mini-system</p>

        <div className="space-y-3">
          <a href="/admin"
            className="block w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Admin Configuration Page
          </a>
          <a href="/feedback/feedback-valid-001"
            className="block w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
            Valid Feedback Demo
          </a>
          <a href="/feedback/feedback-expired-001"
            className="block w-full py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium">
            Expired Feedback Demo
          </a>
          <a href="/feedback/feedback-responded-001"
            className="block w-full py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium">
            Already Responded Demo
          </a>
        </div>
      </div>
    </div>
  )
}