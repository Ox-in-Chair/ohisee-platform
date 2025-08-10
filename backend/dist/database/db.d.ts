import { Pool } from 'pg';
declare const pool: Pool;
export declare function testConnection(): Promise<boolean>;
export declare function initializeDatabase(): Promise<boolean>;
export declare function createReport(reportData: any): Promise<any>;
export declare function getAllReports(): Promise<any[]>;
export declare function getReportById(id: string): Promise<any>;
export declare function createAuditLog(logData: any): Promise<any>;
export declare function trackAIUsage(usageData: any): Promise<any>;
export default pool;
//# sourceMappingURL=db.d.ts.map