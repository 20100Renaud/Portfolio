# Share Up
## LOADING COMMANDS
### Frontend
~/portfolio/frontend$
```
npm run dev
```

### Backend
~/portfolio$
- Run what is existing:
```
docker compose up
```

- After code / Dockerfile change (production):
```
docker compose down --remove-orphans
docker compose up --build
# Rebuild if necessary, then run
```
- Development:
```
docker compose -f docker-compose.dev.yml up --build
```
- When things feel broken / inconsistent:
```
docker compose build --no-cache    # Recreate the image from zero
docker compose up
```
 *up : start container

## SETUP docker
`/portfolio/$`
```
sudo apt update
sudo apt install docker-compose-plugin
```
```
docker --version
docker compose version
```
Add user to the docker group
```
sudo usermod -aG docker $USER
```
### To restard Docker
```
sudo systemctl restart docker
```
### Config
```
~/Desktop/portfolio$ cat /etc/resolv.conf
nameserver 1.1.1.1
nameserver 8.8.8.8
```
```
~/Desktop/portfolio$ cat /etc/docker/daemon.json
{
	"ipv6": flase,
	"dns": ["1.1.1.1", "8.8.8.8"]
}
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

## PRISMA COMMANDS to restard from schema.prisma

### 1. Delete old migrations
```
rm -rf prisma/migrations
```

### 2. Reset the DataBase
```
npx prisma migrate reset
```

### 3. Generate a migration
```
npx prisma migrate dev --name init
```

### 4. Check DataBase is migrated
```
npx prisma migrate deploy
npx prisma migrate dev
```

### 5. Generate Client
```
npx prisma generate
```

### 6. Generate Admin and uknown user
- localy:
```
npx prisma db seed
```
- in the container:
```
docker compose exec backend npx prisma db seed
```

### 7. Check the DataBase
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
