FROM node:18.17.1-alpine

WORKDIR /app

RUN npm install pm2 -g

COPY . .

RUN corepack enable
RUN yarn install

ENV NODE_ENV=production
RUN yarn build

CMD ["pm2-runtime", "start", "pm2.config.js"]
