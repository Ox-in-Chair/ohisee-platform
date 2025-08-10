"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('users', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.uuid('tenant_id').references('id').inTable('tenants').onDelete('CASCADE');
        table.string('email').notNullable();
        table.string('password_hash').notNullable();
        table.string('first_name');
        table.string('last_name');
        table.enum('role', ['admin', 'manager', 'compliance', 'user']).defaultTo('user');
        table.boolean('is_active').defaultTo(true);
        table.timestamp('last_login');
        table.string('reset_token');
        table.timestamp('reset_token_expires');
        table.timestamps(true, true);
        table.unique(['tenant_id', 'email']);
    });
}
async function down(knex) {
    return knex.schema.dropTable('users');
}
//# sourceMappingURL=002_create_users.js.map