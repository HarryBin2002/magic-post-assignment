#!/bin/bash

# Start server in the background
cd magic-post-server
mvn spring-boot:run &

# Wait for the server to initialize
echo "Starting server, please wait..."
sleep 10  # Sleeps for 10 seconds, adjust this time as needed

# Start client
cd ../magic-post-client
echo "Starting client..."
npm install
npm start
