/*
  Warnings:

  - The primary key for the `Task` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "task_title" TEXT NOT NULL,
    "task_description" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL,
    "user_id" TEXT NOT NULL,
    CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("id", "is_completed", "task_description", "task_title", "user_id") SELECT "id", "is_completed", "task_description", "task_title", "user_id" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_task_title_key" ON "Task"("task_title");
CREATE TABLE "new_File" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "task_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_ext" TEXT NOT NULL,
    "file_base64" TEXT NOT NULL,
    CONSTRAINT "File_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_File" ("file_base64", "file_ext", "file_name", "file_type", "id", "task_id") SELECT "file_base64", "file_ext", "file_name", "file_type", "id", "task_id" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "role" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "password", "role", "status") SELECT "email", "id", "password", "role", "status" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
