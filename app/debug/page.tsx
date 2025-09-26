export default function DebugPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: 'red', fontSize: '32px' }}>DEBUG PAGE - INLINE STYLES</h1>
      <p style={{ color: 'blue', fontSize: '18px' }}>This uses inline styles and should always work</p>
      
      <hr style={{ margin: '20px 0' }} />
      
      <h2 className="text-3xl font-bold text-green-500">TAILWIND TEST</h2>
      <p className="text-lg text-blue-600 mt-4">This uses Tailwind classes</p>
      <div className="bg-red-100 p-4 mt-4 rounded border">
        <p className="text-red-800">Red background box with Tailwind</p>
      </div>
      
      <hr style={{ margin: '20px 0' }} />
      
      <div className="bg-white min-h-screen">
        <p>White background test</p>
      </div>
    </div>
  )
}