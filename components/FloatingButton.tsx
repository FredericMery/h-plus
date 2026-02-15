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
    w-16 h-16
    rounded-2xl
    bg-gradient-to-br from-indigo-500 to-purple-600
    text-white text-3xl font-bold
    shadow-2xl
    z-[1000]
    hover:scale-105 active:scale-95
    transition
    flex items-center justify-center
  "
>
  +
</button>

  );
}
