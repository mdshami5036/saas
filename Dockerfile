FROM node:18-alpine

WORKDIR /app

COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma/

RUN cd backend && npm install
RUN cd backend && npx prisma generate --schema=prisma/schema.prisma

COPY backend ./backend/

EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["sh", "-c", "cd backend && npx prisma db push --schema=prisma/schema.prisma && node src/index.js"]
