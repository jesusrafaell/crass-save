FROM node:20.12.2 as build

WORKDIR /app
COPY package.json ./
COPY .env ./
COPY . ./
#RUN yarn scripts
RUN yarn
RUN yarn build

# production environment
FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
RUN chmod -R 755  /usr/share/nginx/html
EXPOSE 3030
CMD ["nginx", "-g", "daemon off;"]
