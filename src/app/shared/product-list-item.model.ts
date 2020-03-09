export class ProductListItem {
    constructor(
        public id: number,
        public name: string,
        public price: number,
        public subCategoryId: number,
        public categoryId: number,
        public averageRating: number,
        public noOfRatings: number,
        public imgUrl: string,
        public keywords: string[]
        ) {}
}

