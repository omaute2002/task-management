# Use the official Node.js image as the base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's code
COPY . .

# Build the Next.js app
RUN npm run build


# Install only production dependencies
RUN npm ci --only=production

# Use a lightweight web server to serve your app
FROM node:18-alpine AS runner

# Copy built files from builder
COPY --from=builder /app ./

# Expose the port your app runs on
EXPOSE 3000

# Run the app
CMD ["npm", "run", "start"]