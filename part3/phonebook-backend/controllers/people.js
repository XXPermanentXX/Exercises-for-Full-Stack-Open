const peopleRouter = require("express").Router();
const Person = require("../models/person");
const logger = require("../utils/logger");

peopleRouter.get("/info", (req, res) => {
  Person.find({}).then((persons) => {
    res.send(
      `<p>Phonebook has info for ${persons.length} people<br/>${new Date()}</p>`,
    );
  });
});

peopleRouter.get("/", (req, res) => {
  Person.find({}).then((persons) => {
    logger.info("phonebook:");
    res.json(persons);
    persons.forEach((person) => {
      logger.info(`${person.name} ${person.number}`);
    });
  });
});

peopleRouter.get("/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

peopleRouter.put("/:id", (req, res, next) => {
  const body = req.body;
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatePerson) => {
      if (updatePerson) {
        res.json(updatePerson);
      } else {
        res.status(404).end();
      }
    })
    .catch((error) => next(error));
});

peopleRouter.delete("/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((person) => {
      if (person) {
        res.status(204).end(); // No Content
      } else {
        res.status(404).send({ error: "Person not found" }); // Not Found
      }
    })
    .catch((error) => next(error));
});

peopleRouter.post("/", (req, res, next) => {
  const body = req.body;
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((error) => next(error));
});

module.exports = peopleRouter;
