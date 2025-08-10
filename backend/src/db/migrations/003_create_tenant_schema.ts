import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  const createTenantTables = async (schemaName: string) => {
    await knex.raw(`CREATE SCHEMA IF NOT EXISTS ??`, [schemaName])

    await knex.schema.withSchema(schemaName).createTable('reports', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.string('reference_number').unique().notNullable()
      table.enum('category', ['product_safety', 'misconduct', 'health_safety', 'harassment']).notNullable()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.string('location')
      table.date('date_occurred')
      table.text('witnesses')
      table.boolean('previous_report').defaultTo(false)
      table.string('reporter_email')
      table.integer('bad_faith_score').defaultTo(0)
      table.jsonb('bad_faith_flags').defaultTo('[]')
      table.enum('status', [
        'submitted',
        'under_review',
        'investigating',
        'resolved',
        'closed',
        'escalated'
      ]).defaultTo('submitted')
      table.enum('priority', ['low', 'medium', 'high', 'critical']).defaultTo('medium')
      table.uuid('assigned_to')
      table.timestamp('resolved_at')
      table.text('resolution_notes')
      table.timestamps(true, true)
    })

    await knex.schema.withSchema(schemaName).createTable('report_attachments', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('report_id').references('id').inTable(`${schemaName}.reports`).onDelete('CASCADE')
      table.string('filename').notNullable()
      table.string('mime_type').notNullable()
      table.integer('size').notNullable()
      table.string('storage_path').notNullable()
      table.timestamps(true, true)
    })

    await knex.schema.withSchema(schemaName).createTable('report_updates', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.uuid('report_id').references('id').inTable(`${schemaName}.reports`).onDelete('CASCADE')
      table.uuid('user_id')
      table.text('message').notNullable()
      table.enum('visibility', ['internal', 'reporter']).defaultTo('internal')
      table.timestamps(true, true)
    })

    await knex.schema.withSchema(schemaName).createTable('report_analytics', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'))
      table.date('date').notNullable()
      table.jsonb('category_counts').defaultTo('{}')
      table.jsonb('status_counts').defaultTo('{}')
      table.jsonb('priority_counts').defaultTo('{}')
      table.integer('total_reports').defaultTo(0)
      table.integer('resolved_reports').defaultTo(0)
      table.float('avg_resolution_time')
      table.float('bad_faith_percentage')
      table.timestamps(true, true)
      
      table.unique(['date'])
    })
  }

  await createTenantTables('tenant_default')
  await createTenantTables('tenant_kangopak')
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP SCHEMA IF EXISTS tenant_default CASCADE')
  await knex.raw('DROP SCHEMA IF EXISTS tenant_kangopak CASCADE')
}