export default function Card() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm text-center">
          <h2 className="text-2xl font-bold text-gray-800">Welcome to React</h2>
          <p className="text-gray-600 mt-2">This is a simple card component styled with Tailwind CSS.</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Click Me
          </button>
        </div>
      </div>
    );
  }