#For Render-Deployment
FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy everything
COPY . .

# Give permission to maven wrapper
RUN chmod +x mvnw

# Build the app
RUN ./mvnw clean package -DskipTests

# Run the app
CMD ["java", "-jar", "target/*.jar"]