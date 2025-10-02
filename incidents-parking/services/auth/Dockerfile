FROM node:18.17.1-alpine

RUN apk add --no-cache python3 make g++ && ln -sf python3 /usr/bin/python

WORKDIR /app

COPY . .

RUN corepack enable
RUN yarn install

ENV NODE_ENV=production
RUN yarn build

# CMD ["node", "dist/app.js"]
# CMD ["node", "dist/grpc.js"]
