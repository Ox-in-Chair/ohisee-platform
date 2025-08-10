import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('tenants', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.string('name').notNullable()
    table.string('subdomain').unique().notNullable()
    table.string('contact_email').notNullable()
    table.string('admin_email').notNullable()
    table.string('operations_email').notNullable()
    table.jsonb('settings').defaultTo('{}')
    table.jsonb('branding').defaultTo('{}')
    table.enum('plan', ['free', 'starter', 'professional', 'enterprise']).defaultTo('free')
    table.boolean('is_active').defaultTo(true)
    table.timestamps(true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('tenants')
}