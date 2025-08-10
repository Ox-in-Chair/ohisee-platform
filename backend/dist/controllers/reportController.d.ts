import { Request, Response } from 'express';
export declare class ReportController {
    createReport(req: Request, res: Response): Promise<void>;
    trackReport(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getReports(req: Request, res: Response): Promise<void>;
    getCategoryStats(req: Request, res: Response): Promise<void>;
    private generateReferenceNumber;
}
//# sourceMappingURL=reportController.d.ts.map