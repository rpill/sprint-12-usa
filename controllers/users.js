const User = require('../models/user');

const {
  CAST_ERROR_ERROR_CODE,
  VALIDATION_ERROR_CODE,
  NOT_FOUND_ERROR_CODE,
  INTERNAL_SERVER_ERROR_CODE,
} = require('../utils/errors');

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'An error has occurred on the server' }));
};

// GET /users/:id
const getUser = (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .orFail(() => {
      const error = new Error('User ID not found');
      error.statusCode = NOT_FOUND_ERROR_CODE;
      throw error;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      // 400 — invalid data passed to the methods for creating a card/user or
      // updating a user's profile or avatar
      if (err.name === 'CastError') {
        res.status(CAST_ERROR_ERROR_CODE).send({ message: 'Invalid user ID' });
        // 404 — there is no user or card with the requested id or
        // the request is sent to a non-existent address
      } else if (err.statusCode === NOT_FOUND_ERROR_CODE) {
        res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
        // 500 — default error. Accompanied by the message: "An error has occurred on the server";
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'An error has occurred on the server' });
      }
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      // 400 — invalid data passed to the methods for creating a card/user or
      // updating a user's profile or avatar
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `${Object.values(err.errors).map((error) => error.message).join(', ')}` });
        // 500 — default error. Accompanied by the message: "An error has occurred on the server";
      } else {
        res.status(INTERNAL_SERVER_ERROR_CODE).send({ message: 'An error has occurred on the server' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
};
