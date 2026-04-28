#!/bin/sh

echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=backend/prisma/schema.prisma

if [ "$NODE_ENV" = "development" ]; then
  echo "Running seed (dev only)..."
  npx prisma db seed --schema=backend/prisma/schema.prisma
fi

echo "Starting server..."
node backend/src/server.js
