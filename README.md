# Online Music Store

## Online Music Store created using Node.js &amp; Express, where users can listen to &amp; purchase the latest music by trending artists.

1. Create a folder called lms to store the backend files & folders.

---

2. Initialize the directory by typing the following command

   `npm init -y`

---

3. Install the modules express, mongoose (MongoDB schema), nodemon (run uninterrupted) & multer (file upload) by typing the following command

   `npm install express mongoose nodemon multer body-parser`

---

4. Create a file app.js. This will be the maon file which will contain all the middlewares responsible for the application flow. Declare all the middlewares using require(), and then use them by using use().The connection is initiated using express which will add a listener on the port specified (3000).

---

5. Start the server by typing the following command and open link in browser

   `npm start`

---

### Configure MongoDB database & Mongoose

---

6. Define the database configurations in the mongodb.config.js file of the configurations folder. This will include the URL (which is saved in the .env file added to .gitignore for security reasons). Also included are the names of the databases & the collections.

---

7. Define the MongoDB objects in the user.model.js and music.model.js files of the models folder. These objects will structure the data sent to and received from the database.

---

8. Create the CRUD functions to be invoked by the application to the MongoDB database in the user.repository.js & music.repository.js of the repositories folder.

---

9. Create the configuration file for file upload in the multer.js file of the configurations folder. The storage variable must not be included as the files will not be stored in the application folder.

---

    const multer = require("multer");
    exports.upload = multer({ });

---

10. Create the controllers (which will pass data from frontend to repository) inside the user.controller.js & music.controller.js files in the controllers folder. The image file will be converted to a base64 string as soon as it is uploaded and sent to the database.

---

11. Create the routes (which will redirect API links to the respective controllers) in the user.routes.js & music.routes.js files of the routes folder.

---

12. Create the dynamic views (which will be rendered in the controllers) in the home.pug, navbar.pug, dashboard.pug, user_new.pug, user_edit.pug, user_delete.pug, music_new.pug, music_update.pug, music_delete.pug in the views folder.

---

13. Add CORS (Cross Origin Resource Sharing), which permits the connectivity between the database and website. Adding CORS reduces the chance of 503 errors.

---
