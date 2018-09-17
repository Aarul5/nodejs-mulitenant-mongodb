Dynamic database connection to mongoose from nodejs

This example describes a multi-tenant structure with each user having its own database. There might be a better way of doing this,but this was my solution.

There will be a user creation when the user creation is done in "AuthDB", then i create the New DataBase under UserName.
There will be school model (schema), so user can create or update school info.
I Will get the DB Name from the header(token) and find the database to create or update School info.
I also check that if the user info is already stored in global, there is no need to query the database again. 


** Project installation details ** <br/>
    Step 1 : npm install <br/>
    Step 2 : node server.js

** API Details **

1) To Create Admin user [Seperate DB]
```
    Method : POST
    URL : http://localhost:8085/api/createUser
    POST Data: {
        "UserName": "Test1",
        "Password": "1234"
    }

    Response : {
        "_id": "5b9f37e1132b1e172886cde5",
        "UserName": "Test1",
        "Password": "sha256$ad2ee88619dcaa82$1000$751cebd73e593b4adcf4c49ef148433c08afbff86fd16eaef6f6568f3eae3e4e",
        "DataBaseName": "Test1",
        "Role": "Admin",
        "__v": 0
    }
```

2) Login Admin User
```
    Method : POST
    URL : http://localhost:8085/api/create/school
    POST Data : {
        "UserName": "Test1",
        "Password": "1234"
    }


    Response : {
        "user": "Test1",
        "roles": "Admin",
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyTmFtZSI6IkRCMSIsIkNOYW1lIjoiREIxIiwiUGVybWlzc2lvbiI6WyJ1cGRhdGUiLCJnZXQgYWxsIHNjaG9vbCByZWNvcmQiLCJkZWxldGUiXSwiaWF0IjoxNTM3MTYwNzY2LCJpc3MiOiJLZW8gcGx1cyBMTVMifQ.YH6GNH4plWnPSBj2r7RdWzk_4cJFzkxJVvZZacD6vnk",
        "iss": "Keo plus LMS",
        "iat": "2018-09-17T05:06:06.186Z"
    }
```

3) To Create School - under Admin user DB
```
    Method : POST
    URL : http://localhost:8085/api/create/school
    Header : Authorization : Bearer token
    POST Data : {
        "SchoolName": "IG",
        "SchoolId": "10251",
        "DeanName": "Ravi"
    }

    Response : {
        "_id": "5b9f3751132b1e172886cde4",
        "SchoolName": "IG",
        "SchoolId": "10251",
        "DeanName": "Ravi",
        "__v": 0
    }
```

4) Get All schools in collection Admin Db [check routing : Permission] 
```
    Method : GET
    URL : http://localhost:8085/api/getAllSchool
    Header : Authorization : Bearer token

    Response : [
        {
            "_id": "5b965dc9fc9aac18cce310c6",
            "SchoolName": "School1",
            "SchoolId": "12121",
            "DeanName": "Arul",
            "__v": 0
        }
    ]
```
