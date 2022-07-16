export function LineShape({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 980 28"
      fill="none"
      // Allow the shape to stretch.
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2 12C19.6328 18.7346 44.6031 21.5689 80.9231 18.7346C211.306 8.55961 456.929 -4.4883 640.248 5.68599C759.707 12.316 952.019 30.5412 978 24.9487"
        strokeWidth="3"
        strokeLinecap="round"
        // We don't want the stroke to scale, keep it at 3px.
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
