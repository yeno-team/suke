FROM node:16-alpine3.11 as build

ARG BUILD_CONTEXT

WORKDIR /app
COPY package.json .
COPY yarn.lock .
COPY ./packages/$BUILD_CONTEXT/package.json packages/$BUILD_CONTEXT/
RUN yarn install
COPY ./packages/$BUILD_CONTEXT packages/$BUILD_CONTEXT
RUN yarn build

#webserver
FROM nginx:1.23.1-alpine
ARG BUILD_CONTEXT
COPY --from=build /app/packages/$BUILD_CONTEXT/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]