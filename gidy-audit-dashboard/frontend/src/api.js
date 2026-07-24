const BASE_URL = "http://audit-log-dashboard-fce9.onrender.com/api/logs";

// Builds a query string from a params object, skipping anything
// empty so we don't send "severity=" and accidentally filter on
// blank strings.
function buildQuery(params) {
  const cleaned = Object.entries(params).filter(([, value]) => value !== "" && value !== null && value !== undefined);
  return new URLSearchParams(cleaned).toString();
}

export async function fetchLogs(params) {
  const query = buildQuery(params);
  const res = await fetch(`${BASE_URL}?${query}`);
  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
}

export async function fetchFacets() {
  const res = await fetch(`${BASE_URL}/facets`);
  if (!res.ok) throw new Error("Failed to fetch filter options");
  return res.json();
}

export async function bulkUploadLogs(logs) {
  const res = await fetch(`${BASE_URL}/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logs),
  });
  if (!res.ok) throw new Error("Bulk upload failed");
  return res.json();
}
