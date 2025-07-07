# Task Manager 1.2

## Project Description
Friendly and Simple task management application with clean ui to manage tasks.
-  demo [https://yn-taskmanger.netlify.app](https://yn-taskmanger.netlify.app)

You can use the following test user to log in:

- **Email:** `john@test.com`
- **Password:** `password`

## Features
- User Authentication
- Task Creation
- Task Update
- Task Mark as complete
- Task Filtering
- Task Viewing

## Technology Stack
- Backend: Laravel (12)
- Frontend: Vue.js with TypeScript
- State management: Pinia
- Database: MySQL 
- UI Framework: Vuetify

## Testing
- PHP Unit Tests (Feature tests)
- Cypress End-to-End (E2E) Tests

## Setup Instructions

### Prerequisites

Make sure you have the following installed:

- [PHP](https://www.php.net/) >= 8.2
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/) — **Latest version required**
- [MySQL](https://www.mysql.com/) or compatible database; other options include [XAMPP](https://www.apachefriends.org/)

> 🚨 **Important for Frontend & Cypress Testing:**  
> Cypress and some frontend dependencies require the **latest stable version of Node.js** to run correctly.  
> Use [nvm (Node Version Manager)](https://github.com/nvm-sh/nvm) or [download the latest Node.js](https://nodejs.org/en/download) manually before running `npm install` or Cypress tests.


### First Steps

Open a terminal and clone this repo:

```bash
# Clone this repository
git clone 

# Go into the repository
cd task-manager

# Remove current origin repository
git remote remove origin

# If you want, you can add a new remote repository
git remote add origin https://github.com/<your-github-username>/<your-repo-name>.git
```

### Backend Setup

1. Navigate to backend folder:

   ```bash
   cd backend
   ```

2. Copy environment config:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your database credentials:

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=your_db_name
   DB_USERNAME=root
   DB_PASSWORD=your_password
   ```

4. Install dependencies:

   ```bash
   composer install
   ```

5. Generate app key and JWT secret key. Run the following commands one after another:

   ```bash
   php artisan key:generate
   php artisan jwt:secret
 
   ```

6. Run migrations and seeders to generate mock data to get the application ready:

   ```bash
   php artisan migrate --seed
   ```


7. Start Laravel development server:

   ```bash
   php artisan serve --host localhost --port 8000
   ```

   The API will be available at `http://localhost:8000`.

### Frontend Setup

1. Navigate to frontend folder:

   ```bash
   cd frontend
   ```

2. Copy environment config:

   ```bash
   cp .env.example .env
   ```

3. Update `.env` with the backend API URL:

   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`.
   If you change the development url make sure to update the cors.php file in laravel as other wise it wont allow

6. In the `axios.js` file in the service folder, use the Vite base URL or your custom base URL:

   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173`.

### Testing

#### Backend: PHP Unit

To run feature tests for the Laravel backend:

>  Make sure you're in the project root before navigating to `backend`

```bash
cd backend
php artisan test
```
#### Frontend: Cypress

To run feature tests for the Vue frontend:

>  Make sure you're in the project root before navigating to `frontend`

```bash
cd frontend
npm run test:e2e:dev
```
>  **Note:**  
> If you change the test runner's origin (e.g., running the frontend on a different port), be sure to update the `allowed_origins` setting in your Laravel `config/cors.php` file:


## Main API Endpoints

| Method | Endpoint                 | Description                   |
|--------|--------------------------|-------------------------------|
| POST   | `/api/login`             | User login                    |
| POST   | `/api/register`          | User registration             |
| POST   | `/api/logout`            | User logout                   |
| GET    | `/api/me`                | Get authenticated user info   |
| POST   | `/api/refresh`           | Refresh authentication token  |
| GET    | `/api/tasks`             | List all tasks                |
| GET    | `/api/tasks/{id}`        | Get a specific task           |
| POST   | `/api/tasks`             | Create a new task             |
| PUT    | `/api/tasks/{id}`        | Update a  task                |
| DELETE | `/api/tasks/{id}`        | Delete a task                 |
| PATCH  | `/api/tasks/{id}/complete` | Mark a task as complete     |


## Hosting Information

This project is deployed using the following free services:

- **Frontend** is hosted on [Netlify](https://www.netlify.com/)
- **Backend API** is hosted on [Sevella](https://sevella.com/) )

###  Deployment Resources

You can learn more about deployment from the official documentation:

- [Netlify Docs (Frontend Hosting)](https://docs.netlify.com/)
- [Sevella Docs (PHP & Laravel Hosting)](https://docs.sevella.com/) 

>  **Important:** Ensure that CORS is properly configured in your Laravel backend (`config/cors.php`) to allow requests from your deployed Netlify domain. repo has already cors file.


## Future Improvement Ideas

- **Drag and Drop Functionality** 

- **PWA (Progressive Web App) Integration**  




