export default function SectionTitle({ children, subtitle, className = "" }) {
  return (
    <div className={`mb-5 ${className}`}>
      <h2 className="text-lg font-semibold text-text-primary">{children}</h2>
      {subtitle && <p className="text-sm text-text-muted mt-0.5">{subtitle}</p>}
    </div>
  );
}
