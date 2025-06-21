export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-2xl">🏟️</span>
        <h1 className="text-2xl font-bold text-green-700">MeGrash</h1>
      </div>
      <div className="flex gap-2 text-sm font-medium">
        <button className="text-green-700 bg-green-100 px-3 py-1 rounded hover:bg-green-200">
          דף הבית
        </button>
        <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">
          ➕ הוסף מגרש
        </button>
      </div>
    </header>
  );
}
