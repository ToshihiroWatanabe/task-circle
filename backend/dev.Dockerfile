FROM openjdk:11-slim
COPY ../frontend /usr/src/frontend
COPY ../backend /usr/src/backend
WORKDIR /usr/src/backend

RUN chmod +x mvnw
RUN ./mvnw install
# RUN ./mvnw package
ENTRYPOINT ["java","-jar","target/taskcircle-1.0.0.jar"]

# docker build . -t task-circle_backend -f backend/dev.Dockerfile
# docker run -p 8080:8080 -v $PWD:/usr/src task-circle_backend