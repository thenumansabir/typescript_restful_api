export class Queries {
  checkUserExists = "SELECT s from students s WHERE s.email = $1";
  addUser =
    "INSERT INTO students (email,passowrd,status,role) VALUES ($1, $2, $3, $4)";
}
