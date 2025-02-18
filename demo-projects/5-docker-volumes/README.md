# Demo Project - Docker Volumes

## Topics of the Demo Project
- Persist Data with Docker Volumes

## Technologies Used
- Docker
- Node.js
- MongoDB

## Project Description
This project demonstrates how to persist data in a MongoDB container by attaching a Docker volume to it. By using Docker volumes, we ensure that data is preserved across container restarts, which is important for maintaining state in a production environment.

## Steps to Attach a Docker Volume to the MongoDB Container

### Step 1: Start the Containers Using Docker-Compose

Create a `docker-compose.yaml` file that includes a volume definition for the MongoDB container. The volume ensures that data is persisted even if the MongoDB container is restarted. Here's an example of how the `docker-compose.yaml` file is structured:

```yaml
version: '3.8'

services:
  user-profile:
    image: node:14
    container_name: user-profile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    networks:
      - mongo-net

  mongodb:
    image: mongo
    container_name: mongodb
    networks:
      - mongo-net
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    volumes:
      - mongo-data:/data/db  # Mount a named volume to the container's data directory

  mongo-express:
    image: mongo-express
    container_name: mongo-express
    networks:
      - mongo-net
    ports:
      - "8081:8081"
    environment:
      ME_CONFIG_MONGODB_SERVER: mongodb
      ME_CONFIG_MONGODB_PORT: 27017

networks:
  mongo-net:

volumes:
  mongo-data:  # Define a named volume
