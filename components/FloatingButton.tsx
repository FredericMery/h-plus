"use client";

export default function FloatingButton({
  onClick,
}: {
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 md:bottom-8 md:right-8
        w-14 h-14 md:w-16 md:h-16
        rounded-2xl
        bg-gradient-to-br from-indigo-500 to-purple-600
        text-white text-2xl md:text-3xl font-bold
        shadow-2xl
        active:scale-95
        transition
        flex items-center justify-center
        "

    >
      +
    </button>
  );
}
