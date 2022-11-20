FROM openjdk:11-slim
WORKDIR /usr/src/backend
COPY . .

RUN chmod +x mvnw
RUN ./mvnw install
CMD ["./mvnw","spring-boot:run"]
