# Web Programming HW#1

## Run Backend
### 1. Clone .env.example
In `/backend` directory, use .env.example to create an .env file
set PORT and MONGO_URI(with your mongodb connection string)
### 2. Set Yarn
```bash
cd backend
yarn
```
### 3. Yarn dev
```bash
yarn dev
```

If successful, you should see the following message in the terminal:
```bash
Server is running on port http://localhost:8000
``` 
Next time you can just have to run `yarn start` to start the server. Step 1-4 are only needed for the first time.
```bash
cd backend
yarn start
```

## Run frontend
### 1. Clone .env.example
In `/frontend` directory, use .env.example to create an .env file
set PORT(it should be the same as in backend/.env)
### 2. Set Yarn, Yarn dev
same as in backend.
