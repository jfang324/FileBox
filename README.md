## About The Project

A full stack web application that lets you manage and share files on your home network. Ideally this applications should be run on a Raspberry Pi or similar device but it can also be run on your PC. Here is a useful guide to expose localhost to the network: https://www.youtube.com/watch?v=uRYHX4EwYYA

## Getting Started

### Prerequisites

To use this application, you will need accounts for the following services:

-   MongoDB Atlas (can also be hosted locally)
-   Amazon S3
-   Auth0

### Installation

To install the application locally, run the following commands:

1. Clone the repository:

```
git clone https://github.com/jfang324/FileBox.git
```

2. Navigate to the project directory:

```
cd filebox
```

3. Install the dependencies:

```
npm install
```

4. Create a `.env` file in the project directory and add the following environment variables:

```
//use values provided to you after creating an app in auth0
AUTH0_SECRET = 'use [openssl rand -hex 32] to generate a 32 bytes value'
AUTH0_BASE_URL = 'http://localhost:3000'
AUTH0_ISSUER_BASE_URL = <issuer url provided after creating an account in auth0>
AUTH0_CLIENT_ID = 'TJva7LgAH4ggEzhjyBqozQGrl3npKLiz'
AUTH0_CLIENT_SECRET = 'nW7WhW-UzwjRQzJZtICUu96EdQpBQlWdzK1rMIV2YxVauUqE77McVOdz6WwHxByO'

//use values provided after creating a bucket in s3
BUCKET_NAME = <bucket name>
BUCKET_REGION = <bucket region>
ACCESS_KEY = <bucket access key>
SECRET_ACCESS_KEY = <bucket secret access key>

//use values provided after creating a database in mongodb atlas
DB_USERNAME = <database username>
DB_PASSWORD = <database password>
DATABASE_URL = <url provided after creating and choosing to programatiically connect>

//use your virustotal api key
VIRUS_TOTAL_API_KEY = <virustotal api key>
VIRUS_TOTAL_UPLOAD_URL = 'https://www.virustotal.com/api/v3/files'
VIRUS_TOTAL_REPORT_URL = 'https://www.virustotal.com/api/v3/analyses'
```

5. Start the application:

```
npm run build
npm run start
```

6. Open your browser and navigate to `http://localhost:3000` to access the application.

## Gallery & Demonstrations

<img src='https://github.com/user-attachments/assets/0ba50c36-be75-42ea-a7a3-54fadac7f441'> </img>
_Initial login page_

<img src='https://github.com/user-attachments/assets/2d70fc87-1707-46bd-9e1c-3d47fa4a41bb'> </img>
_Auth0 login page_

<img src='https://github.com/user-attachments/assets/abf118b4-534d-43c8-b27e-1160cbcbc0ec'> </img>
_Homepage_

<img src='https://github.com/user-attachments/assets/8963b292-25bd-46e1-85ec-c93960dcdc5b' width="auto" height="500"> </img>

_Mobile homepage_

<img src='https://github.com/user-attachments/assets/ae1d54ea-bed9-435b-8e0f-22a4827f1eba'> </img>
_File upload pop-up_

<img src='https://github.com/user-attachments/assets/da3bec42-b5ca-4676-9b9e-3a279f8bc598'> </img>
_Options_

<img src='https://github.com/user-attachments/assets/f6e7d5fe-76f3-4935-8195-88b48ae5de53'> </img>
_File sharing_

<img src='https://github.com/user-attachments/assets/eb18c6f7-4b2b-41d6-bba4-35e54865024c' width="auto" height="500"> </img>

_Mobile sharing_

<img src='https://github.com/user-attachments/assets/2441d32a-2fa8-4571-97f2-e2cd6bb2b9df'> </img>
_Account settings pop-up_

## Known Issues

-   For some file types, the file will be downloaded with no extension
-   The virus scan works when run locally but not on the Vercel deployment due to execution duration limits

## Contact

Jeffery Fang - [jefferyfang324@gmail.com](mailto:jefferyfang324@gmail.com)

## Tools & Technologies

-   Next.js
-   React
-   Tailwind CSS
-   Auth0
-   MongoDB Atlas
-   Amazon S3
-   shadcn/ui
