FROM node:iron-trixie-slim
WORKDIR /app
COPY package.json ./
COPY . .
RUN npm install
CMD ["npm", "run", "dev"]
