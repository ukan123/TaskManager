# TaskManager - Full Stack Task Management Application

A full-stack task management application built with .NET 8 Web API backend and React frontend.

## Project Structure

```
TaskManager/
├── backend/                 # .NET 8 Web API backend
│   └── TaskManager.Api/
│       ├── Controllers/     # API controllers
│       ├── Data/           # Database context
│       ├── Middleware/     # Custom middleware
│       ├── Models/         # Data models
│       ├── Program.cs      # Main application entry point
│       ├── appsettings.json # Configuration
│       └── TaskManager.Api.csproj
└── frontend/               # React frontend
    └── task-manager/
        ├── src/
        │   ├── components/ # React components
        │   ├── services/   # API service
        │   ├── types.ts    # Type definitions
        │   ├── App.tsx     # Main app component
        │   └── main.tsx    # Entry point
        ├── package.json
        ├── tsconfig.json
        └── vite.config.ts
```

## Features

### Backend (.NET 8 Web API)
- RESTful API for managing tasks
- Entity Framework Core with SQL Server
- CRUD operations for tasks
- Error handling middleware
- CORS support for frontend integration

### Frontend (React + TypeScript)
- Create, read, update, and delete tasks
- Form validation
- Responsive UI
- Task completion tracking
- Modern React with TypeScript

## How to Run

### Using the startup scripts (Recommended)

We've included two scripts to easily start both frontend and backend servers simultaneously:

#### Windows Batch Script
Run the `start-dev.bat` file to start both servers in separate command windows:
```bash
start-dev.bat
```

#### PowerShell Script
Run the `start-dev.ps1` file to start both servers:
```powershell
.\start-dev.ps1
```

### Manual Setup

If you prefer to start the servers manually:

#### Backend Setup
1. Navigate to the backend directory: `cd TaskManager/backend/TaskManager.Api`
2. Restore packages: `dotnet restore`
3. Update database: `dotnet ef database update` (or ensure localdb is installed)
4. Run the application: `dotnet run`
5. The API will be available at `https://localhost:5001` or `http://localhost:5000`

#### Frontend Setup
1. Navigate to the frontend directory: `cd TaskManager/frontend/task-manager`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. The application will be available at `http://localhost:5073` (or similar port)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/{id}` | Get a specific task |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/{id}` | Update an existing task |
| DELETE | `/api/tasks/{id}` | Delete a task |

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (v16 or higher)
- [SQL Server LocalDB](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb) or compatible database

## Technologies Used

### Backend
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- SQL Server
- Swagger (for API documentation)

### Frontend
- React 18
- TypeScript
- Vite (build tool)
- Axios (HTTP client)
- CSS Modules

## Development Notes

- The frontend expects the backend to be running on `http://localhost:5000` (proxy configured in `vite.config.ts`)
- The application uses local storage for persistence with Entity Framework and SQL Server
- Task items include title, description, completion status, creation date, and completion date