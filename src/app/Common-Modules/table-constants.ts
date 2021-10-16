
export class TableConstants {
    purcahseOrderColumns: any = [];
    consumptionColumns: any = [];
    purchaseBillColumns: any = [];
    wardenTableColumns: any = [];
    constructor() {
        this.purcahseOrderColumns = [
            { field: 'Commodity', header: 'Commodity'},
            { field: 'Quantity', header: 'Quantity'},
            { field: 'Unit', header: 'Unit'},
            { field: 'Rate', header: 'Rate'},
            { field: 'Total', header: 'Total'},
        ];

        this.consumptionColumns = [
            { field: 'Consumption', header: 'Consumption For' },
            { field: 'Commodity', header: 'Commodity' },
            { field: 'Unit', header: 'Unit' },
            { field: 'OB', header: 'Opening Balance' },
            { field: 'QTY', header: 'Required Quantity' },
            { field: 'CB', header: 'Closing Balance' },
        ];

        this.purchaseBillColumns = [
            { field: 'BillNo', header: 'Bill No.' },
            { field: 'BillDate', header: 'Bill Date' },
            { field: 'BillAmount', header: 'Bill Amount' },
            { field: 'ShopName', header: 'ShopName' },
            { field: 'GstNo', header: 'Gst Number' },
        ];

        this.wardenTableColumns = [
            { field: 'Name', header: 'Warden Name'},
            { field: 'CourseName', header: 'Qualification'},
            { field: 'Designation', header: 'Designation'},
            { field: 'EMail', header: 'Email'},
            // { field: 'HostelId', header: 'Hostel Name'},
            { field: 'PhoneNo', header: 'Mobile No'},
            { field: 'Pincode', header: 'Pincode'},
          ];
    }
}