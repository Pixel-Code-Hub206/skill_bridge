#For Render-Deployment
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy everything
COPY . .

# Give permission to maven wrapper
RUN chmod +x mvnw

# Build the app
RUN ./mvnw clean package -DskipTests

# Run the app
CMD ["java", "-jar", "target/*.jar"]