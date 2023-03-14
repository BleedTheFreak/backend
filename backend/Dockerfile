FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

RUN chmod +x backend.sh

CMD [ "./backend.sh"]