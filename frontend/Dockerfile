# Use Node.js 18 as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY . .

# Build the frontend
RUN npm run build

# Install serve to serve the built app
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the frontend server
CMD ["serve", "-s", "build"]
