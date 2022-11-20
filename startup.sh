#!/bin/bash
service mysql start
sleep 10
mysql -e "CREATE DATABASE taskcircledb; USE taskcircledb;"
mysql taskcircledb < /usr/src/schema.sql
mysqladmin -u root password 'root'
java -jar /usr/src/taskcircle-1.0.0.jar