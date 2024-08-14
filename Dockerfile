# Stage 1: Install dependencies
FROM node:alpine AS build

WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm install

# Stage 2: Copy only the necessary files and run the application
FROM node:alpine

WORKDIR /usr/app

COPY --from=build /usr/app .

EXPOSE 3334

CMD ["npm", "run", "dev"]
