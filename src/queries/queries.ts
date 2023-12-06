export class Queries {
  checkUserExists = "SELECT s from users s WHERE s.email = $1";
  addUser =
    "INSERT INTO users (email,password,status,role) VALUES ($1, $2, $3, $4)";
  getUserForLogin = "SELECT * FROM users WHERE email = $1";
  getAllUsers = "SELECT * FROM users WHERE role = 'user'";
  getUserById = "SELECT * FROM users WHERE id = $1";
  updateUser =
    "UPDATE users SET email = $1, password=$2, status=$3, role =$4 WHERE id = $5";
  deleteUser = "DELETE FROM users WHERE id = $1";
}
