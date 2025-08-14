FROM node:18-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./
COPY vue/package*.json ./vue/

RUN npm ci --only=production
RUN cd vue && npm ci

COPY . .

RUN cd vue && npm run build

EXPOSE ${PORT:-7700}

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-7700}/manifest.json || exit 1

CMD ["npm", "start"]
