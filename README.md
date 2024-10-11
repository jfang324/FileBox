## About The Project

A full stack web application that lets you manage and share files on your home network. Ideally this applications should be run on a Raspberry Pi or similar device but it can also be run on your PC. Here is a useful guide to expose localhost to the network: https://www.youtube.com/watch?v=uRYHX4EwYYA.

## Getting Started

### Prerequisites

To use this application, you will need accounts for the following services:

-   MongoDB Atlas (can also be hosted locally)
-   Amazon S3
-   Auth0

## Installation

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
```

5. Start the application:

```
npm run build
npm run start
```

6. Open your browser and navigate to `http://localhost:3000` to access the application.

## Gallery & Demonstrations

<img src=''> </img>
_Initial login page_

<img src=''> </img>
_Auth0 login page_

<img src=''> </img>
_Homepage_

<img src='' width="auto" height="500"> </img>

_Mobile homepage_

<img src=''> </img>
_File upload pop-up_

<img src=''> </img>
_Options_

<img src=''> </img>
_File sharing_

<img src='' width="auto" height="500"> </img>

_Mobile sharing_

<img src=''> </img>
_Account settings pop-up_

## Contact

Jeffery Fang - [jefferyfang324@gmail.com](mailto:jefferyfang324@gmail.com)

## Tools & Techonologies

-   Next.js
-   React
-   Tailwind CSS
-   Auth0
-   MongoDB Atlas
-   Amazon S3
-   shadcn/ui
