FROM node:22
WORKDIR /app

COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

COPY backend/. .

RUN npx prisma generate

WORKDIR /app
COPY frontend ./frontend

EXPOSE 5000
CMD ["sh", "backend/docker-entrypoint.sh"]
