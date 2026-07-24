// Small color chip so severity is scannable at a glance in a table
// full of text - the whole point of a SOC dashboard is spotting the
// red rows fast without reading every cell.
const STYLES = {
  CRITICAL: "bg-red-50 text-signal-red border-red-200",
  HIGH: "bg-red-50 text-red-500 border-red-100",
  MEDIUM: "bg-amber-50 text-signal-amber border-amber-200",
  LOW: "bg-emerald-50 text-signal-green border-emerald-200",
};

export default function SeverityBadge({ severity }) {
  const style = STYLES[severity] || "bg-gray-50 text-console-muted border-console-border";
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${style}`}>
      {severity}
    </span>
  );
}
