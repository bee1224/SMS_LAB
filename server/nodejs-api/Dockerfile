FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# 修改程式碼中的 localhost 為 rabbitmq (Docker 內部的服務名稱)
CMD ["node", "nodejs_api_example.js"]