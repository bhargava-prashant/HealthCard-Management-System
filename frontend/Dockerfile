# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend source code into the container
COPY . .           # <-- destination is current WORKDIR (/app)

# Build the frontend
RUN npm run build

# Serve the build using a lightweight server (e.g., serve)
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the frontend server
CMD ["serve", "-s", "dist"]   # <-- vite default build output is /dist
