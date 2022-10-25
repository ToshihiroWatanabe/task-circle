FROM openjdk:11-slim
COPY . /usr/src
WORKDIR /usr/src/backend

RUN chmod +x mvnw
RUN ./mvnw install

EXPOSE 8080
ENTRYPOINT ["java","-jar","target/taskcircle-1.0.0.jar"]

# docker build . -t task-circle
# docker run -p 8080:8080 -v $PWD:/usr/src task-circle