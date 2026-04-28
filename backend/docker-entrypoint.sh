#!/bin/sh

cd /app/backend

echo "Checking Prisma schema..."

if [ ! -f "prisma/schema.prisma" ]; then
  echo "ERROR: schema.prisma not found"
  exit 1
fi

echo "Running Prisma migrations..."
./node_modules/.bin/prisma migrate deploy --schema=prisma/schema.prisma

if [ "$NODE_ENV" = "development" ]; then
  echo "Running seed..."
  node prisma/seed.js
fi

echo "Starting server..."
node src/server.js
