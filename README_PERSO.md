# Share Up

## LOADING COMMANDS
### 1. Usual dev
`~/portfolio/`

```
npm run dev

// docker compose -f docker-compose.dev.yml up --build
```

#### Steps:

- Start containers
- Rebuild images if needed
- Reuse existing:
  - PostgreSQL container (if already created)
  - Postgres volume (portfolio_postgres_data)
- Keep database state

### 2. On prisma or seed changes = reset everything
`~/portfolio/`

```
npm run clean

// docker compose -f docker-compose.dev.yml down -v && npm run dev
```

#### Steps:

- Stop everything
- ***Delete containers and volume so data***
- Recreate everything from scratch
- Re-run:
  - Prisma migrations
  - Seed script

### 3. Check the DataBase inside the docker (use another terminal)
`~/portfolio/backend/$`
```
npm run studio

// The first time run:
npm install --save-dev dotenv-cli
```

### 4. Development Ports

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

## MERMAID

```
erDiagram
direction LR
    T_Users {
        int Id_User PK
        string Login_User
        string Email_User
        string Password_User
        string PC_User FK
        datetime Date_User
    }

    T_Posts {
        int Id_Post PK
        int Id_User_Post FK
        string Title_Post
        text Description_Post
        datetime Date_Post
    }

    T_Comments {
        int Id_Com PK
        int Id_Post FK
        int Id_User_Com FK
        text Description_Com
        datetime Date_Com
    }

    T_PostalCodes  {
        int Id_PC PK
        string PC
        string City_PC
        string Insee_PC
        int latitude_PC
        int longitude_PC
    }

    T_Users ||--o{ T_Posts : Whrite
    T_Users ||--o{ T_Comments : Whrite
    T_Posts ||--o{ T_Comments : Contains
    T_PostalCodes ||--o{ T_Users : Has
```
