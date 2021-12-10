
export class TableConstants {
    purcahseOrderColumns: any = [];
    consumptionDetailsColumns: any = [];
    consumptionReportColumns: any = [];
    purchaseBillColumns: any = [];
    wardenTableColumns: any = [];
    wardenDetailsReportColumns: any = [];
    registrationColumns: any = [];
    purchaseDetailsReportColumns: any = [];
    openingBalanceReportColumns: any = [];
    hostelReportCols: any = [];
    studentDetailsColumns: any = [];
    studentFacilityReportCols: any = [];
    hostelinfrastructureReportCols:any = [];
    constructor() {
        this.purcahseOrderColumns = [
            { field: 'Commodity', header: 'Commodity', align: 'left !important'},
            { field: 'Quantity', header: 'Quantity', align: 'right !important'},
            { field: 'Unit', header: 'Unit', align: 'left !important'},
            { field: 'Rate', header: 'Rate', align: 'right !important'},
            { field: 'Total', header: 'Total', align: 'right !important'},
        ];

        this.consumptionReportColumns = [
            { field: 'Districtname', header: 'District', align: 'left !important' },
            { field: 'Talukname', header: 'Taluk', align: 'left !important'  },
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'  },
            { field: 'ConsumptionDate', header: 'Consumption Date', align: 'center !important'  },
            { field: 'TotalStudent', header: 'Total No.Of Students', align: 'right !important'  },
            { field: 'Consumption', header: 'Consumption For', align: 'left !important'  },
            { field: 'Commodity', header: 'Commodity', align: 'left !important'  },
            { field: 'Unit', header: 'Unit', align: 'left !important'  },
            { field: 'OB', header: 'Opening Balance', align: 'right !important'  },
            { field: 'QTY', header: 'Required Quantity', align: 'right !important'  },
            { field: 'CB', header: 'Closing Balance', align: 'right !important'  },
        ];

        this.consumptionDetailsColumns = [
            { field: 'Consumption', header: 'Consumption For', align: 'left !important'  },
            { field: 'cDate', header: 'Consumption Date', align: 'center !important'  },
            { field: 'Commodity', header: 'Commodity', align: 'left !important'  },
            { field: 'Unit', header: 'Unit', align: 'left !important'  },
            { field: 'OB', header: 'Opening Balance', align: 'right !important'  },
            { field: 'QTY', header: 'Required Quantity', align: 'right !important'  },
            { field: 'CB', header: 'Closing Balance', align: 'right !important'  },
        ];

        this.purchaseBillColumns = [
            { field: 'billNo', header: 'Bill No.', align: 'left !important' },
            { field: 'bDate', header: 'Bill Date', align: 'center !important' },
            { field: 'billAmount', header: 'Bill Amount', align: 'right !important' },
            { field: 'shopName', header: 'ShopName', align: 'left !important' },
            { field: 'gstNo', header: 'Gst Number', align: 'left !important' },
        ];

        this.wardenTableColumns = [
            { field: 'Name', header: 'Warden Name', align: 'left !important'},
            { field: 'CourseName', header: 'Qualification', align: 'left !important'},
            { field: 'Designation', header: 'Designation', align: 'left !important'},
            { field: 'EMail', header: 'Email', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
            { field: 'Talukname', header: 'Taluk', align: 'left !important'},
            { field: 'Districtname', header: 'District', align: 'left !important'},
            { field: 'PhoneNo', header: 'Mobile No', align: 'center !important'},
            { field: 'Pincode', header: 'Pincode', align: 'center !important'},
          ];

        this.wardenDetailsReportColumns = [
            { field: 'WardenName', header: 'Name', align: 'left !important'},
            { field: 'Qualification', header: 'Qualification', align: 'left !important'},
            { field: 'ServiceJoinedDate', header: 'Service Joined Date', align: 'center !important'},
            { field: 'Designation', header: 'Designation', align: 'left !important'},
            { field: 'HostelJoinedDate', header: 'Hostel Joined Date', align: 'center !important'},
            { field: 'Districtname', header: 'District', align: 'left !important'},
            { field: 'Talukname', header: 'Taluk', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
            { field: 'EMail', header: 'Email', align: 'left !important'},
            { field: 'PhoneNo', header: 'Phone No', align: 'right !important'},
            { field: 'EndDate', header: 'Service End Date', align: 'center !important'},
        ];

        this.registrationColumns = [
            { field: 'studentName', header: 'Name', align: 'left !important'},
            { field: 'age', header: 'Age', align: 'right !important'},
            { field: 'genderName', header: 'Gender', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
            { field: 'mobileNo', header: 'Mobile No.', align: 'right !important'},
            { field: 'instituteName', header: 'Institute Name', align: 'left !important'},
            { field: 'courseTitle', header: 'Course', align: 'left !important'},
            { field: 'aadharNo', header: 'Aadhar No.', align: 'right !important'},
            { field: 'emisno', header: 'EMIS NO.', align: 'right !important'},
            { field: 'totalYIncome', header: 'Yearly Income', align: 'right !important'},
        ];

        this.studentDetailsColumns = [
            { field: 'studentName', header: 'Name', align: 'left !important'},
            { field: 'Districtname', header: 'District', align: 'left !important'},
            { field: 'Talukname', header: 'Taluk', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
            { field: 'age', header: 'Age', align: 'right !important'},
            { field: 'genderName', header: 'Gender', align: 'left !important'},
            { field: 'mobileNo', header: 'Mobile No.', align: 'right !important'},
            { field: 'instituteName', header: 'Institute Name', align: 'left !important'},
            { field: 'courseTitle', header: 'Course', align: 'left !important'},
            { field: 'address', header: 'Address', align: 'left !important'},
            { field: 'aadharNo', header: 'Aadhar No.', align: 'right !important'},
            { field: 'emisno', header: 'EMIS NO.', align: 'right !important'},
        ];

        this.purchaseDetailsReportColumns = [
            { field: 'BillNo', header: 'Bill No.', align: 'left !important'},
            { field: 'BillDate', header: 'Bill Date', align: 'center !important'},
            { field: 'BillAmount', header: 'Bill Amount',align: 'right !important'},
            { field: 'ShopName', header: 'ShopName', align: 'left !important'},
            { field: 'GstNo', header: 'Gst Number', align: 'left !important'},
            { field: 'Districtname', header: 'District', align: 'left !important'},
            { field: 'Talukname', header: 'Taluk', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
        ];
         
        this.openingBalanceReportColumns = [
            { field: 'ShortYear', header: 'Accounting Year', align: 'left !important'},
            { field: 'Districtname', header: 'District', align: 'left !important'},
            { field: 'Talukname', header: 'Taluk', align: 'left !important'},
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
            { field: 'CommodityName', header: 'Commodity Name', align: 'left !important'},
            { field: 'Qty', header: 'Quantity', align: 'right !important'},
            { field: 'UnitName', header: 'Unit', align: 'left !important'},
            
        ]

        this.hostelReportCols = [
            { field: 'HostelName', header: 'Hostel Name', align: 'left !important'},
             { field: 'HostelNameTamil', header: 'விடுதியின் பெயர்', align: 'left !important'},
            { field: 'Name', header: 'Hostel Type', align: 'left !important'},
            { field: 'Districtname', header: 'District', align: 'left !important'},
            { field: 'Talukname', header: 'Taluk', align: 'left !important'},
            // { field: 'BuildingNo', header: 'BuildingNo', width: '100px', align: 'left !important'},
            // { field: 'Street', header: 'Street', width: '100px', align: 'left !important'},
            // { field: 'Landmark', header: 'Landmark', width: '100px', align: 'left !important'},
            { field: 'Pincode', header: 'Pincode', align: 'right !important'},
            { field: 'Phone', header: 'Contact No.', align: 'right !important'},
            { field: 'TotalStudent', header: 'Student Count', align: 'right !important'},
        ]
        this.studentFacilityReportCols = [
            { field: 'Districtname', header: 'Districtname', width: '200px'},
            { field: 'Talukname', header: 'HostelName', width: '200px'},
            { field: 'HostelName', header: 'HostelName', width: '200px'},
            { field: 'FacilityName', header: 'FacilityName', width: '200px'},
            { field: 'NoOfCounts', header: 'NoOfCounts', width: '200px'},
            { field: 'Remarks', header: 'Remarks', width: '200px'},
        ]

        this.hostelinfrastructureReportCols = [
  
            { field: 'Districtname', header: 'District code' },
            { field: 'Talukname', header: 'Taluk id' },
            { field: 'HostelName', header: 'HostelId' },
            { field: 'TotalArea', header: 'Total Area' },
            { field: 'BuildingArea', header: 'Building Area' },
            { field: 'NoOfFloor', header: 'No Of Floor' },
            { field: 'NoOfRoom', header: 'No Of Room' }, 
            { field: 'Kitchen', header: 'Kitchen' },
            { field: 'Bathroom', header: 'Bathroom' },
            { field: 'CreatedDate', header: 'Created Date' },
           

        ]

    }
}