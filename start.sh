#!/bin/bash

cd backend
java -jar target/contest-platform-1.0.0.jar &
BACKEND_PID=$!

cd ../frontend
npm run dev &
FRONTEND_PID=$!

wait $BACKEND_PID $FRONTEND_PID
