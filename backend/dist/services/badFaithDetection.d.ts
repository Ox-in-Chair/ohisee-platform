interface BadFaithAnalysis {
    score: number;
    flags: string[];
    suggestions?: string[];
}
interface ReportData {
    title: string;
    description: string;
    category: string;
    previous_report: boolean;
}
export declare const detectBadFaith: (data: ReportData) => Promise<BadFaithAnalysis>;
export {};
//# sourceMappingURL=badFaithDetection.d.ts.map