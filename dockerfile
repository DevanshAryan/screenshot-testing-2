FROM node:20-buster

WORKDIR /app

COPY ./package.json .

RUN yarn install

RUN npx playwright install

RUN npx playwright install-deps

COPY . .

RUN yarn build

CMD yarn start