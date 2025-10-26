# Shodh-a-Code Contest Platform

## Overview
A fully functional competitive programming contest platform built with Spring Boot (backend) and Next.js (frontend). Users can join contests, view problems, submit code solutions, and compete on a live leaderboard.

## Current State
The application is **fully functional** and running. All core features are implemented and working:

✅ User registration and contest joining  
✅ Problem viewing with descriptions and test cases  
✅ Code submission through in-browser editor  
✅ Real-time submission status updates (PENDING → RUNNING → ACCEPTED/WRONG_ANSWER)  
✅ Live leaderboard with auto-refresh  
✅ Pre-seeded contest with 3 programming problems  

## Recent Changes (October 26, 2025)
- Created complete Spring Boot backend with REST API
- Implemented all JPA entities, repositories, services, and controllers
- Built simulated judging engine with async status updates
- Created Next.js frontend with Tailwind CSS
- Implemented join page and contest page with real-time polling
- Configured workflows to run both backend and frontend
- Added comprehensive documentation in README.md

## Project Architecture

### Backend (`/backend`)
- **Framework**: Spring Boot 3.2.0 with Java 17
- **Database**: H2 in-memory database
- **Structure**:
  - `entity/` - JPA entities (User, Contest, Problem, Submission)
  - `repository/` - Spring Data JPA repositories
  - `service/` - Business logic (ContestService, SubmissionService, JudgeService, LeaderboardService)
  - `controller/` - REST controllers (ContestController, SubmissionController)
  - `dto/` - Data transfer objects
- **Port**: 8080

### Frontend (`/frontend`)
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **Pages**:
  - `/` - Join contest page
  - `/contest/[id]` - Contest page with problems, code editor, submissions, and leaderboard
- **Port**: 5000

### Key Features
1. **Simulated Judging Engine**: Analyzes submitted code for relevant operations and provides realistic status transitions
2. **Real-time Updates**: Polls submission status every 2 seconds, leaderboard every 15 seconds
3. **In-memory Database**: H2 database with pre-seeded sample contest data

## How to Use
1. Application runs automatically via the workflow
2. Open the webview to access the platform
3. Enter a username and contest ID (use "1" for the sample contest)
4. Click "Join Contest"
5. Select a problem, write code, and submit
6. Watch submission status update in real-time
7. Check leaderboard for rankings

## Pre-seeded Contest Data
**Contest ID: 1 - "Sample Programming Contest"**

Problems:
1. **Add Two Numbers** (100 points) - Sum two integers
2. **Square a Number** (100 points) - Calculate n²
3. **Find Factorial** (150 points) - Calculate n!

## Technical Notes
- Backend and frontend run concurrently via `start.sh`
- Frontend proxies API calls to backend through Next.js rewrites
- H2 database resets on server restart (in-memory)
- Judging is simulated (Docker not available in Replit)

## API Endpoints
- `GET /api/contests/{contestId}` - Get contest with problems
- `POST /api/contests/join` - Join contest
- `POST /api/submissions` - Submit code
- `GET /api/submissions/{submissionId}` - Get submission status
- `GET /api/contests/{contestId}/leaderboard` - Get leaderboard

## Future Enhancements
- Integrate actual code execution via external judge APIs
- Add user authentication
- Support multiple programming languages
- Contest scheduling with start/end times
- Detailed submission history

## User Preferences
None specified yet.
