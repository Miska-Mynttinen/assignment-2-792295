const { getAgreements } = require('./database_api/agreementService');

class ClientStagingInputDirectory {
    constructor(MySimBDPBatchIngestManager) {
        this.manager = MySimBDPBatchIngestManager;
        this.files = [];
    }

    putFilesIntoInputDirectory = async (insertedFiles, tenantId) => {
        /* Check fails if the tenant agreement is not followed. Most optimal place to stop before using computing resources. */
        const tenantAgreements = await getAgreements();
        if (insertedFiles.length > tenantAgreements[tenantId].max_num_of_files) {
            throw new Error(`Too many files inserted at once. Allowed maximum: ${tenantAgreements[tenantId].max_num_of_files}`);
        }

        /* Check if file size in megabytes is larger then maximum allowed size. */
        // Check if insertedFiles is iterable
        if (typeof insertedFiles[Symbol.iterator] === 'function') {
            // insertedFiles is iterable
            for(const file of insertedFiles) {
                if ((Buffer.byteLength(JSON.stringify(file)) / (1024*1024)).toFixed(2) > tenantAgreements[tenantId].max_file_size_megabytes) {
                    throw new Error(`A given file is too large. Allowed maximum size in MB is ${tenantAgreements[tenantId].max_file_size_megabytes}`);
                }
            }
        } else {
            //insertedFiles is not iterable
            if ((Buffer.byteLength(JSON.stringify(insertedFiles)) / (1024*1024)).toFixed(2) > tenantAgreements[tenantId].max_file_size_megabytes) {
                throw new Error(`A given file is too large. Allowed maximum size in MB is ${tenantAgreements[tenantId].max_file_size_megabytes}`);
            }
        }

        const dataId = this.generateRandomStringId();
        this.files.push([insertedFiles, tenantId, dataId])
        this.manager.notifyManager(tenantId, dataId);
    }

    giveDataToTenant = (tenantId, dataId) => {
        const filesToGive = this.files.filter((files) => (files[1] === tenantId) && (files[2] === dataId))
        this.files.filter((files) => (files[1] !== tenantId) && (files[2] !== dataId))
        return filesToGive.map(([insertedFiles]) => [insertedFiles]);
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