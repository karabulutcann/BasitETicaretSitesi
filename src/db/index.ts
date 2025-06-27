import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DB_CONNECTION_STRING,
});

export const db = drizzle(pool, {
  schema,
});
