interface ReportNotification {
    referenceNumber: string;
    category: string;
    title: string;
    tenantId: string;
}
export declare const sendReportNotification: (data: ReportNotification) => Promise<void>;
export declare const sendReportUpdate: (email: string, referenceNumber: string, status: string, message: string) => Promise<void>;
export {};
//# sourceMappingURL=emailService.d.ts.map