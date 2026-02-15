export default function Header() {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg text-white text-xl font-bold">
          +
        </div>
        <h1 className="text-2xl font-semibold">
          My Hyppocampe
        </h1>
      </div>
    </div>
  );
}
