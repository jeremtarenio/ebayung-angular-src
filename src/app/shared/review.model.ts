export class Review {
    constructor(
        public reviewId: number,
        public rating: number,
        public title: string,
        public description: string,
        public user: string,
        public helpfulPoints: number,
        public date: string
        ) {}
}
