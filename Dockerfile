FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies required for build and runtime
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Default command
CMD ["npm", "run", "build"]