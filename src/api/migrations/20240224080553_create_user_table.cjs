/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("id").primary();
      table.integer("discord_id").notNullable();
      table.string("tag").notNullable();
    })

    .createTable("riot_accounts", (table) => {
      table.increments("id").primary();
      table.integer("user_id").notNullable();
      table.string("riot_id").notNullable();
      table.string("region").notNullable();
      table.string("rank").notNullable();
      table.boolean("active").notNullable();
    })

    .createTable("steam_accounts", (table) => {
      table.increments("id").primary();
      table.integer("user_id").notNullable();
      table.string("account_name").notNullable();
      table.integer("friend_code").notNullable();
      table.string("steam_profile_url").notNullable();
      table.boolean("active").notNullable();
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {};
