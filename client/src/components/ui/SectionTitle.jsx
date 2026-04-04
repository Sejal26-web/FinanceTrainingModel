export default function SectionTitle({ children, subtitle, className = "" }) {
  return (
    <div className={`mb-5 ${className}`}>
      <h2 className="text-lg font-semibold t-text">{children}</h2>
      {subtitle && <p className="text-sm t-text-muted mt-0.5">{subtitle}</p>}
    </div>
  );
}
