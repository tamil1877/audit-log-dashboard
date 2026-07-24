export default function Pagination({ page, totalPages, total, limit, onPageChange }) {
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="bg-console-panel border-t border-console-border px-6 py-3 flex items-center justify-between text-xs text-console-muted">
      <span>
        Showing {start}-{end} of {total.toLocaleString()}
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-1.5 border border-console-border rounded-md hover:border-signal-accent hover:text-signal-accent disabled:opacity-30 disabled:hover:border-console-border disabled:hover:text-console-muted transition-colors"
        >
          Prev
        </button>
        <span className="font-medium text-console-text">
          Page {page} / {totalPages || 1}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="px-3 py-1.5 border border-console-border rounded-md hover:border-signal-accent hover:text-signal-accent disabled:opacity-30 disabled:hover:border-console-border disabled:hover:text-console-muted transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
