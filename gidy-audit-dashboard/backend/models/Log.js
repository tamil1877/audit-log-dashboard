import mongoose from "mongoose";

// This mirrors the exact log shape from the assignment doc.
// Indexes are added on the fields we actually filter/sort/search on -
// without them, sorting or filtering 10k+ documents means a full
// collection scan every time, which gets slow fast.
const logSchema = new mongoose.Schema(
  {
    actor: { type: String, required: true, index: true },
    role: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    resourceType: { type: String, required: true },
    ipAddress: { type: String, required: true },
    region: { type: String, required: true, index: true },
    severity: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["Unresolved", "Investigating", "Resolved"],
      required: true,
      index: true,
    },
    timestamp: { type: Date, required: true, index: true },
  },
  {
    timestamps: false, // we already have our own timestamp field from the log source
  }
);

// Compound text index so the search bar can hit actor/action/resource
// in one query instead of us running separate regex checks per field.
logSchema.index({ actor: "text", action: "text", resource: "text" });

export default mongoose.model("Log", logSchema);
