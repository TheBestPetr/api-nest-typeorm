FROM node:20.11.1

USER node

WORKDIR /app/node/api-nest-typeorm

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

EXPOSE 9876

CMD ["npm", "run", "start:dev"]