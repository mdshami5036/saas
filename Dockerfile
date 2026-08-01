FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY start.sh ./
COPY backend ./backend

RUN chmod +x start.sh
RUN cd backend && npm install && npx prisma generate

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["./start.sh"]
