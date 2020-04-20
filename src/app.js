const express = require('express');
const cors = require('cors');

//UUID - Universal Unique ID
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repository ID' });
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get('/repositories', (request, response) => {
  return response.json(repositories);
});

app.post('/repositories', (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put('/repositories/:id', (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const findRepository = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findRepository === -1) {
    return response.status(400).json({ error: 'Repository does not exist' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[findRepository].likes,
  };

  repositories[findRepository] = repository;
  return response.json(repository);
});

app.delete('/repositories/:id', (request, response) => {
  const { id } = request.params;

  const findRepository = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (findRepository >= 0) {
    repositories.splice(findRepository, 1);
  } else {
    return response.status(400).json({ error: 'Repository does not exists' });
  }

  return response.status(204).send();
});

app.post('/repositories/:id/like', (request, response) => {
  const { id } = request.params;

  const findRepository = repositories.find(
    (repository) => repository.id === id
  );

  if (!findRepository) {
    return response.status(400).json({ error: 'Repository does not exists' });
  }

  findRepository.likes += 1;

  return response.json(findRepository);
});

module.exports = app;
