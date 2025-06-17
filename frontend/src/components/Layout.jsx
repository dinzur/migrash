export default function Layout({ children }) {
  return (
    <div className="font-sans bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white border-b shadow-sm py-3 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm font-medium">
          <button className="text-green-700 bg-green-100 px-3 py-1 rounded hover:bg-green-200">
            דף הבית
          </button>
          <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
            הוסף מגרש ➕
          </button>
        </div>
        <h1 className="text-xl font-bold text-green-700">MeGrash 🏟️</h1>
      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto p-4">{children}</main>
    </div>
  );
}
