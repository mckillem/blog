const express = require("express");
const path = require("path");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/posts');
let db = mongoose.connection;

db.once("open", () => {
    console.log("Connected to MongoDB");
})

db.on("error", (err) => {
    console.log(err);
});

const app = express();

let Post = require("../models/post");

app.set("./views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
    Post.find({}, (err, posts) => {
        if(err) {
            console.log(err);
        } else {
            res.render("index", {
                posts: posts
            });
        }
        
    });
});

app.get("/posts/add", (req, res) => {
    res.render("add_post", {
    });
});

app.post("/posts/add", (req, res) => {
    let post = new Post();
    post.text = req.body.text;

    post.save((err) => {
        if(err) {
            console.log(err);
            return;
        } else {
            res.redirect("/");
        }
    });
});

app.get("/posts/edit/:id", (req,res) => {
    Post.findById(req.params.id, (err, post) => {
        res.render("edit_post", {
            post: post
        });
    });
});

// app.post("/posts/edit/:id", (req, res) => {
//     let post = {};
//     post.text = req.body.text;

//     let query = {_id:req.params.id};

//     Post.update(query, post, (err) => {
//         if(err) {
//             console.log(err);
//             return;
//         } else {
//             res.redirect("/");
//         }
//     });
// });

app.put('/', (req, res) => {
  res.send('PUT request to homepage');
});

app.delete("/posts/:id", (req, res) => {
    let query = {_id:req.params.id};

    Post.remove(query, (err) => {
        if(err) {
            console.log(err);
        }
        res.send("Success");
    });
});

app.listen(3000, () => {
    console.log("Server on port 3000 is running...");
});