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
NEXT_PUBLIC_VIRUS_TOTAL_API_KEY = <virustotal api key>
NEXT_PUBLIC_VIRUS_TOTAL_UPLOAD_URL = 'https://www.virustotal.com/api/v3/files'
NEXT_PUBLIC_VIRUS_TOTAL_REPORT_URL = 'https://www.virustotal.com/api/v3/analyses'
```

5. Start the application:

```
npm run build
npm run start
```

6. Open your browser and navigate to `http://localhost:3000` to access the application.

## Gallery & Demonstrations

<img src='https://github.com/user-attachments/assets/6f3d6e8d-96d8-448c-a520-0f09ea1b410b'> </img>
_Initial login page_

<img src='https://github.com/user-attachments/assets/a515762b-5f15-45ca-b5b4-14e5ebb8c36a'> </img>
_Auth0 login page_

<img src='https://github.com/user-attachments/assets/f49aa223-43d6-4f17-958b-82b8663d1b6e'> </img>
_Homepage_

<img src='https://github.com/user-attachments/assets/db7b9d3a-0ea8-4032-8ecd-14599bb5a16d' width="auto" height="500"> </img>

_Mobile homepage_

<img src='https://github.com/user-attachments/assets/9b2a7c14-8f55-4a72-b975-d4b7e7bcba70'> </img>
_File upload pop-up_

<img src='https://github.com/user-attachments/assets/cac079f9-dd39-4cbf-be91-d62d7172f035'> </img>
_Options_

<img src='https://github.com/user-attachments/assets/a40d2a65-3065-47ff-a856-3cd346091317'> </img>
_File sharing_

<img src='https://github.com/user-attachments/assets/a30c87c0-59eb-46ee-9c7a-d29933d73b41' width="auto" height="500"> </img>

_Mobile sharing_

<img src='https://github.com/user-attachments/assets/989c0dbc-358b-4154-ae4e-a51b8e4b48ae'> </img>
_Account settings pop-up_

## Known Issues

-   For some file types, the file will be downloaded with no extension

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
