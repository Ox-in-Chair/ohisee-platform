import knex, { Knex } from 'knex'
import { logger } from '../utils/logger'
import { mockDb } from './mockDatabase'

let db: Knex
let useMockDb = false

export const initializeDatabase = async (): Promise<void> => {
  // Use mock database if DATABASE_URL is not set or equals 'mock'
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'mock') {
    useMockDb = true
    logger.info('Using mock database for testing')
    return
  }

  try {
    db = knex({
      client: 'pg',
      connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
      },
      pool: {
        min: 2,
        max: 10,
      },
    })

    await db.raw('SELECT 1')
    logger.info('Database connected successfully')
  } catch (error) {
    logger.error('Database connection failed, falling back to mock database:', error)
    useMockDb = true
  }
}

export const getDb = (): any => {
  if (useMockDb) {
    return mockDb
  }
  if (!db) {
    throw new Error('Database not initialized')
  }
  return db
}

export const createTenantSchema = async (tenantId: string): Promise<void> => {
  if (useMockDb) {
    logger.info(`Mock: Created schema for tenant: ${tenantId}`)
    return
  }
  const schemaName = `tenant_${tenantId}`
  await db.raw(`CREATE SCHEMA IF NOT EXISTS ??`, [schemaName])
  logger.info(`Created schema for tenant: ${tenantId}`)
}

export const getTenantDb = (tenantId: string): any => {
  if (useMockDb) {
    return mockDb
  }
  const schemaName = `tenant_${tenantId}`
  return db.withSchema(schemaName)
}