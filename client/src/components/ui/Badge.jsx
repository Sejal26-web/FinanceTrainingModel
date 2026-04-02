export default function Badge({ status, className = "" }) {
  const isApproved = status === "Approved";

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-semibold
        transition-all duration-300
        ${isApproved
          ? "bg-accent-green/15 text-accent-green border border-accent-green/25"
          : "bg-accent-red/15 text-accent-red border border-accent-red/25"
        }
        ${className}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isApproved ? "bg-accent-green" : "bg-accent-red"}`} />
      {status}
    </span>
  );
}
