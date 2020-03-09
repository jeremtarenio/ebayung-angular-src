export class AdminProductModel {
    constructor(
        public productName: string,
        public price: number,
        public desc1: string,
        public desc2: string,
        public desc3: string,
        public category: string,
        public subcategory: string,
        public imgUrls: string[],
        public keywords: string[]
        ) {}
}

