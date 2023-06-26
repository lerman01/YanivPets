FROM node:lts-alpine3.18
WORKDIR /user/app
EXPOSE 3000

COPY package*.json ./
COPY . .

RUN npm install
RUN npm run build
CMD ["node", "dist/index.js"]