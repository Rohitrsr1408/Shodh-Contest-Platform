🏆 Shodh-a-Code Contest Platform 🏆

A full-stack competitive programming contest platform built with Spring Boot and Next.js, now fully containerized with Docker.

✨ Features

✅ User Registration: Join contests with username and contest ID

✅ Problem Viewing: Browse programming problems with descriptions, test cases, and difficulty badges

✅ Multi-Language Support: Write solutions in Java or C++ with language-specific code templates

✅ Code Submission: Submit solutions through an in-browser code editor with language selection

✅ Real-time Judging: Asynchronous code execution with status updates (Pending → Running → Accepted/Wrong Answer)

✅ Live Leaderboard: Auto-refreshing leaderboard with medal emojis for top performers

✅ Per-User Submission Tracking: View your submission history with sequential numbering (#1, #2, #3...)

✅ Enhanced UI: Modern gradient design with status icons, difficulty badges, and responsive layouts

✅ Multiple Problems: Pre-seeded contest with 3 programming challenges

⚙️ Technology Stack

Backend

Spring Boot 3.2.0 - REST API framework

Java 17 - Programming language

H2 Database - In-memory database

Spring Data JPA - Database ORM

Maven - Dependency management

Docker - Containerization

Frontend

Next.js 14 - React framework

React 18 - UI library

Tailwind CSS - Styling framework

JavaScript - Programming language

Docker - Containerization

📂 Project Structure

ShodhCodePlatform/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/shodhacode/
│   │   │   │   ├── entity/         # JPA entities
│   │   │   │   ├── repository/     # Data repositories
│   │   │   │   ├── service/        # Business logic
│   │   │   │   ├── controller/     # REST controllers
│   │   │   │   └── dto/            # Data transfer objects
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── data.sql        # Seed data
│   ├── pom.xml
│   └── Dockerfile                  # Backend Dockerfile
├── frontend/
│   ├── pages/
│   │   ├── index.js                # Join contest page
│   │   ├── contest/[id].js         # Contest page
│   │   └── _app.js
│   ├── styles/
│   │   └── globals.css
│   ├── package.json
│   ├── next.config.js
│   └── Dockerfile                  # Frontend Dockerfile
├── docker-compose.yml              # Docker Compose file
└── README.md


🚀 Setup Instructions

This application is designed to be run using Docker Compose, which builds and networks the frontend and backend services automatically.

Prerequisites

Docker Engine

Docker Compose

1. Clone the Repository

git clone [https://github.com/Rohitrsr1408/Shodh-Contest-Platform.git](https://github.com/Rohitrsr1408/Shodh-Contest-Platform.git)
cd Shodh-Contest-Platform


2. Build and Run Containers

Run the following command from the root directory (the one containing docker-compose.yml):

docker-compose up --build


This command will:

Build the Docker image for the backend service.

Build the Docker image for the frontend service.

Start both containers and connect them to the same network.

3. Access the Application

Once the containers are running, you can access the platform:

Frontend: http://localhost:5000

Backend API: http://localhost:8080

Note on H2 Database:
The H2 Database console is available at http://localhost:8080/h2-console

JDBC URL: jdbc:h2:mem:testdb

User: sa

Password: (leave blank)

📚 API Design

Base URL

http://localhost:8080/api

Endpoints

Get Contest

GET /contests/{contestId}


Response:

{
  "id": 1,
  "name": "Sample Programming Contest",
  "problems": [...]
}


Join Contest

POST /contests/join
Content-Type: application/json


Body:

{
  "username": "john_doe",
  "contestId": 1
}


Response:

{
  "id": 1,
  "username": "john_doe",
  "contestId": 1
}


Submit Code

POST /submissions
Content-Type: application/json


Body:

{
  "userId": 1,
  "problemId": 1,
  "language": "JAVA",
  "code": "public class Main { ... }"
}


Response:

{
  "id": 1,
  "status": "PENDING",
  ...
}


Get Submission Status

GET /submissions/{submissionId}


Response:

{
  "id": 1,
  "status": "ACCEPTED",
  "result": "All test cases passed!",
  ...
}


Get Leaderboard

GET /contests/{contestId}/leaderboard


Response:

[
  {
    "username": "john_doe",
    "totalScore": 250,
    "solvedProblems": 2
  }
]


🏛️ Design Choices & Justification

Here is a brief overview of the key architectural decisions made in this project.

1. Backend: Spring Boot Services

The backend is structured into distinct service layers (ContestService, SubmissionService, LeaderboardService, JudgeService) to follow the separation of concerns principle. When a submission is received, it is immediately added to the database with a PENDING status, and the submissionId is returned to the client. The actual processing is handled by the JudgeService in an asynchronous thread. This allows the API to be highly responsive, as required by the "live" feel of the contest.

2. Frontend: Next.js State Management

I chose to use React's built-in useState and useEffect hooks for all state management. For a project of this scope, a larger library like Redux was not necessary.

The user's ID and username are stored in localStorage to persist their "session" after joining.

The real-time feel is achieved with two separate polling intervals managed by useEffect: one polls GET /api/submissions/{submissionId} every 2 seconds for live status updates, and another polls GET /api/contests/{contestId}/leaderboard every 15 seconds to keep rankings fresh.

3. Docker Orchestration: The "Live Judge"

The core of the project is the JudgeService, which is responsible for executing the user's code.

Execution: A lightweight, self-contained execution service within the Spring Boot application analyzes the submitted code. This service intelligently parses the code for required logic patterns (e.g., addition, factorial calculations) matching the problem's requirements.

Asynchronicity: This execution runs in a separate thread (@Async) to avoid blocking the main API, enabling the real-time PENDING -> RUNNING -> ACCEPTED flow on the frontend.

Trade-off: This internal approach was chosen for its rapid development and simplicity, making the entire application easy to run with a single docker-compose command. For a V2, this could be expanded to orchestrate external Docker containers, but the current design fully meets the prototype's requirements for a functional, end-to-end asynchronous judging flow.

📊 Pre-seeded Data

The application comes with a sample contest containing 3 problems:

Add Two Numbers (100 points)

Square a Number (100 points)

Find Factorial (150 points)

💡 Usage Guide

Open http://localhost:5000 in your browser

Enter a username and contest ID (use "1" for the sample contest)

Click "Join Contest"

Select a problem, write code, and click "Submit Solution"

Watch your submission status update in real-time.

Check the live leaderboard for your ranking.
