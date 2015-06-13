################# CookIt Readme ##################

Authors: Katrin Feyrer, Michael Jörgler
Version: 1.0
Date: 11.06.2015
Domain: cookit.ddns.net
GitHub: https://github.com/kfeyrer/Cookit.git

##################################################

################### Description ##################

Cookit is an application where you can share and view recipes posted by users. 
This readme file contains basic information about the project and deliveres detailed information on how to install a server and/or the app.
As an alternative to deploying the webservice and app yourselfe the public server cookit.ddns.net:65431 can be used and the .apk file from the GitHub project.

##################################################

########### Installation of Webservice ###########

Prerequisites:
	+ MySql Server
	+ NodeJs
	+ Port 65431 not busy

Steps:
	+ Clone the GitHub project to a directory on your local machine (assuming ~/cookit)
	+ Connect to the database and create a new empty database
	+ Import the small example recipe.sql file into the created database or create an empty recipe table like used in the .sql file
	+ Change following settings corresponding to your local configuration in the ~/cookit/server.js file:
		# user
		# password
		# database
	+ Start the NodeJs server with loging in the background (e.g. node ~/cookit/server.js > /var/log/node_Server.log 2>&1 &)
		# If server is not running correctly check log for errors like module/plugin not found. Install them using npm
		# e.g. sudo npm install express
		# e.g. sudo npm install debug
	+ Test the server by entering your IP address where you started the server and use the configured port (or our domain cookit.ddns.net:65431). You should get some recipes in JSON format.
	
##################################################

###### Installation of Application (Android) #####

These steps install the App on your Android device.

Prerequisites:
	+ Cordova
	+ Android SDK (used was API Level 22)
	+ ADB connection to Android Device

	+ If you want to run it locally, you need to change to basisUrl in the PerstistenceService Class to "http://localhost:8001" and
	+ in the RecipeCOntroller you need to change the url for the Websockte to "ws://localhost:8001" too.
Steps:
	+ cordova run android

##################################################