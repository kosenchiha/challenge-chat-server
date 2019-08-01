const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.json());

const messages = [
  {
    id: 1,
    from: "vicky",
    text: "hi",
    timeSent: "8/1/2019, 10:53:59 AM"
  },
  {
    id: 2,
    from: "paul ",
    text: "hi vicky",
    timeSent: "8/1/2019, 10:54:23 AM"
  },

  {
    id: 3,
    from: "vicky",
    text: "how are u?",
    timeSent: "8/1/2019, 10:54:39 AM"
  },

  {
    id: 4,
    from: "paul",
    text: "good, thanks. What about u?",
    timeSent: "8/1/2019, 10:55:06 AM"
  },
  {
    id: 5,
    from: "vicky",
    text: "thanks, i'm fine.",
    timeSent: "8/1/2019, 10:55:23 AM"
  }
];

app.post("/messages", (req, res) => {
  const message = {
    id: messages.length + 1,
    from: req.body.from,
    text: req.body.text,
    timeSent: new Date().toLocaleString()
  };
  // 400 bad request
  if (!req.body.from || req.body.from.length < 3) {
    res
      .status(400)
      .send({ error: "Name is required and should be minimum 3 characters" });
  } else if (!req.body.text) {
    return res.status(400).send({ error: "Please, write a message" });
  } else {
    messages.push(message);
    res.send(message);
  }
});

app.get("/messages", (req, res) => {
  res.send(messages.reverse());
});

app.get("/messages/search", (req, res) => {
  var searchKeys = Object.keys(req.query);
  var filteredMessages = messages.slice();

  searchKeys.forEach(keyName => {
    if (req.query[keyName].length > 0) {
      filteredMessages = filteredMessages.filter(mes =>
        mes[keyName].toLowerCase().includes(req.query[keyName].toLowerCase())
      );
    }
  });
  res.send(filteredMessages);
});

app.get("/messages/latest", (req, res) => {
  const topTenMessages = messages.slice(0, 10).reverse();
  res.send(topTenMessages);
});

app.get("/messages/:id", (req, res) => {
  const message = messages.find(mes => mes.id === parseInt(req.params.id));
  if (!message) {
    return res
      .status(404)
      .send("Sorry! Message with the given ID was not found");
  } else {
    res.send(message);
  }
});

app.put("/messages/:id", (req, res) => {
  const message = messages.find(mes => mes.id === parseInt(req.params.id));
  if (!message) {
    return res
      .status(404)
      .send("Sorry! Message with the given ID was not found");
  } else if (!req.body.from || req.body.from.length < 3) {
    res.status(400).send("Name is required and should be minimum 3 characters");
  } else if (!req.body.text) {
    return res.status(400).send("Please, write a message");
  } else {
    message.from = req.body.from;
    message.text = req.body.text;
    res.send(message);
  }
});

app.delete("/messages/:id", (req, res) => {
  const message = messages.find(mes => mes.id === parseInt(req.params.id));
  if (!message) {
    return res
      .status(404)
      .send("Sorry! Message with the given ID was not found");
  } else {
    const index = messages.indexOf(message);
    messages.splice(index, 1);
    res.send(message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listen on port ${port}...`);
});
