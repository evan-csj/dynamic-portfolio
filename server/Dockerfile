FROM node:19-alpine

COPY package.json /app/
COPY controllers /app/controllers/
COPY middlewares /app/middlewares/
COPY routes /app/routes/
COPY seed_data /app/seed_data/
COPY seeds /app/seeds/
COPY .env /app/
COPY index.js /app/
COPY knexfile.js /app/
COPY passport-setup.js /app/

WORKDIR /app

RUN npm install

CMD ["node", "index.js"]