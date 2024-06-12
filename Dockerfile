# stage 1
FROM node:alpine as node

WORKDIR /app

COPY . .
# COPY ./package.json ./package-lock.json ./
# ADD src ./src

RUN npm install
RUN npm run prod

# stage 2
FROM nginx:alpine

COPY --from=node /app/dist/ui /usr/share/nginx/html
COPY ./proxy.conf /etc/nginx/conf.d/default.conf
