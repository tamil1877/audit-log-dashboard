import SeverityBadge from "./SeverityBadge.jsx";

const COLUMNS = [
  { key: "timestamp", label: "Time" },
  { key: "actor", label: "Actor" },
  { key: "action", label: "Action" },
  { key: "resource", label: "Resource" },
  { key: "region", label: "Region" },
  { key: "severity", label: "Severity" },
  { key: "status", label: "Status" },
];

export default function LogsTable({ logs, loading, sortBy, order, onSort }) {
  function handleHeaderClick(key) {
    // clicking the same column flips direction, clicking a new one
    // defaults to descending - that's the more useful default for
    // a timestamp column (most recent first) and matches what most
    // people expect the first click to do
    if (sortBy === key) {
      onSort(key, order === "asc" ? "desc" : "asc");
    } else {
      onSort(key, "desc");
    }
  }

  return (
    <div className="flex-1 overflow-auto px-6 py-4">
      <div className="bg-console-panel border border-console-border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 border-b border-console-border text-xs text-console-muted uppercase tracking-wide">
            <tr>
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleHeaderClick(col.key)}
                  className="text-left px-4 py-3 cursor-pointer select-none hover:text-signal-accent transition-colors"
                >
                  {col.label}
                  {sortBy === col.key && <span className="ml-1">{order === "asc" ? "↑" : "↓"}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={COLUMNS.length} className="text-center py-10 text-console-muted">
                  Loading records...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className="text-center py-10 text-console-muted">
                  No logs match the current filters.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="border-b border-console-border last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 text-console-muted whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5">{log.actor}</td>
                  <td className="px-4 py-2.5 text-signal-accent font-medium">{log.action}</td>
                  <td className="px-4 py-2.5 text-console-muted">{log.resource}</td>
                  <td className="px-4 py-2.5">{log.region}</td>
                  <td className="px-4 py-2.5">
                    <SeverityBadge severity={log.severity} />
                  </td>
                  <td className="px-4 py-2.5">{log.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
