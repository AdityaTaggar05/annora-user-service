import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

export const db = drizzle(pool)

// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";

// const connectionString = process.env.DATABASE_URL!;
// const sql = neon(connectionString);

// export const db = drizzle({ client: sql });