export declare class HealthController {
    check(): {
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        cors: string;
        api: string;
        database: string;
    };
    detailedCheck(): {
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        version: string;
        memory: {
            rss: string;
            heapTotal: string;
            heapUsed: string;
            external: string;
        };
        database: {
            status: string;
            host: string;
        };
        api: {
            prefix: string;
            cors: string;
        };
    };
}
