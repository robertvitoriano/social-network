# Step 1: Build the application
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY  package*.json ./
COPY  ormconfig.js ./
COPY .env.local ./.env.local
COPY  .swcrc ./
RUN npm install --force

# Copy all source files
COPY . .

# Build the project using SWC
RUN npm run build

# Step 2: Create minimal runtime image
FROM node:20-alpine

WORKDIR /app

# Copy only the necessary files from the builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.local ./.env.local
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/ormconfig.js ./
COPY --from=builder /app/.swcrc ./
RUN npm install --force

# Expose application port
EXPOSE 3333

# Start the application
CMD ["node", "dist/src/shared/infra/http/server.js"]
