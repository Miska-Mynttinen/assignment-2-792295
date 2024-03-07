class ClientStagingInputDirectory {
    constructor(MySimBDPBatchIngestManager) {
        this.manager = MySimBDPBatchIngestManager;
        this.files = [];
    }

    putFilesIntoInputDirectory = (insertedFiles, tenantId) => {
        const dataId = generateRandomStringId();
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

module.exports = { ClientStagingInputDirectory };