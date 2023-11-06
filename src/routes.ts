import express from "express";
import TaskController from "./controllers";

const router = express.Router();

router.post("/tasks", TaskController.createTask);
router.put("/tasks/:id", TaskController.updateTask);
router.get("/tasks/:id", TaskController.getTask);
router.get("/tasks", TaskController.getAllTasks);
router.delete("/tasks/:id", TaskController.deleteTask);

export default router;
/*
// ********** APIs Endpoint Documentation ********** 

1. router.post("/tasks", TaskController.createTask); 
    When you make a POST request to "/tasks" endpoint, it will trigger the 
    createTask function in the TaskController. This function is responsible 
    for creating a new task in database.

2. router.put("/tasks/:id", TaskController.updateTask);
    When you make a PUT request to "/tasks:id" endpoint, it will trigger the 
    updateTask function in the TaskController. This function will find task by id
    and will update it in database.

3. router.get("/tasks/:id", TaskController.getTask);
    When you make a GET request to "/tasks:id" endpoint, it will trigger the 
    getTask function in the TaskController. This function will search task by id
    and return it from database.

4. router.get("/tasks", TaskController.getAllTasks);
    When you make a GET request to "/tasks" endpoint, it will trigger the 
    getAllTasks function in the TaskController. This function will return 
    all the tasks from collection.

5. router.delete("/tasks/:id", TaskController.deleteTask);
    When you make a DELETE request to "/tasks" endpoint, it will trigger the 
    deleteTask function in the TaskController. This function will search task 
    by id and delete it from database's collection.

*/
