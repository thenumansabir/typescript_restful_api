export class Queries {
  checkUserExists = "SELECT s from users s WHERE s.email = $1";
  addUser =
    "INSERT INTO users (email,password,status,role) VALUES ($1, $2, $3, $4)";
  getUserForLogin = "SELECT * FROM users WHERE email = $1"
}
