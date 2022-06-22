class ValidationMessage {
    isOk: boolean;
    errorMessages: string[];

    constructor() {
        this.isOk = true;
        this.errorMessages = [];
    }
}

export default ValidationMessage;
