// const { getAgreements } = require('./database_api/tenantRouter.js');

class ClientStagingInputDirectory {
    constructor(MySimBDPBatchIngestManager) {
        this.manager = MySimBDPBatchIngestManager;
        this.files = [];
    }

    putFilesIntoInputDirectory = (insertedFiles, tenantId) => {
        /* Add check here that fails if the tenant agreement is not followed. Most optimal place to stop before using computing resources. */
        // const tenantAgreements = getAgreements();
        const dataId = this.generateRandomStringId();
        this.files.push([insertedFiles, tenantId, dataId])
        this.manager.notifyManager(tenantId, dataId);
    }

    giveDataToTenant = (tenantId, dataId) => {
        const filesToGive = this.files.filter((files) => (files[1] === tenantId) && (files[2] === dataId))
        this.files.filter((files) => (files[1] !== tenantId) && (files[2] !== dataId))
        return filesToGive
    }

    generateRandomStringId = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 10; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

}

module.exports = ClientStagingInputDirectory;