# Stage 1: Build the application
FROM node:alpine AS build

# Set the working directory inside the container
WORKDIR /usr/app

# Copy the package.json and package-lock.json into the container
COPY package.json package-lock.json ./

# Install dependencies (including TypeScript and SWC)
RUN npm ci
RUN npm install


# Copy the source code into the container
COPY . .

# Build the application
RUN npm run build

# Stage 2: Create the final production image
FROM node:alpine

# Set the working directory inside the container
WORKDIR /usr/app

# Copy the node_modules and built files from the build stage
COPY --from=build /usr/app/node_modules ./node_modules
COPY --from=build /usr/app/dist ./dist
COPY --from=build /usr/app/dist ./dist

# Expose the port the application runs on
EXPOSE 3334

# Command to start the application
CMD ["npm", "run", "dev"]
