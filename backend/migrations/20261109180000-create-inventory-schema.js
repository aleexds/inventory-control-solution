'use strict';

module.exports = {
  async up() {
    // Kept as a no-op because this migration was already applied in existing environments.
  },

  async down() {
    // The per-entity migrations now own schema creation and rollback.
  }
};
