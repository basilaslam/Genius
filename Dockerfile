# Use a Node.js image as the base
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install
RUN npx prisma generate


# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npx prisma generate

RUN npm run build

# Expose the desired port (if needed)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
