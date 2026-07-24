// Generates 10,000 fake audit log records and sends them to the
// bulk upload endpoint, so you can actually test the "10k in one
// request" requirement without typing them by hand.
//
// Run this AFTER the backend server is already running:
//   npm run seed

import { faker } from "@faker-js/faker";

const ACTIONS = ["DELETE_USER", "CREATE_USER", "UPDATE_ROLE", "LOGIN_FAILED", "EXPORT_DATA", "GRANT_ACCESS", "REVOKE_ACCESS"];
const RESOURCE_TYPES = ["USER", "FILE", "DATABASE", "API_KEY", "ROLE"];
const REGIONS = ["ap-south-1", "us-east-1", "eu-west-1", "ap-southeast-1"];
const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
const STATUSES = ["Unresolved", "Investigating", "Resolved"];
const ROLES = ["admin", "editor", "viewer", "auditor"];

function generateLog() {
  const resourceType = faker.helpers.arrayElement(RESOURCE_TYPES);
  return {
    actor: faker.internet.email(),
    role: faker.helpers.arrayElement(ROLES),
    action: faker.helpers.arrayElement(ACTIONS),
    resource: `/api/${resourceType.toLowerCase()}s/${faker.number.int({ min: 100, max: 999 })}`,
    resourceType,
    ipAddress: faker.internet.ip(),
    region: faker.helpers.arrayElement(REGIONS),
    severity: faker.helpers.arrayElement(SEVERITIES),
    status: faker.helpers.arrayElement(STATUSES),
    timestamp: faker.date.between({ from: "2025-01-01", to: "2026-07-20" }).toISOString(),
  };
}

async function seed() {
  const totalRecords = 10000;
  const logs = Array.from({ length: totalRecords }, generateLog);

  console.log(`Generated ${logs.length} fake logs, uploading...`);

  const res = await fetch("http://localhost:5000/api/logs/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(logs),
  });

  const result = await res.json();
  console.log("Server response:", result);
}

seed().catch((err) => {
  console.error("Seeding failed:", err.message);
  process.exit(1);
});
