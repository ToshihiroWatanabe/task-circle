# frontendのビルドを行います。
FROM node:14 AS frontend-build

ARG REACT_APP_CLIENT_ID
ENV REACT_APP_CLIENT_ID=$REACT_APP_CLIENT_ID

WORKDIR /home/node
COPY ./frontend .
COPY --chown=node:node ./frontend/package.json .
RUN npm i -g npm@7
RUN npm install
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
COPY --chown=node:node . .
USER node
RUN npm run build

# backendのビルドを行います。
FROM openjdk:11-slim AS backend-build
WORKDIR /usr/src/backend
COPY ./backend .
COPY --from=frontend-build /home/node/build ../frontend/build

RUN chmod +x mvnw
RUN ./mvnw install
RUN ./mvnw package

# backendとMySQLを起動します。

FROM ubuntu:20.04

ENV MYSQL_ROOT_HOST %
ENV MYSQL_ROOT_PASSWORD root
ENV MYSQL_DATABASE taskcircledb
ENV MYSQL_PASSWORD root
ENV MYSQL_USERNAME root
ENV MYSQL_URL=jdbc:mysql://localhost:3306/taskcircledb

EXPOSE 8080

COPY --from=backend-build /usr/src/backend/target /usr/src
COPY ./my.cnf /usr/src
COPY ./backend/src/main/resources/schema.sql /usr/src

RUN apt-get update
RUN apt-get install -y openjdk-11-jre-headless
RUN apt-get install -y mysql-server

RUN rm -rf /var/lib/mysql/*
ADD ./my.cnf /etc/mysql/my.cnf
RUN mysqld --initialize-insecure --user=mysql
RUN chown -R mysql:mysql /var/lib/mysql

ADD ./startup.sh /startup.sh
RUN chmod 755 /startup.sh
CMD /startup.sh

# docker build . -t task-circle
# docker run -p 8080:8080 task-circle