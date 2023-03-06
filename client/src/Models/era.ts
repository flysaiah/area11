export default class Era {
    constructor(
        public name: string,
        public subHeader: string,
        public entries: string[],
        public startDate: string,
        public endDate: string,
        public backgroundColor: string,
        public whiteText: boolean
    ) { }
}
