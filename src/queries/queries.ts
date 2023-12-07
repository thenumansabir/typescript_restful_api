export class Queries {
  // ------------ Users Queries ------------
  checkUserExists = "SELECT u from users u WHERE u.email = $1";
  addUser =
    "INSERT INTO users (email,password,status,role) VALUES ($1, $2, $3, $4)";
  getUserForLogin = "SELECT * FROM users WHERE email = $1";
  getAllUsers = "SELECT * FROM users WHERE role = 'user'";
  getUserById = "SELECT * FROM users WHERE id = $1";
  updateUser =
    "UPDATE users SET email = $1, password=$2, status=$3, role =$4 WHERE id = $5";
  deleteUser = "DELETE FROM users WHERE id = $1";

  // ------------ Tasks Queries ------------
  checkTaskExists = "SELECT t from tasks t WHERE t.task_title = $1";
  createTask =
    "INSERT INTO tasks (task_title,task_description,is_completed,user_id,files_url) VALUES ($1, $2, $3, $4,$5)";
  getAllTasks = "SELECT * FROM tasks WHERE user_id = $1 OFFSET $2 LIMIT $3";
  getTaskById = "SELECT * FROM tasks WHERE id = $1 AND user_id = $2";
  deleteTask = "DELETE FROM tasks WHERE id = $1 AND user_id = $2";
}
