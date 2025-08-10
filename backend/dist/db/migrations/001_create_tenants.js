"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.up = up;
exports.down = down;
async function up(knex) {
    return knex.schema.createTable('tenants', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
        table.string('name').notNullable();
        table.string('subdomain').unique().notNullable();
        table.string('contact_email').notNullable();
        table.string('admin_email').notNullable();
        table.string('operations_email').notNullable();
        table.jsonb('settings').defaultTo('{}');
        table.jsonb('branding').defaultTo('{}');
        table.enum('plan', ['free', 'starter', 'professional', 'enterprise']).defaultTo('free');
        table.boolean('is_active').defaultTo(true);
        table.timestamps(true, true);
    });
}
async function down(knex) {
    return knex.schema.dropTable('tenants');
}
//# sourceMappingURL=001_create_tenants.js.map