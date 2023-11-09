Task: Build a RESTful API with TypeScript
Description:
Ask the junior developer to build a simple RESTful API using TypeScript. The API should perform basic CRUD (Create, Read, Update, Delete) operations for a resource, such as "Tasks," and interact with a database to store and retrieve data.

Requirements:

1. Create a TypeScript project structure for the backend API with the following files:
   app.ts: The main TypeScript file for the API.
   database.ts: A file for connecting to and interacting with a database (e.g., SQLite, PostgreSQL, or MongoDB).
   models.ts: Define TypeScript interfaces or classes for the resource (e.g., "Task") and data models.
   routes.ts: Define the routes and API endpoints for performing CRUD operations.
   controllers.ts: Implement the request handling logic for each route.
2. Set up a database and connect the application to it. Create a table or collection for the resource (e.g., "Tasks").
3. Implement API endpoints for the following CRUD operations:
   Create a new task (POST request).
   Retrieve a list of tasks (GET request).
   Retrieve a single task by ID (GET request).
   Update a task by ID (PUT request).
   Delete a task by ID (DELETE request).
4. Use TypeScript type annotations to ensure type safety throughout the application, especially when defining request and response structures.
5. Implement error handling to manage potential issues, such as invalid requests or database errors.
6. Add appropriate status codes and response messages for different API operations (e.g., 200 OK, 404 Not Found, 500 Internal Server Error).
7. Implement validation for incoming data, ensuring that only valid data is accepted for creating or updating tasks.
8. Use TypeScript's express or a similar library to handle HTTP requests and responses.
9. Provide documentation or comments in the code to explain the purpose and usage of each endpoint.

Optional Enhancements:
To make the task more challenging, you can suggest the following enhancements:

1. Implement authentication and authorization for API endpoints.
2. Add pagination and filtering options for listing tasks.
3. Create a feature to upload and associate files with tasks.
This backend development task will assess the developer's ability to build a RESTful API, interact with a database, handle HTTP requests and responses, and ensure type safety and error handling using TypeScript. It also encourages them to structure the code for maintainability and scalability.




******************************** Version_02 ********************************

1. Only user can create, update, get and delete task. use JWT token for Authorization and Authentication.
2. New fields added status and role.
3. User with status active can only logged in.
4. User who's role is Admin can only create delete and update users.