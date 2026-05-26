# Imagen ligera para el bridge HTTP
FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --omit=dev --no-audit --no-fund

COPY src ./src

EXPOSE 4000

CMD ["node", "src/index.mjs"]
