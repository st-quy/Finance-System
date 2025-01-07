import { memo, useState } from "react";

const FavoriteDuotone = memo(function FavoriteDuotone({
  className = "",
  isFavorite,
  onClick,
}) {
  return (
    <div className={`relative w-8 h-8 ${className}`} onClick={onClick}>
      <div className="absolute inset-1 overflow-visible">
        {isFavorite ? (
          <svg
            className="w-full h-full text-red-500"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        ) : (
          <svg
            className="w-full h-full text-gray-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.35l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )}
      </div>
    </div>
  );
});

const Icon32pxLike = memo(function Icon32pxLike({ className = "" }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  return (
    <div className={`relative w-8 h-8 ${className}`}>
      <FavoriteDuotone isFavorite={isFavorite} onClick={toggleFavorite} />
    </div>
  );
});

export default Icon32pxLike;