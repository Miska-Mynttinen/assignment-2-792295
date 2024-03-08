class Initializer {
    constructor() {
        this._inputDirectory = null;
        this._manager = null;
    }

    set inputDirectory(inputDirectory) {
        this._inputDirectory = inputDirectory;
    }

    set manager (manager) {
        this._manager = manager;
    }

    get inputDirectory() {
        return this._inputDirectory;
    }

    get manager() {
        return this._manager;
    }   
}

module.exports = Initializer;