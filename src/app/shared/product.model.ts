import { Review } from './review.model';

export class Product {
    constructor(
        public id: number,
        public name: string,
        public price: number,
        public subCategoryId: number,
        public categoryId: number,
        public desc: string[],
        public reviews: Review[],
        public imageUrl: string[],
        public keywords: string[]
        ) {}
}
