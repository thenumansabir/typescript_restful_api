/*
  Warnings:

  - You are about to drop the column `files_url` on the `Task` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "task_title" TEXT NOT NULL,
    "task_description" TEXT NOT NULL,
    "is_completed" BOOLEAN NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Task_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("id", "is_completed", "task_description", "task_title", "user_id") SELECT "id", "is_completed", "task_description", "task_title", "user_id" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
CREATE UNIQUE INDEX "Task_task_title_key" ON "Task"("task_title");
CREATE TABLE "new_File" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "task_id" INTEGER NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_ext" TEXT NOT NULL,
    "file_base64" TEXT NOT NULL,
    CONSTRAINT "File_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_File" ("file_base64", "file_ext", "file_name", "file_type", "id", "task_id") SELECT "file_base64", "file_ext", "file_name", "file_type", "id", "task_id" FROM "File";
DROP TABLE "File";
ALTER TABLE "new_File" RENAME TO "File";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
