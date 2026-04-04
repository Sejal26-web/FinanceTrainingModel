export default function GlassCard({ children, className = "", ...props }) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 md:p-7 transition-all duration-300 hover:border-black/15 dark:hover:border-white/15 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
