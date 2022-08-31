FROM openjdk:11-slim
COPY . /usr/src/myapp
WORKDIR /usr/src/myapp
RUN chmod +x mvnw
RUN ./mvnw install
RUN ./mvnw package
ENTRYPOINT ["java","-jar","target/taskcircle-1.0.0.jar"]
