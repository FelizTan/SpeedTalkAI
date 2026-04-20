export const LoadingDots = ({ className = "" }: { className?: string }) => (
  <span className={`inline-flex items-end gap-1 ${className}`} aria-label="loading">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"
        style={{ animationDelay: `${i * 0.15}s` }}
      />
    ))}
  </span>
);
