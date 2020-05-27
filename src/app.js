const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0};

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body;

  const index = repositories.findIndex( (repository) => repository.id === id )

  if ( index < 0 ) {
    return response.status(400).json({ error: 'Repository is not found.' })
  }
  
  if ( title || url || techs ) {
    repositories[index].title = title ? title : repositories[index].title;
    repositories[index].url   = url   ? url   : repositories[index].url;
    repositories[index].techs = techs ? techs : repositories[index].techs;
  }

  return response.json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  
  const index = repositories.findIndex( (repository) => repository.id === id )

  if ( index < 0 ) {
    return response.status(400).json({ error: 'Repository is not found.' })
  }

  repositories.splice(index, 1);

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  
  const index = repositories.findIndex( (repository) => repository.id === id )

  if ( index < 0 ) {
    return response.status(400).json({ error: 'Repository is not found.' })
  }
  
  repositories[index].likes += 1;

  return response.json(repositories[index]);
});

module.exports = app;
