import { Pool, PoolConfig } from "pg";

const poolConfig: PoolConfig = {
  user: "postgres",
  host: "localhost",
  database: "tasks",
  password: "postgres",
  port: 5432,
};

const pool = new Pool(poolConfig);
// pool.on("connect", () => {
//   console.log("Connected to the database");
// });

export default pool;
