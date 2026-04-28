FROM node:22

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install

COPY backend/. .

RUN npx prisma generate

EXPOSE 5000
CMD ["sh", "docker-entrypoint.sh"]
