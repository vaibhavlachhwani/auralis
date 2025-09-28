# Stage 1: Build the application and extract layers
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

# Copy Maven wrapper and pom.xml to download dependencies
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

# Copy source code and build the layered JAR
COPY src ./src
RUN ./mvnw package -DskipTests

# Extract the layers from the JAR
WORKDIR /app/target
RUN java -Djarmode=layertools -jar packet-collector-service-0.0.1-SNAPSHOT.jar extract

# Stage 2: Create the final image from the extracted layers
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy the layers from the build stage in the correct order
# Dependencies are copied first as they change least often
COPY --from=build /app/target/dependencies/ .
COPY --from=build /app/target/spring-boot-loader/ .
COPY --from=build /app/target/snapshot-dependencies/ .
COPY --from=build /app/target/application/ .

EXPOSE 8080

# The entrypoint is now the JarLauncher, which knows how to run the layered application
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]