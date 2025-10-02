

# Dashboard ParkingLot

Dashboard Parking Lot 


## Run Locally

Install dependencies (preferably use yarn)

```bash
npm install
    or
yarn 
```

Start the development server

```bash
npm run dev
    or
yarn dev
```

## Docker for production
To deploy using docker, in the `Dockerfile` and `package.json` is setted default port `3005` , is recommended docker-compose approach:

```bash
docker-compose up -d --build
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file. There is also a file called .env.example where you can copy the variables for your .env file.

`NEXT_PUBLIC_URL_API=https://api-dev.crashsaverapp.com`




## Stack

**Tech:** NextJS, Tailwind, TypeScript. 

# Powered by **CrashSaver**


