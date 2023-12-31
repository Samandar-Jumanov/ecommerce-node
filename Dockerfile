FROM node:latest
WORKDIR /usr/app
COPY  package*.json  ./
RUN npm install 
COPY  . .
EXPOSE 3001
EXPOSE 3002
CMD npm start