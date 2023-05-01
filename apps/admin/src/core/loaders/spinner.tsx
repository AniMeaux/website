export function Spinner() {
  return (
    <span className="relative w-[1em] h-[1em] animate-spin-spinner">
      <svg
        viewBox="0 0 66 66"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="1, 300"
        strokeDashoffset="0"
        className="absolute top-0 left-0 w-full h-full origin-center animate-stroke-spinner"
      >
        <circle strokeWidth="8" cx="33" cy="33" r="28" />
      </svg>
    </span>
  );
}
