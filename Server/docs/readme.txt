Prerequisites to run the CooKit server:
- JBoss 7
- a local MySQL server running on port 3306 + a database named 'cookit': CREATE DATABASE cookit;
- a MySQL user named cookit with basic permissions to the 'cookit' database: GRANT INSERT, SELECT, DELETE, UPDATE, CREATE, ALTER, DROP ON cookit.* TO 'cookit'@'localhost' IDENTIFIED BY 'cookitsecret';