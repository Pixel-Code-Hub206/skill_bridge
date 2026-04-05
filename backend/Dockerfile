FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean package -DskipTests && mv target/*.jar app.jar

CMD ["java", "-jar", "app.jar"]