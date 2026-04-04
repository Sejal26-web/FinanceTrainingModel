export default function GlassCard({ children, className = "", ...props }) {
  return (
    <div
      className={`glass-card rounded-2xl p-6 md:p-7 transition-all duration-300 hover:border-gray-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
