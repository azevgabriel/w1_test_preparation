FROM node:22

ENV ENV_FILE="--env-file=.env.production"
ENV PRISMA_PATH="./node_modules/.bin/prisma"

WORKDIR /app

RUN apt-get update 

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN node ${ENV_FILE} ${PRISMA_PATH} generate

EXPOSE 8080

CMD node ${ENV_FILE} ${PRISMA_PATH} migrate deploy
CMD npm run build && node ${ENV_FILE} dist/main/server.js