FROM node:22
WORKDIR /app

COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma
WORKDIR /app/backend
RUN npm install
RUN npx prisma generate

WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend


EXPOSE 5000
CMD ["node", "backend/src/server.js"]
