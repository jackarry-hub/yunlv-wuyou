FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5173
ENV YUNLV_RUNTIME_DIR=/app/.runtime

COPY package.json ./
COPY apps ./apps
COPY data ./data
COPY docs ./docs
COPY public ./public
COPY scripts ./scripts
COPY server ./server
COPY server.js ./server.js
COPY 云旅无忧UI界面参考图 ./云旅无忧UI界面参考图
COPY 云旅无忧—AI智慧旅居平台项目需求说明书.pdf ./云旅无忧—AI智慧旅居平台项目需求说明书.pdf

RUN node --check server.js

EXPOSE 5173

CMD ["node", "server.js"]
