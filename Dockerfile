FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/
COPY shared/ ./shared/

RUN npm ci

COPY client/ ./client/
COPY server/ ./server/

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
COPY server/package*.json ./server/
COPY shared/ ./shared/

RUN npm ci --workspace=server --omit=dev

COPY --from=builder /app/client/dist ./client/dist
COPY --from=builder /app/server/src ./server/src

EXPOSE 3000

CMD ["npm", "run", "start"]
