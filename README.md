
# Backend App for Allumni Management application(Web)

This README describes how our backend application interacts with frontend application(Allumni Management app) including API endpoints. It also supports CRUD (Create, Read, Update, Delete) operations.

**Deployed on:** [render.com](https://render.com)

Check Api status @ 👉 
[https://igit-mca-backend.onrender.com](https://igit-mca-backend.onrender.com/)

## Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)


## Introduction

This backend application provides an API for performing CRUD operations on a set of things, such as users, batch & branch. The API allows clients to Create, Read, Update, and Delete records related to the specified resource.

## Technologies Used
[![My Skills](https://skillicons.dev/icons?i=nodejs,expressjs,mongodb,firebase)](https://skillicons.dev)
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework for Node.js
- **MongoDB**: A NoSQL database used for data storage
- **Mongoose**: MongoDB object modeling for Node.js
- **firebase**: Uploading image files.
- **RESTful API**: For implementing CRUD operations


## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/satyadalei/igit-mca-backend.git
   cd igit-mca-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up the environment variables:
   Create a `.env` file in the root of the project and define the following variables:
   ```plaintext
   MONGO_DB_URL=
   JWT_SECRET_CODE=

   DEFAULT_ADMIN_EMAIL=
   DEFAULT_ADMIN_PASSWORD=

   FIREBASE_AUTHDOMAIN=
   FIREBASE_PROJECTID=
   FIREBASE_STORAGEBUCKET=
   FIREBASE_MESSAGINGSENDERID=
   FIREBASE_APPID=
   FIREBASE_MEASUREMENTID=
   FIREBASE_APIKEY=

   FIREBASE_ADMIN_ACC_TYPE = 
   FIREBASE_ADMIN_PROJ_ID =
   FIREBASE_ADMIN_PRVT_KEY_ID = 
   FIREBASE_ADMIN_PRVT_KEY = 
   FIREBASE_ADMIN_CLIENT_EMAIL = 
   FIREBASE_ADMIN_CLIENT_ID =
   FIREBASE_ADMIN_AUTH_URI =
   FIREBASE_ADMIN_TOKEN_URI =
   FIREBASE_ADMIN_AUTH_PROVIDER = 
   FIREBASE_ADMIN_CLIENT_CERT_URL = 
   FIREBASE_ADMIN_UNIVERSE_DOMAIN = 
   ```

4. Start the server:
   ```bash
   node server.js (Or nodemon server.js)
   ```

## Project Structure

The project structure follows a typical Express.js application structure:

```plaintext
project-root/
  |-- database/
      |-- createDefaultAdminUser.js  #Creating default admin 
      |-- database.js                #Connecting to database 
  |-- firebase/
      |-- firebaseAdminSdk.js         #To catch signedin token
      |-- firebaseConfig.js           #To upload image to firebase
  |-- middlewares/
      |-- authorizeuser.js            # verifies user auth status
  |-- models/
      |-- batchModel.js   #Batch schema
      |-- branchModel.js  #Branch schema
      |-- userModel.js    #user schema
  |-- routes/
      |-- batchRoute.js    # handles batch CRUD
      |-- branchModel.js   
      |-- userModel.js     # handles user's CRUD
  |-- .env                 # Environment variable configuration
  |-- .gitignore           # ignores the file
  |-- package-lock.json
  |-- package.json
  |-- README.md                     # Project documentation
  |-- server.js                     # Server initialization and entry point
```

## API Endpoints

The API supports the following CRUD operations for the specified resource:

**#User APIS** `/api/user/[action]`
- **Create a new user:**
  - **Endpoint:** `/api/user/createUser`
  - **HTTP Method:** POST
  - **Request Body:** JSON object containing resource data

- **Login user (Via Google):**
  - **Endpoint:** `/api/user/loginViaGoogle`
  - **HTTP Method:** POST
  - **Request Body:** uid token provided by google
- **Login user (Manual login):**
  - **Endpoint:** `/api/user/loginManually`
  - **HTTP Method:** POST
  - **Request Body:** JSON object containing `email` & `password`

**#Batch APIS** `/api/batch/[action]`  
- **Create a batch:**
  - **Endpoint:** `/api/batch/createNewBatch`
  - **HTTP Method:** POST
  - **Request HEADERS:** JWT token added as token : "token value"   
  - **Note:** user has to be `admin` to create a new batch

- **Fetch all existing batch:(User auth required)**
  - **Purpose:** _Showing existing batches in batch page_
  - **Endpoint:** `/api/batch/fetchAllBatch`
  - **HTTP Method:** GET
  - **Request HEADERS:** `JWT token` added as `token : "token value"`

- **Fetch all batch lists:(User auth not required)**
  - **Purpose:** _Selecting batch for registration_
  - **Endpoint:** `/api/batch/fetchAllBatch`
  - **HTTP Method:** GET

- **Fetch students of batch:(User auth required)**
  - **Purpose:** _Showing students of particular batch_
  - **Endpoint:** `/api/batch/:batchId/fetchStudents`
  - **HTTP Method:** GET
  - **Request HEADERS:** `JWT added` as token : "token value"

**#Coordinator APIS:(User auth not required)** `/api/coordinators/[id_of_batch]`
  - **Purpose:** Fetches the coordinators of final year students
  - **Endpoint:** `/api/coordinators/:batchId`
  - **HTTP Method:** GET

