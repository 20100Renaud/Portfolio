# Share Up
## LOADING COMMANDS
### Frontend
~/portfolio/frontend$
```
npm install
npm run dev    # http://localhost:5173
```

### Backend
~/portfolio$
- Run what is existing:
```
docker compose up    # http://localhost:5000
```

- After code / Dockerfile change (production):
```
docker compose down --remove-orphans
docker compose up --build
# Rebuild if necessary, then run
```
- Development (with seed):
```
docker compose -f docker compose.dev.yml up --build
```
- Recreate the image from zero:
```
docker compose build --no-cache
docker compose up
```
 *up : start container

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
npx prisma migrate reset
docker compose exec backend npx prisma migrate reset  <= in the docker
```

### 3. Generate a migration in the docker
```
 docker compose exec backend npx prisma migrate dev --name init
```

### 4. Generate Client
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

### 6. Check the DataBase
```
npx prisma studio
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
    T_Clients {
        int Id_Client PK
        string Login_Client
        string Email_Client
        string Password_Client
        string PC_Client FK
        datetime Date_Client
    }

    T_Posts {
        int Id_Post PK
        int Id_Client_Post FK
        string Title_Post
        text Description_Post
        datetime Date_Post
    }

    T_Comments {
        int Id_Com PK
        int Id_Post FK
        int Id_Client_Com FK
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

    T_Clients ||--o{ T_Posts : Whrite
    T_Clients ||--o{ T_Comments : Whrite
    T_Posts ||--o{ T_Comments : Contains
    T_PostalCodes ||--o{ T_Clients : Has
```
