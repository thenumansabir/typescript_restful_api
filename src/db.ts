import { Pool, PoolConfig } from "pg";

const poolConfig: PoolConfig = {
  user: "postgres",
  host: "localhost",
  database: "tasks",
  password: "postgres",
  port: 5432,
};

const pool = new Pool(poolConfig);

export default pool;
