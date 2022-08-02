# # <<<<<<< Updated upstream
# FROM node:18-alpine3.15 AS builder

# # Set working directory
# WORKDIR /app

# # Copy our node module specification
# COPY package.json package.json

# # update the npm file
# RUN npm install --location=global npm@latest

# # install node modules and build assets
# RUN npm install --force
# # --legacy-peer-deps

# # Copy all files from current directory to working dir in image
# # Except the one defined in '.dockerignore'
# COPY . .

# # Create production build of React App
# RUN npm run build

# # Choose NGINX as our base Docker image
# FROM nginx:alpine

# # Set working directory to nginx asset directory
# WORKDIR /usr/share/nginx/html

# # Remove default nginx static assets
# RUN rm -rf *

# # copies custom nginx to docker image to bypass 404 errors
# COPY nginx.conf /etc/nginx/nginx.conf

# # Copy static assets from builder stage
# COPY --from=builder /app/build .

# # Entry point when Docker container has started
# ENTRYPOINT ["nginx", "-g", "daemon off;"]

# =======
#stage 1
FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install --force
RUN npm run build --prod

#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/atlas-eos /usr/share/nginx/html

#start the server
# # ENTRYPOINT ["index.html"]
ENTRYPOINT ["nginx", "-g", "daemon off;"]
# >>>>>>> Stashed changes
