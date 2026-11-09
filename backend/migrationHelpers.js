'use strict';

async function createTableIfMissing(queryInterface, tableName, columns) {
  if (await queryInterface.tableExists(tableName)) {
    return false;
  }

  await queryInterface.createTable(tableName, columns);
  return true;
}

async function dropTableIfPresent(queryInterface, tableName) {
  if (await queryInterface.tableExists(tableName)) {
    await queryInterface.dropTable(tableName);
  }
}

module.exports = { createTableIfMissing, dropTableIfPresent };
