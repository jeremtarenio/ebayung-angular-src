export class SingleProduct {
    constructor(
        public id: number,
        public name: string,
        public price: number,
        public productDesc1: string,
        public productDesc2: string,
        public productDesc3: string,
        public averageRating: number,
        public noOfRatings: number,
        public category: string,
        public subcategory: string
        ) {}
}
