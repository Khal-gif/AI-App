export default function TestPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-2xl w-full text-center p-10">
        <h1 className="text-5xl font-bold text-black mb-4">TAILWIND TEST</h1>
        <p className="text-lg text-gray-600 mb-8">
          If this text is styled properly, Tailwind CSS is working!
        </p>
        <div className="border-2 border-dashed border-gray-300 p-10 rounded-xl bg-gray-50">
          <p className="text-gray-700">This box should have gray background and dashed border</p>
        </div>
        <div className="mt-8">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
            Test Button (should be blue)
          </button>
        </div>
      </div>
    </div>
  )
}