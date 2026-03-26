import { Pool, type QueryResultRow } from "pg";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgres://postgres:postgres@localhost:5432/peoples_network";

declare global {
  // eslint-disable-next-line no-var
  var __pool__: Pool | undefined;
}

export const pool =
  global.__pool__ ??
  new Pool({
    connectionString: databaseUrl
  });

if (process.env.NODE_ENV !== "production") {
  global.__pool__ = pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  values: unknown[] = []
) {
  const result = await pool.query<T>(text, values);
  return result.rows;
}
