interface Report {
    id: string;
    reference_number: string;
    category: string;
    title: string;
    description: string;
    location?: string;
    date_occurred?: string;
    witnesses?: string;
    previous_report: boolean;
    reporter_email?: string;
    bad_faith_score: number;
    bad_faith_flags: string;
    status: string;
    priority: string;
    created_at: Date;
    updated_at: Date;
}
interface User {
    id: string;
    email: string;
    password_hash: string;
    first_name: string;
    last_name: string;
    role: string;
    tenant_id: string;
    is_active: boolean;
}
declare class MockDatabase {
    private reports;
    private users;
    private reportUpdates;
    constructor();
    private initializeMockData;
    getReports(tenantId: string, filters?: any): Promise<Report[]>;
    getReport(id: string): Promise<Report>;
    getReportByReference(referenceNumber: string): Promise<Report>;
    createReport(data: Partial<Report>): Promise<Report>;
    updateReport(id: string, updates: Partial<Report>): Promise<Report>;
    getUser(email: string, tenantId: string): Promise<User>;
    createUser(data: Partial<User>): Promise<User>;
    getStats(tenantId: string): Promise<{
        total: number;
        categoryStats: Record<string, number>;
        statusStats: Record<string, number>;
        recentReports: Report[];
    }>;
    private generateReferenceNumber;
}
export declare const mockDb: MockDatabase;
export {};
//# sourceMappingURL=mockDatabase.d.ts.map