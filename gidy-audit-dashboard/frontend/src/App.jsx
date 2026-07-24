import { useEffect, useState, useCallback } from "react";
import { fetchLogs, fetchFacets } from "./api.js";
import Header from "./components/Header.jsx";
import FilterBar from "./components/FilterBar.jsx";
import LogsTable from "./components/LogsTable.jsx";
import Pagination from "./components/Pagination.jsx";

const EMPTY_FILTERS = {
  search: "",
  severity: "",
  status: "",
  region: "",
  role: "",
  from: "",
  to: "",
  page: 1,
};

export default function App() {
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [sortBy, setSortBy] = useState("timestamp");
  const [order, setOrder] = useState("desc");

  const [logs, setLogs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, limit: 25 });
  const [facets, setFacets] = useState({ regions: [], severities: [], statuses: [], roles: [] });
  const [loading, setLoading] = useState(true);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchLogs({ ...filters, sortBy, order, limit: 25 });
      setLogs(result.data);
      setPagination(result.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, sortBy, order]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    fetchFacets().then(setFacets).catch(console.error);
  }, []);

  function handleSort(key, direction) {
    setSortBy(key);
    setOrder(direction);
  }

  return (
    <div className="min-h-screen flex flex-col bg-console-bg text-console-text">
      <div className="bg-console-lavenderWash border-b-2 border-console-lavenderLine">
        <Header total={pagination.total} />
        <FilterBar filters={filters} onChange={setFilters} facets={facets} onUploaded={loadLogs} />
      </div>

      <LogsTable logs={logs} loading={loading} sortBy={sortBy} order={order} onSort={handleSort} />

      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        limit={pagination.limit}
        onPageChange={(p) => setFilters((f) => ({ ...f, page: p }))}
      />
    </div>
  );
}
