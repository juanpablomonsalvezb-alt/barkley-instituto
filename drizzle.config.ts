import { defineConfig } from "drizzle-kit";
import path from "path";

// Use local SQLite database file
const dbPath = process.env.DATABASE_URL || path.join(process.cwd(), "taskManagement.db");

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath,
  },
});
