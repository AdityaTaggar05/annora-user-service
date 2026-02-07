FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for ts-node/nodemon)
RUN npm ci

# Copy source code (will be overridden by docker-compose volumes in dev)
COPY . .

# Expose port
EXPOSE 3000

# Default command - can be overridden by docker-compose
CMD ["npm", "run", "dev"]