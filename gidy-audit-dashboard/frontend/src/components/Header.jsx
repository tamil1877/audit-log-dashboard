export default function Header({ total }) {
  return (
    <header className="px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold tracking-tight text-console-text">Audit Log Console</h1>
        <p className="text-xs text-console-muted mt-0.5">System activity · investigate anomalies</p>
      </div>
      <div className="flex items-center gap-2 text-xs font-medium bg-white border border-console-lavenderLine px-3 py-1.5 rounded-full">
        <span className="w-1.5 h-1.5 rounded-full bg-signal-green inline-block" />
        {total.toLocaleString()} records indexed
      </div>
    </header>
  );
}
