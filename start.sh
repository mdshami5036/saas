#!/bin/bash
cd backend
npm install
npx prisma generate
npx prisma db push --schema=prisma/schema.prisma
npm start
