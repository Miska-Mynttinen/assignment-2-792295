const schedule = require('node-schedule');

class MySimBDPBatchIngestManager {
    constructor() {
        this.tenantRegistry = new TenantRegistry();
        this.executor = new Executor();
    }

    scheduleJobs() {
        for (let tenant of this.tenantRegistry.getTenants()) {
            const frequency = tenant.getServiceAgreement().getFrequency();
            schedule.scheduleJob(`*/${frequency} * * * *`, () => this.runJob(tenant));
        }
    }

    runJob(tenant) {
        const clientBatchIngestApp = tenant.getClientBatchIngestApp();
        this.executor.run(clientBatchIngestApp);
    }

    run() {
        this.scheduleJobs();
    }
}

// Usage
const manager = new MySimBDPBatchIngestManager();
manager.run();
