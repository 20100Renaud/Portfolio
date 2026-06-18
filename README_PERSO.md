# Share Up

## LOADING COMMANDS
### 1. Usual development start
`~/portfolio/`

```
npm run dev

# docker compose -f docker-compose.dev.yml up --build
```

#### What it does:
- Starts all containers (frontend, backend, postgres)
- Builds images only if needed
- Reuses existing Docker layers (fast startup)
- Keeps existing database state
- Keeps Prisma data intact

### 2. Rebuild containers (no cache, full refresh)

`~/portfolio/`
```
npm run rebuild


# docker compose -f docker-compose.dev.yml up --build --force-recreate
```

#### When to use:
- Docker is not picking up code changes
- Strange runtime errors after updates
- After dependency changes (package.json changes)
#### What it does:
- Recreates containers even if they already exist
- Rebuilds images from scratch (ignores cached container state)
- Keeps PostgreSQL data volume intact
- Keeps database data

### 3. Full reset (Prisma / seed / DB changes)

`~/portfolio/`
```
npm run clean

# docker compose -f docker-compose.dev.yml down -v && npm run dev
```

#### When to use:
- Prisma schema changed
- Seeder logic changed
- Want a completely fresh database
- DB state is corrupted or outdated

#### What it does:
- Stops all containers
- Deletes containers + all volumes
- Removes PostgreSQL data completely
- Recreates database from scratch
- Runs:
  - Prisma migrations
  - Seed script (automatic on backend start)

### 4. Check the DataBase inside the docker (use another terminal)
`~/portfolio/backend/$`
```
npm run studio

// The first time run:
npm install --save-dev dotenv-cli
```

### 5. Development Ports

| Port | Service |
|------|---------|
| 5000 | Backend API (Express) |
| 5173 | Frontend (Vite + React) |
| 5433 | PostgreSQL Database |
| 5555 | Prisma Studio |

## SETUP docker

`~/portfolio/$`

```
sudo apt update
sudo apt  install docker.io -y
```

```
which docker         # /usr/bin/docker
docker --version     # version 29.1.3-0ubuntu3~24.04.1

```

```
sudo apt-get install docker-compose-plugin
docker compose version              # Docker Compose version v5.1.3
```

Add user to the docker group

```
sudo usermod -aG docker $USER
```

verify Docker is working

```
docker ps
```

### To restard Docker

```
sudo systemctl restart docker
```

## RUN container:

```
docker exec -it portfolio-backend-1 sh
```

run the migration inside the container

```
# npx prisma migrate deploy --schema=prisma/schema.prisma
```

### Pull from library/postgres

```
docker pull postgres
```

## SETUP PRISMA

```
npm install prisma@6 @prisma/client@6   # 7 works differently
```

## PRISMA COMMANDS to restard from schema.prisma

### 1. Delete old migrations and migrate

```
rm -rf prisma/migrations
prisma migrate dev
```

### 2. Reset the DataBase

```
npx prisma migrate reset //outside the docker
docker compose exec backend npx prisma migrate reset  //inside the docker
```

### 3. Generate a migration in the docker

```
 docker compose exec backend npx prisma migrate dev --name init
```

### 4. Generate User

```
npx prisma generate
```

### 5. Generate Admin and uknown user

- localy:

```
npx prisma db seed
```

- in the container:

```
docker compose exec backend npx prisma db seed
```

### 6. Check the DataBase localy
`~/portfolio/backend/$`
```
npx prisma studio //port:5555
```

## PRISMA COMMANDS to restard from DataBase

### Adjust schema.prisma to match current DataBase

```
npx prisma db pull
```
