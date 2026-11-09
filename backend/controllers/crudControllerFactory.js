'use strict';

const db = require('../models');

function parseInteger(value) {
  if (typeof value !== 'string' || !/^[1-9]\d*$/.test(value)) {
    return null;
  }

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

function getWritableFields(model) {
  return Object.entries(model.rawAttributes)
    .filter(([name, attribute]) => (
      !attribute.primaryKey &&
      name !== 'createdAt' &&
      name !== 'updatedAt' &&
      (!attribute.type || attribute.type.key !== 'VIRTUAL')
    ))
    .map(([name]) => name);
}

function pickWritableFields(body, writableFields) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return null;
  }

  return Object.fromEntries(
    writableFields
      .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
      .map((field) => [field, body[field]])
  );
}

function createCrudController(modelName) {
  const model = db[modelName];
  if (!model) {
    throw new Error(`Unknown Sequelize model: ${modelName}`);
  }

  const writableFields = getWritableFields(model);

  return {
    async getAll(req, res, next) {
      try {
        const page = req.query.page === undefined ? 1 : parseInteger(req.query.page);
        const limit = req.query.limit === undefined ? 50 : parseInteger(req.query.limit);

        if (page === null || limit === null || limit > 100) {
          return res.status(400).json({
            message: 'page debe ser un entero positivo y limit debe estar entre 1 y 100.'
          });
        }

        const offset = (page - 1) * limit;
        if (!Number.isSafeInteger(offset)) {
          return res.status(400).json({ message: 'El número de página es demasiado grande.' });
        }

        const [total, data] = await Promise.all([
          model.count(),
          model.findAll({ limit, offset, order: [['id', 'ASC']] })
        ]);

        return res.status(200).json({
          data,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        });
      } catch (error) {
        return next(error);
      }
    },

    async getById(req, res, next) {
      try {
        const id = parseInteger(req.params.id);
        if (id === null) {
          return res.status(400).json({ message: 'El id debe ser un entero positivo.' });
        }

        const record = await model.findByPk(id);
        if (!record) {
          return res.status(404).json({ message: 'Registro no encontrado.' });
        }

        return res.status(200).json(record);
      } catch (error) {
        return next(error);
      }
    },

    async create(req, res, next) {
      try {
        const values = pickWritableFields(req.body, writableFields);
        if (values === null) {
          return res.status(400).json({ message: 'El cuerpo de la solicitud debe ser un objeto JSON.' });
        }

        const record = await model.create(values);
        return res.status(201).json(record);
      } catch (error) {
        return next(error);
      }
    },

    async update(req, res, next) {
      try {
        const id = parseInteger(req.params.id);
        if (id === null) {
          return res.status(400).json({ message: 'El id debe ser un entero positivo.' });
        }

        const values = pickWritableFields(req.body, writableFields);
        if (values === null) {
          return res.status(400).json({ message: 'El cuerpo de la solicitud debe ser un objeto JSON.' });
        }
        if (Object.keys(values).length === 0) {
          return res.status(400).json({ message: 'Debe proporcionar al menos un campo válido para actualizar.' });
        }

        const record = await model.findByPk(id);
        if (!record) {
          return res.status(404).json({ message: 'Registro no encontrado.' });
        }

        await record.update(values);
        return res.status(200).json(record);
      } catch (error) {
        return next(error);
      }
    },

    async delete(req, res, next) {
      try {
        const id = parseInteger(req.params.id);
        if (id === null) {
          return res.status(400).json({ message: 'El id debe ser un entero positivo.' });
        }

        const record = await model.findByPk(id);
        if (!record) {
          return res.status(404).json({ message: 'Registro no encontrado.' });
        }

        await record.destroy();
        return res.status(204).end();
      } catch (error) {
        return next(error);
      }
    }
  };
}

module.exports = createCrudController;
