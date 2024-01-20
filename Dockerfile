FROM node:20-alpine3.18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV production
ENV PORT 8080

EXPOSE ${PORT}

CMD ["npm", "start"]