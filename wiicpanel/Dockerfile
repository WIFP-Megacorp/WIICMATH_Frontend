# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Vue.js project for production
RUN npm run build

# Expose the port that the Vue.js app will run on (usually 8080)
EXPOSE 8080

# Specify the command to start your Vue.js app
CMD [ "npm", "run", "serve" ]
