export default class Era {
    constructor(
        public name: string,
        public subHeader: string,
        public entries: string[],
        public startDate: Date,
        public endDate: Date,
        public backgroundColor: string,
        public whiteText: boolean,
    ) { }
}
