import sql from "mssql";

const cfg = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,     
  port: Number(process.env.DB_PORT || 1433),
  database: process.env.DB_NAME,
  options: { trustServerCertificate: true }
};

let pool;
export async function getPool() {
  if (pool) return pool;
  pool = await sql.connect(cfg);
  return pool;
}
export { sql };
