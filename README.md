🏆 Shodh-a-Code Contest Platform 🏆

A full-stack competitive programming contest platform built with Spring Boot and Next.js, now fully containerized with Docker.

✨ Features

✅ User Registration: Join contests with username and contest ID

✅ Problem Viewing: Browse programming problems with descriptions, test cases, and difficulty badges

✅ Multi-Language Support: Write solutions in Java or C++ with language-specific code templates

✅ Code Submission: Submit solutions through an in-browser code editor with language selection

✅ Real-time Judging: Simulated code execution with status updates (Pending → Running → Accepted/Wrong Answer)

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
│ ├── src/
│ │ ├── main/
│ │ │ ├── java/com/shodhacode/
│ │ │ │ ├── entity/ # JPA entities
│ │ │ │ ├── repository/ # Data repositories
│ │ │ │ ├── service/ # Business logic
│ │ │ │ ├── controller/ # REST controllers
│ │ │ │ └── dto/ # Data transfer objects
│ │ │ └── resources/
│ │ │ ├── application.properties
│ │ │ └── data.sql # Seed data
│ ├── pom.xml
│ └── Dockerfile # Backend Dockerfile
├── frontend/
│ ├── pages/
│ │ ├── index.js # Join contest page
│ │ ├── contest/[id].js # Contest page
│ │ └── \_app.js
│ ├── styles/
│ │ └── globals.css
│ ├── package.json
│ ├── next.config.js
│ └── Dockerfile # Frontend Dockerfile
├── docker-compose.yml # Docker Compose file
└── README.md

🚀 Running with Docker

This application is designed to be run using Docker Compose, which builds and networks the frontend and backend services automatically.

Prerequisites

Docker Engine

Docker Compose

1. Clone the Repository

git clone <your-repository-url>
cd ShodhCodePlatform

2. Build and Run Containers

Run the following command from the root ShodhCodePlatform directory (the one containing docker-compose.yml):

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

📚 API Documentation

Base URL

http://localhost:8080/api

Endpoints

Get Contest

GET /contests/{contestId}

Response:

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
"code": "import java.util.\*;\npublic class Main {\n public static void main(String[] args) {\n Scanner sc = new Scanner(System.in);\n int a = sc.nextInt(), b = sc.nextInt();\n System.out.println(a+b);\n }\n}"
}

Response:

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

Get Submission Status

GET /submissions/{submissionId}

Response:

{
"id": 1,
"userId": 1,
"problemId": 1,
"status": "ACCEPTED",
"result": "All test cases passed!",
"score": 100,
"submittedAt": "2025-10-26T08:00:00"
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

🔧 Architecture

Backend Architecture

The backend follows a layered architecture:

Controllers: Handle HTTP requests and responses

Services: Contain business logic

Repositories: Data access layer using Spring Data JPA

Entities: JPA entity models

Key Components:

JudgeService: Simulates code execution for Java and C++ with realistic delays and intelligent code analysis

LeaderboardService: Calculates rankings based on accepted submissions

ContestService: Manages contest and user operations

Language Support: JAVA and CPP enum values for multi-language submissions

Frontend State Flow

User joins contest → Store user ID in localStorage

Fetch contest data → Display problems

User selects problem → Update UI

User submits code → Create submission

Poll submission status every 2 seconds until completion

Poll leaderboard every 15 seconds for updates

🧠 Simulated Judging

The platform uses an intelligent simulated judging engine that:

Supports both Java and C++ code analysis

Analyzes code for relevant operations (e.g., addition, multiplication, factorial patterns)

Matches problem requirements with code patterns using language-specific heuristics

Provides realistic status transitions: PENDING → RUNNING → ACCEPTED/WRONG_ANSWER

Includes deliberate delays to simulate real code execution

Awards points only for accepted solutions

📊 Pre-seeded Data

The application comes with a sample contest containing 3 problems:

Add Two Numbers (100 points)

Input: Two integers

Output: Their sum

Square a Number (100 points)

Input: One integer

Output: Its square

Find Factorial (150 points)

Input: One integer (0-12)

Output: Its factorial

💡 Usage Guide

Open http://localhost:5000 in your browser

Enter a username and contest ID (use "1" for the sample contest)

Click "Join Contest"

Select a problem from the tabs to view its description and difficulty

Choose your preferred language (Java or C++) from the dropdown

Write your solution in the code editor (templates provided for each language)

Click "Submit Solution"

Watch your submission status update in real-time with visual status icons

View your per-user submission history with sequential numbering

Check the live leaderboard to see your ranking with medal emojis for top 3

📝 Development Notes

The H2 database is in-memory, so data resets every time the shodh-backend container restarts.

The frontend (frontend) proxies API calls to the backend (backend) using Next.js rewrites. This inter-container communication is managed by Docker Compose.

The judging engine is simulated for demonstration purposes.

🔮 Future Enhancements

Integrate actual code execution using external judge APIs (Judge0, Sphere Engine)

Add user authentication and persistent accounts

Support additional programming languages (Python, JavaScript, Go, Rust)

Implement contest scheduling with start/end times

Add detailed submission history and code review features

Support for custom test cases

Add time and memory limit tracking

Implement partial scoring for partially correct solutions

License

This is a prototype/educational project.
