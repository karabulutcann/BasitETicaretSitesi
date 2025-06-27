import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import { Pool } from "pg";

console.log(process.env.DB_CONNECTION_STRING);

const pool = new Pool({
  connectionString:
    process.env.DB_CONNECTION_STRING,
});

export const db = drizzle(pool, {
  schema,
});
