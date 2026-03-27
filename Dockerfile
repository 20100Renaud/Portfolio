FROM node:20
WORKDIR /app
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install
WORKDIR /app
COPY backend ./backend
COPY frontend ./frontend
COPY prisma ./prisma
EXPOSE 5000
CMD ["node", "backend/src/server.js"]
