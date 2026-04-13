FROM node:18-alpine
WORKDIR /app
COPY package*.json ./

# 加上這行：切換 npm 源，可以極大提高在台灣下載的速度
RUN npm config set registry https://registry.npmmirror.com

RUN npm install
COPY . .
EXPOSE 3001
CMD ["node", "export_service.js"]