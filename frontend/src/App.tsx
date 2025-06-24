import { useState, useEffect } from 'react'

interface TimeResponse {
  time: string;
  timestamp: number;
  timezone: string;
}

function App() {
  const [timeData, setTimeData] = useState<TimeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTime = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3001/api/time');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTimeData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch time');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTime();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Hello World
        </h1>
        
        <div className="space-y-4">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Current GMT Time
            </h2>
            
            {loading && (
              <div className="text-blue-600">
                Loading...
              </div>
            )}
            
            {error && (
              <div className="text-red-600 text-sm">
                Error: {error}
              </div>
            )}
            
            {timeData && !loading && (
              <div className="space-y-2">
                <div className="text-2xl font-mono text-gray-900">
                  {timeData.time}
                </div>
                <div className="text-sm text-gray-500">
                  Timestamp: {timeData.timestamp}
                </div>
                <div className="text-sm text-gray-500">
                  Timezone: {timeData.timezone}
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={fetchTime}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
          >
            {loading ? 'Refreshing...' : 'Refresh Time'}
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Layout Builder - Frontend & Backend Connected! 🚀</p>
        </div>
      </div>
    </div>
  )
}

export default App 