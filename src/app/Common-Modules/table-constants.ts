
export class TableConstants {
    purcahseOrderColumns: any = [];
    consumptionColumns: any = [];

    constructor() {
        this.purcahseOrderColumns = [
            { field: 'Commodity', header: 'Commodity'},
            { field: 'Quantity', header: 'Quantity'},
            { field: 'Unit', header: 'Unit'},
            { field: 'Rate', header: 'Rate'},
            { field: 'Total', header: 'Total'},
        ];

        this.consumptionColumns = [
            { field: 'consumptionFor', header: 'Consumption For' },
            { field: 'commdotiy', header: 'Commodity' },
            { field: 'unit', header: 'Unit' },
            { field: 'OB', header: 'Opening Balance' },
            { field: 'requiredQty', header: 'Required Quantity' },
            { field: 'CB', header: 'Closing Balance' },
        ];
    }
}