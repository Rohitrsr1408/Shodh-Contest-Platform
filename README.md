# Shodh-a-Code Contest Platform

A full-stack competitive programming contest platform built with Spring Boot and Next.js.

## Features

- **User Registration**: Join contests with username and contest ID
- **Problem Viewing**: Browse programming problems with descriptions, test cases, and difficulty badges
- **Multi-Language Support**: Write solutions in Java or C++ with language-specific code templates
- **Code Submission**: Submit solutions through an in-browser code editor with language selection
- **Real-time Judging**: Simulated code execution with status updates (Pending → Running → Accepted/Wrong Answer)
- **Live Leaderboard**: Auto-refreshing leaderboard with medal emojis for top performers
- **Per-User Submission Tracking**: View your submission history with sequential numbering (#1, #2, #3...)
- **Enhanced UI**: Modern gradient design with status icons, difficulty badges, and responsive layouts
- **Multiple Problems**: Pre-seeded contest with 3 programming challenges

## Technology Stack

### Backend
- **Spring Boot 3.2.0** - REST API framework
- **Java 17** - Programming language
- **H2 Database** - In-memory database for development
- **Spring Data JPA** - Database ORM
- **Maven** - Dependency management

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **Tailwind CSS** - Styling framework
- **JavaScript** - Programming language

## Project Structure

```
shodh-a-code/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/shodhacode/
│   │   │   │   ├── entity/          # JPA entities
│   │   │   │   ├── repository/      # Data repositories
│   │   │   │   ├── service/         # Business logic
│   │   │   │   ├── controller/      # REST controllers
│   │   │   │   └── dto/             # Data transfer objects
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql         # Seed data
│   └── pom.xml
├── frontend/
│   ├── pages/
│   │   ├── index.js                 # Join contest page
│   │   ├── contest/[id].js          # Contest page
│   │   └── _app.js
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   └── next.config.js
├── start.sh
└── README.md
```

## Setup Instructions

### Prerequisites
- Java 17 or higher
- Node.js 20 or higher
- Maven

### Running on Replit
The application is configured to run automatically on Replit. Simply click the "Run" button to start both backend and frontend servers.

### Manual Setup

1. **Build Backend**
   ```bash
   cd backend
   mvn clean package -DskipTests
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Run Application**
   ```bash
   bash start.sh
   ```

The application will be available at:
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:8080

## API Documentation

### Base URL
`http://localhost:8080/api`

### Endpoints

#### Get Contest
```http
GET /contests/{contestId}
```

**Response:**
```json
{
  "id": 1,
  "name": "Sample Programming Contest",
  "description": "A beginner-friendly programming contest",
  "problems": [
    {
      "id": 1,
      "title": "Add Two Numbers",
      "description": "Write a program...",
      "sampleInput": "2 3",
      "expectedOutput": "5",
      "points": 100
    }
  ]
}
```

#### Join Contest
```http
POST /contests/join
Content-Type: application/json

{
  "username": "john_doe",
  "contestId": 1
}
```

**Response:**
```json
{
  "id": 1,
  "username": "john_doe",
  "contestId": 1
}
```

#### Submit Code
```http
POST /submissions
Content-Type: application/json

{
  "userId": 1,
  "problemId": 1,
  "language": "JAVA",
  "code": "import java.util.*;\npublic class Main {\n  public static void main(String[] args) {\n    Scanner sc = new Scanner(System.in);\n    int a = sc.nextInt(), b = sc.nextInt();\n    System.out.println(a+b);\n  }\n}"
}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "problemId": 1,
  "language": "JAVA",
  "code": "...",
  "status": "PENDING",
  "submittedAt": "2025-10-26T08:00:00",
  "score": 0
}
```

#### Get Submission Status
```http
GET /submissions/{submissionId}
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "problemId": 1,
  "status": "ACCEPTED",
  "result": "All test cases passed!",
  "score": 100,
  "submittedAt": "2025-10-26T08:00:00"
}
```

#### Get Leaderboard
```http
GET /contests/{contestId}/leaderboard
```

**Response:**
```json
[
  {
    "username": "john_doe",
    "totalScore": 250,
    "solvedProblems": 2
  }
]
```

## Architecture

### Backend Architecture

The backend follows a layered architecture:

1. **Controllers**: Handle HTTP requests and responses
2. **Services**: Contain business logic
3. **Repositories**: Data access layer using Spring Data JPA
4. **Entities**: JPA entity models

**Key Components:**

- **JudgeService**: Simulates code execution for Java and C++ with realistic delays and intelligent code analysis
- **LeaderboardService**: Calculates rankings based on accepted submissions
- **ContestService**: Manages contest and user operations
- **Language Support**: JAVA and CPP enum values for multi-language submissions

### Frontend State Flow

1. User joins contest → Store user ID in localStorage
2. Fetch contest data → Display problems
3. User selects problem → Update UI
4. User submits code → Create submission
5. Poll submission status every 2 seconds until completion
6. Poll leaderboard every 15 seconds for updates

### Simulated Judging

Since Docker is not available in Replit, the platform uses an intelligent simulated judging engine that:

- Supports both Java and C++ code analysis
- Analyzes code for relevant operations (e.g., addition, multiplication, factorial patterns)
- Matches problem requirements with code patterns using language-specific heuristics
- Provides realistic status transitions: PENDING → RUNNING → ACCEPTED/WRONG_ANSWER
- Includes deliberate delays to simulate real code execution
- Awards points only for accepted solutions

## Pre-seeded Data

The application comes with a sample contest containing 3 problems:

1. **Add Two Numbers** (100 points)
   - Input: Two integers
   - Output: Their sum

2. **Square a Number** (100 points)
   - Input: One integer
   - Output: Its square

3. **Find Factorial** (150 points)
   - Input: One integer (0-12)
   - Output: Its factorial

## Usage Guide

1. Open the application in your browser
2. Enter a username and contest ID (use "1" for the sample contest)
3. Click "Join Contest"
4. Select a problem from the tabs to view its description and difficulty
5. Choose your preferred language (Java or C++) from the dropdown
6. Write your solution in the code editor (templates provided for each language)
7. Click "Submit Solution"
8. Watch your submission status update in real-time with visual status icons
9. View your per-user submission history with sequential numbering
10. Check the live leaderboard to see your ranking with medal emojis for top 3

## Development Notes

- The H2 database is in-memory, so data resets on server restart
- Frontend uses Next.js rewrites to proxy API calls to the backend
- Both servers must run concurrently for the application to work
- The judging engine is simulated for demonstration purposes

## Future Enhancements

- Integrate actual code execution using external judge APIs (Judge0, Sphere Engine)
- Add user authentication and persistent accounts
- Support additional programming languages (Python, JavaScript, Go, Rust)
- Implement contest scheduling with start/end times
- Add detailed submission history and code review features
- Support for custom test cases
- Add time and memory limit tracking
- Implement partial scoring for partially correct solutions

## License

This is a prototype/educational project.
