import Log from "../models/Log.js";

// POST /api/logs/bulk
// Accepts an array of log records and inserts them in one shot.
// insertMany is the whole point here - looping 10,000 individual
// .save() calls would mean 10,000 round trips to Mongo. insertMany
// batches them, which is what makes "10,000 records in one request"
// actually feasible.
export async function bulkUpload(req, res) {
  const logs = req.body;

  if (!Array.isArray(logs) || logs.length === 0) {
    return res.status(400).json({ error: "Expected a non-empty array of log records" });
  }

  try {
    // ordered: false so one bad record doesn't stop the whole batch -
    // we still want the other 9,999 valid ones to go in.
    const result = await Log.insertMany(logs, { ordered: false });
    res.status(201).json({
      message: `${result.length} logs inserted`,
      count: result.length,
    });
  } catch (err) {
    // insertMany throws even on partial success when ordered: false,
    // so we still report how many made it through.
    if (err.insertedDocs) {
      return res.status(207).json({
        message: "Some records were inserted, some failed validation",
        inserted: err.insertedDocs.length,
        failed: logs.length - err.insertedDocs.length,
      });
    }
    res.status(500).json({ error: "Bulk insert failed", details: err.message });
  }
}

// GET /api/logs
// Every bit of filtering, searching, sorting and pagination happens
// in the Mongo query itself - nothing is loaded into memory and
// sliced in JS. That's the requirement from the doc, and it's also
// the only way this stays fast once the collection has real volume.
export async function getLogs(req, res) {
  try {
    const {
      search,
      actor,
      role,
      action,
      region,
      severity,
      status,
      from,
      to,
      sortBy = "timestamp",
      order = "desc",
      page = 1,
      limit = 25,
    } = req.query;

    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (actor) query.actor = actor;
    if (role) query.role = role;
    if (action) query.action = action;
    if (region) query.region = region;
    if (severity) query.severity = severity;
    if (status) query.status = status;

    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const pageNum = Math.max(parseInt(page, 10) || 1, 1);
    const pageSize = Math.min(parseInt(limit, 10) || 25, 100); // cap it so nobody requests 10k rows at once
    const skip = (pageNum - 1) * pageSize;

    const sortDirection = order === "asc" ? 1 : -1;
    const sortObj = { [sortBy]: sortDirection };

    const [logs, total] = await Promise.all([
      Log.find(query).sort(sortObj).skip(skip).limit(pageSize).lean(),
      Log.countDocuments(query),
    ]);

    res.json({
      data: logs,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch logs", details: err.message });
  }
}

// GET /api/logs/facets
// Powers the filter dropdowns with the actual distinct values that
// exist in the data, instead of hardcoding a list in the frontend
// that could drift from what's really in the DB.
export async function getFacets(req, res) {
  try {
    const [regions, severities, statuses, roles] = await Promise.all([
      Log.distinct("region"),
      Log.distinct("severity"),
      Log.distinct("status"),
      Log.distinct("role"),
    ]);
    res.json({ regions, severities, statuses, roles });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch filter options", details: err.message });
  }
}
