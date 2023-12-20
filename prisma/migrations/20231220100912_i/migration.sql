/*
  Warnings:

  - Added the required column `files_url` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "task_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_ext" TEXT NOT NULL,
    "file_base64" TEXT NOT NULL
);
INSERT INTO "new_File" ("file_base64", "file_ext", "file_name", "file_type", "id", "task_id") SELECT "file_base64", "file_ext", "file_name", "file_type", "id", "task_id" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "task_title" TEXT NOT NULL,
    "task_description" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL,
    "user_id" INTEGER NOT NULL,
    "files_url" TEXT NOT NULL
);
INSERT INTO "new_Task" ("id", "is_completed", "task_description", "task_title", "user_id") SELECT "id", "is_completed", "task_description", "task_title", "user_id" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_task_title_key" ON "Task"("task_title");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
