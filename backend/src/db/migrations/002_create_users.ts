import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
    table.uuid('tenant_id').references('id').inTable('tenants').onDelete('CASCADE')
    table.string('email').notNullable()
    table.string('password_hash').notNullable()
    table.string('first_name')
    table.string('last_name')
    table.enum('role', ['admin', 'manager', 'compliance', 'user']).defaultTo('user')
    table.boolean('is_active').defaultTo(true)
    table.timestamp('last_login')
    table.string('reset_token')
    table.timestamp('reset_token_expires')
    table.timestamps(true, true)
    
    table.unique(['tenant_id', 'email'])
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('users')
}