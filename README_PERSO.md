# Share Up

## LOADING COMMANDS

- Terminal 1: `~/portfolio/`

    1. npm run dev
    2. npm run rebuild
    3. npm run clean

        - *1,2 and 3 auto-open the browser when frontend is ready.*
        - *Can fail sometimes with WSL*

    4. npm run stop

- Terminal 2: `~/portfolio/backend/$`

    5. npm run studio

### 1. Usual development (restart from the last time)

`~/portfolio/`

```
npm run dev

# docker compose -f docker-compose.dev.yml up -d
```

- Starts containers (frontend, backend, postgres)
- Reuses existing Docker layers (fast startup)
- Keeps existing database state
- Keeps Prisma data intact

### 2. Rebuild containers (no cache, full refresh)

`~/portfolio/`

```
npm run rebuild

# docker compose -f docker-compose.dev.yml up --build -d
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

# docker compose -f docker-compose.dev.yml down -v && npm run rebuild
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

### 4. Stop the containers at the end of the day (restard with dev)
*Usually `Ctr + C` is enough but with -d, the logs are not visible*

`~/portfolio/`

```
npm run stop

# docker compose -f docker-compose.dev.yml down
```

- Stop containers
- Remove containers
- Remove default network

### 5. Check the DataBase inside the docker (use another terminal)

`~/portfolio/backend/$`

```
npm run studio

// The first time run:
npm install --save-dev dotenv-cli
```

### Development Ports

| Port | Service                 |
| ---- | ----------------------- |
| 5000 | Backend API (Express)   |
| 5173 | Frontend (Vite + React) |
| 5433 | PostgreSQL Database     |
| 5555 | Prisma Studio           |

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

### 1. Stop Docker and delete the database

`~/portfolio/$`

```
docker compose -f docker-compose.dev.yml down -v
```

### 2. Delete existing migrations

`~/portfolio/backend/$`

```
rm -rf prisma/migrations
```

### 3. Start PostgreSQL ans backend containers

(Need a database running to generate migrations)

`~/portfolio/$`

```
docker compose -f docker-compose.dev.yml up postgres backend -d
```

Wait the time to process.

### 4. Create a fresh migration inside the docker

`~/portfolio/backend`

```
docker compose exec backend npx prisma migrate dev --name init
```

### 5. Rebuild containers

`~/portfolio`

```
npm run clean
```

### Generate User

```
npx prisma generate
```

### Generate Admin and uknown user

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

## SETUP TURF

`~/portfolio/frontend/$`

```
npm install @turf/turf
```

## TREE STRUCTURE (without node-modules)

```
tree -I node_modules
```

## MERMAID

```
---
config:
  theme: forest
  look: handDrawn
  fontFamily: '''Inter Variable'', sans-serif'

---
erDiagram
	direction LR
	T_Users {
		string ID_User PK
		string Role_User
		string Login_User
		string Email_User
		string Password_User
		datetime Date_User
		string City_User
		float Latitude_User
  		float Longitude_User
	}

	T_Depos {
		string ID_Depo PK
		string ID_User FK
		string Type_Depo
		string Cat_Depo
		string Title_Depo
		text Text_Depo
		datetime Date_Depo
		satetime Lifetime_Depo
	}

	T_Answers {
		string ID_Answer PK
		string ID_Depo FK
		string ID_User FK
		text Text_Answer
		datetime Date_Answer
	}

	T_Images {
		string ID_Image PK
		string ID_Depo FK
		string URL_Image
		string Text_Image
		dateTime Date_Image
	}

	T_Users||--o{T_Depos:"Owns"
	T_Users||--o{T_Answers:"Write"
	T_Depos||--o{T_Answers:"Contains"
	T_Depos||--o{T_Images:"Contains"
```
