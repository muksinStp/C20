import express from "express";
import UserController from "./controllers/UserController.js";
import path from "path";

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join("public")));


app.get("/", UserController.browse);
app.listen(4000, () => {
    console.log(`Server running on port 4000`);
});    