import UploadPanel from "./UploadPanel.jsx";

export default function FilterBar({ filters, onChange, facets, onUploaded }) {
  function handleChange(key, value) {
    // any filter change resets pagination back to page 1 - if you're on
    // page 12 and switch the severity filter, staying on page 12 of a
    // now-different result set would just show an empty table
    onChange({ ...filters, [key]: value, page: 1 });
  }

  return (
    <div className="px-6 pb-4 flex flex-wrap items-center gap-3">
      <input
        type="text"
        placeholder="Search actor, action, resource..."
        value={filters.search}
        onChange={(e) => handleChange("search", e.target.value)}
        className="bg-white border border-console-lavenderLine rounded-md px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-signal-accent/20 focus:border-signal-accent placeholder:text-console-muted"
      />

      <Select label="Severity" value={filters.severity} onChange={(v) => handleChange("severity", v)} options={facets.severities} />
      <Select label="Status" value={filters.status} onChange={(v) => handleChange("status", v)} options={facets.statuses} />
      <Select label="Region" value={filters.region} onChange={(v) => handleChange("region", v)} options={facets.regions} />
      <Select label="Role" value={filters.role} onChange={(v) => handleChange("role", v)} options={facets.roles} />

      <div className="flex items-center gap-1.5 text-xs text-console-muted">
        <input
          type="date"
          value={filters.from}
          onChange={(e) => handleChange("from", e.target.value)}
          className="bg-white border border-console-lavenderLine rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-signal-accent/20 focus:border-signal-accent"
        />
        <span>to</span>
        <input
          type="date"
          value={filters.to}
          onChange={(e) => handleChange("to", e.target.value)}
          className="bg-white border border-console-lavenderLine rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-signal-accent/20 focus:border-signal-accent"
        />
      </div>

      {(filters.search || filters.severity || filters.status || filters.region || filters.role || filters.from || filters.to) && (
        <button
          onClick={() =>
            onChange({ search: "", severity: "", status: "", region: "", role: "", from: "", to: "", page: 1 })
          }
          className="text-xs text-signal-accent hover:text-signal-accentDark font-medium underline underline-offset-2"
        >
          Clear filters
        </button>
      )}

      <div className="ml-auto">
        <UploadPanel onUploaded={onUploaded} />
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options = [] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-console-lavenderLine rounded-md px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-signal-accent/20 focus:border-signal-accent text-console-text"
    >
      <option value="">{label}: All</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
