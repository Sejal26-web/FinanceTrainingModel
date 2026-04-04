export default function Spinner({ size = "md", className = "" }) {
  const sizeMap = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" };
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className={`${sizeMap[size]} border-2 border-black/10 dark:border-white/10 border-t-accent-blue rounded-full animate-spin`} />
    </div>
  );
}
