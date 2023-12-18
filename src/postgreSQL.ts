import { Pool, PoolConfig } from "pg";

const poolConfig: PoolConfig = {
  user: "postgres",
  host: "localhost",
  database: "tasks",
  password: "postgres",
  port: 5432,
};

const pool = new Pool(poolConfig);
// pool.connect()
//   .then(() => {
//     console.log("Connected to the PostgreSQL");
//   })
//   .catch((error) => {
//     console.error("Error connecting to the PostgreSQL:", error);
//   });
export default pool;
