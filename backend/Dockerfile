# backend/Dockerfile
FROM openjdk:17-slim

# Install Maven
RUN apt-get update && apt-get install -y maven git

WORKDIR /app

# Copy project files
COPY pom.xml .
COPY src ./src

# Build Spring Boot JAR inside container
RUN mvn clean package -DskipTests

# Run Spring Boot app with the CORRECT jar name
CMD ["java", "-jar", "target/contest-platform-1.0.0.jar"]