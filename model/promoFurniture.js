const Furniture = require('./furniture');

class promoFurniture extends Furniture {
    constructor() {
        super(); // initialize Furniture fields
        this.promoId = null;
        this.discountRate = null;
        this.startDate = null;
        this.endDate = null;
        
    }
}

module.exports = promoFurniture;