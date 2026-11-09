'use strict';

const express = require('express');

function createCrudRouter(controller) {
  const router = express.Router();

  router.route('/')
    .get(controller.getAll)
    .post(controller.create);

  router.route('/:id')
    .get(controller.getById)
    .put(controller.update)
    .patch(controller.update)
    .delete(controller.delete);

  return router;
}

module.exports = createCrudRouter;
