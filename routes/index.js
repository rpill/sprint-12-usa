const router = require('express').Router();

const userRouter = require('./users');
const clothingItemRouter = require('./clothingItems');
const { NOT_FOUND_ERROR_CODE } = require('../utils/errors');

router.use('/users', userRouter);
router.use('/items', clothingItemRouter);

// 404 — there is no user with the requested id or the request is sent to a non-existent address
router.use((req, res) => {
  res.status(NOT_FOUND_ERROR_CODE).send({ message: 'Requested resource not found' });
});

module.exports = router;
