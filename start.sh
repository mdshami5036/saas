#!/bin/sh
cd backend
npm install
npx prisma generate
npx prisma db push --schema=prisma/schema.prisma
node src/index.js
