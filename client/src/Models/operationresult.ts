export default class OperationResult {
    constructor(
        public success: boolean,
        public message: string,
        public data: any
    ) { }
}
