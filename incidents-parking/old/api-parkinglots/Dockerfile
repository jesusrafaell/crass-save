FROM node:18.17.1-alpine

WORKDIR /app

COPY . .

RUN corepack enable
RUN yarn install

ENV NODE_ENV=production
RUN yarn build

CMD ["node", "dist/app.js"]