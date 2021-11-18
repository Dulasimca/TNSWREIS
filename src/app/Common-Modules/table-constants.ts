
export class TableConstants {
    purcahseOrderColumns: any = [];
    consumptionColumns: any = [];
    purchaseBillColumns: any = [];
    wardenTableColumns: any = [];
    wardenDetailsReportColumns: any = [];
    registrationColumns: any = [];
    purchaseDetailsReportColumns: any = [];
    openingBalanceReportColumns: any = [];
    hostelReportCols: any = [];
    constructor() {
        this.purcahseOrderColumns = [
            { field: 'Commodity', header: 'Commodity'},
            { field: 'Quantity', header: 'Quantity'},
            { field: 'Unit', header: 'Unit'},
            { field: 'Rate', header: 'Rate'},
            { field: 'Total', header: 'Total'},
        ];

        this.consumptionColumns = [
            { field: 'Districtname', header: 'District' },
            { field: 'Talukname', header: 'Taluk' },
            { field: 'HostelName', header: 'Hostel Name' },
            { field: 'Consumption', header: 'Consumption For' },
            { field: 'Commodity', header: 'Commodity' },
            { field: 'Unit', header: 'Unit' },
            { field: 'OB', header: 'Opening Balance' },
            { field: 'QTY', header: 'Required Quantity' },
            { field: 'CB', header: 'Closing Balance' },
        ];

        this.purchaseBillColumns = [
            { field: 'billNo', header: 'Bill No.' },
            { field: 'billDate', header: 'Bill Date' },
            { field: 'billAmount', header: 'Bill Amount' },
            { field: 'shopName', header: 'ShopName' },
            { field: 'gstNo', header: 'Gst Number' },
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

        this.wardenDetailsReportColumns = [
            { field: 'WardenName', header: 'Name'},
            { field: 'Qualification', header: 'Qualification'},
            { field: 'ServiceJoinedDate', header: 'Service Joined Date'},
            { field: 'Designation', header: 'Designation'},
            { field: 'HostelJoinedDate', header: 'Hostel Joined Date'},
            { field: 'Districtname', header: 'District'},
            { field: 'Talukname', header: 'Taluk'},
            { field: 'HostelName', header: 'Hostel Name'},
            { field: 'EMail', header: 'Email'},
            { field: 'PhoneNo', header: 'Phone No'},
            { field: 'EndDate', header: 'Service End Date'},
        ];

        this.registrationColumns = [
            { field: 'studentName', header: 'Name'},
            { field: 'age', header: 'Age'},
            { field: 'gender', header: 'Gender'},
            { field: 'HostelName', header: 'Hostel Name'},
            { field: 'mobileNo', header: 'Mobile No.'},
            { field: 'instituteName', header: 'Institute Name'},
            { field: 'courseTitle', header: 'Course'},
            { field: 'address', header: 'Address'},
            { field: 'Districtname', header: 'District'},
            { field: 'aadharNo', header: 'Aadhar No.'},
            { field: 'emisno', header: 'EMIS NO.'},
            { field: 'bankAccNo', header: 'Bank Account No.'},
            { field: 'fatherName', header: 'Father Name'},
            { field: 'fatherMoileNo', header: 'Father Mobile No'},
            { field: 'totalYIncome', header: 'Yearly Income'},

        ]

        this.purchaseDetailsReportColumns = [
            { field: 'BillNo', header: 'Bill No.' },
            { field: 'BillDate', header: 'Bill Date' },
            { field: 'BillAmount', header: 'Bill Amount' },
            { field: 'ShopName', header: 'ShopName' },
            { field: 'GstNo', header: 'Gst Number' },
            { field: 'Districtname', header: 'District'},
            { field: 'Talukname', header: 'Taluk'},
            { field: 'HostelName', header: 'Hostel Name'},

        ]
         
        this.openingBalanceReportColumns = [
            { field: 'ShortYear', header: 'Accounting Year'},
            { field: 'CommodityName', header: 'Commodity Name'},
            { field: 'Qty', header: 'Quantity'},
            { field: 'UnitName', header: 'Unit'},
        ]

        this.hostelReportCols = [
            { field: 'HostelName', header: 'Hostel Name'},
             { field: 'HostelNameTamil', header: 'விடுதியின் பெயர்'},
            { field: 'Name', header: 'Hostel Type'},
            { field: 'Districtname', header: 'District'},
            { field: 'Talukname', header: 'Taluk'},
            // { field: 'BuildingNo', header: 'BuildingNo', width: '100px'},
            // { field: 'Street', header: 'Street', width: '100px'},
            // { field: 'Landmark', header: 'Landmark', width: '100px'},
            { field: 'Pincode', header: 'Pincode'},
            { field: 'Phone', header: 'Contact No.'},
            { field: 'TotalStudent', header: 'Student Count'}
        ]

    }
}