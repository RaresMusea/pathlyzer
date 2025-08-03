FROM node:20.12.2-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

CMD ["sh", "./start.sh"]