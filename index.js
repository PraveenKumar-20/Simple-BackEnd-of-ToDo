const exp = require("constants");
const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

app.get("/todos", function (req, res) {
  fs.readFile("user.json", "utf-8", function (err, data) {
    const contents = JSON.parse(data);
    const ToDos = [];

    for (let i = 0; i < contents.length; i++) {
      ToDos.push(contents[i].todo.description);
    }
    res.json({ ToDos });
  });
});

app.get("/todos/:id", function (req, res) {
  const id = +req.params.id;

  fs.readFile("user.json", "utf-8", function (err, data) {
    const contents = JSON.parse(data);
    let todo = [];

    for (let i = 0; i < contents.length; i++) {
      const todoId = contents[i].id;
      if (id == todoId) {
        todo.push(contents[i].todo.description);
        break;
      }
    }
    res.status(200).json({ todo });
  });
});

app.post("/todos", function (req, res) {
  fs.readFile("user.json", "utf-8", function (err, data) {
    const count = JSON.parse(data).length;
    const existingData = JSON.parse(data);
    const input = req.body;
    const updatedInput = { id: Math.floor(Math.random() * 100), ...input };
    existingData.push(updatedInput);
    const finalData = JSON.stringify(existingData, null, 2);
    fs.writeFile("user.json", finalData, (err) => {
      if (err) {
        console.log("Error in writing to file");
      }
      res.json({ msg: "Added the todo" });
    });
  });
});

app.put("/todos/:id", function (req, res) {
  const id = +req.params.id;
  fs.readFile("user.json", "utf-8", function (err, data) {
    if (err) {
      console.log("Error in reading the file");
    } else {
      const contents = JSON.parse(data);
      const updatedTodo = req.body;
      const todoToUpdate = contents.find((item) => item.id == id);
      todoToUpdate.todo.description = updatedTodo.description;
      const newData = JSON.stringify(contents, null, 2);

      fs.writeFile("user.json", newData, function (err, data) {
        if (err) {
          console.log("Error in writing to file");
        } else {
          res.json({ msg: "Updated the todo" });
        }
      });
    }
  });
});

app.delete("/todos/:id", function (req, res) {
  const id = req.params.id;

  fs.readFile("user.json", "utf-8", function (err, data) {
    const contents = JSON.parse(data);
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].id == id) {
        contents.splice(i, 1);
        break;
      }
    }
    const updatedData = JSON.stringify(contents, null, 2);
    fs.writeFile("user.json", updatedData, function (err, data) {
      if (err) {
        console.log("Error in writing to file");
      } else {
        res.json({ msg: "Deleted the todo" });
      }
    });
  });
});

app.listen(4000);
