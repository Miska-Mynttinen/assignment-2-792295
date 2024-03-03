#!/bin/bash

# Set up mongoDB first because others depend on it
docker-compose -f docker-compose.yml up -d mongo

sleep 1

# Setup and start all containers defined in docker-compose.yml
echo "Setting up other containers."

docker-compose -f docker-compose.yml up -d

# List all containers
docker-compose -f docker-compose.yml ps

echo "Setup complete."