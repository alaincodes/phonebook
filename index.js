require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const Person = require("./models/person");

app.use(bodyParser.json());

app.use(cors());

const requestLogger = (req, res, next) => {
  console.log("Method:", req.method);
  console.log("Path:  ", req.path);
  console.log("Body:  ", req.body);
  console.log("---");
  next();
};

app.use(requestLogger);

app.use(express.static("build"));

morgan.token("body", function(req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person.toJSON());
      } else {
        res.status(204).end();
      }
    })
    .catch(error => {
      next(error);
    });
});

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  const person = {
    name: body.name,
    number: body.number
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON());
    })
    .catch(error => next(error));
});

app.delete("/api/persons/:id", (req, res) => {
  Person.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end("204 No Content");
    })
    .catch(error => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
      res.json(savedAndFormattedPerson);
    })
    .catch(error => next(error));
});

app.get("/info", (req, res) => {
  Person.find({}).then(person => {
    res.send(
      `Phonebook has info for ${person.length} people <br> ${new Date()}`
    );
  });
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError" && error.kind === "ObjectId") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidatorError") {
    return res.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
