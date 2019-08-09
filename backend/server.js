var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var cors = require("cors");
var mongoose = require("mongoose");
var todoRoutes = express.Router();

var PORT = 4000;

var Todo = require("./todo.model");

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/todos", {
  useNewUrlParser: true
});
var connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database conenction established sucessfully");
});

todoRoutes.route("/").get(function(req, res) {
  Todo.find(function(err, todos) {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

todoRoutes.route("/:id").get(function(req, res) {
  var id = req.params.id;
  Todo.findById(id, function(err, todo) {
    res.json(todo);
  });
});

todoRoutes.route("/add").post(function(req, res) {
  var todo = new Todo(req.body);
  todo
    .save()
    .then(todo, function() {
      res.status(200).json({ todo: "Todo added sucessfully" });
    })
    .catch(e => {
      res.status(400).send("adding new todo failed");
    });
});

todoRoutes.route("/update/:id").post(function(req, res) {
  Todo.findById(req.params.id, function(err, todo) {
    if (!todo) res.status(404).send("data is not found");
    else todo.todo_description = req.body.todo_description;
    todo.todo_responsible = req.body.todo_responsible;
    todo.todo_priority = req.body.todo_priority;
    todo.todo_completed = req.body.todo_completed;

    todo
      .save()
      .then(todo, function() {
        res.json("Todo updated");
      })
      .catch(err, function() {
        res.status(400).send("Update not possible");
      });
  });
});

app.use("/todos", todoRoutes);

app.listen(PORT, function() {
  console.log(`Server has start on Port: ${PORT}`);
});
