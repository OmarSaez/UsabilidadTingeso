FROM openjdk:17
ARG JAR_FILE=target/prestabank-backend.jar
COPY ${JAR_FILE} prestabank-backend.jar
ENTRYPOINT ["java", "-jar", "/prestabank-backend.jar"]