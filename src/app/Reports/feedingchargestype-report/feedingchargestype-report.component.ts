import { Component, OnInit } from '@angular/core';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-feedingchargestype-report',
  templateUrl: './feedingchargestype-report.component.html',
  styleUrls: ['./feedingchargestype-report.component.css']
})
export class FeedingchargestypeReportComponent implements OnInit {

  data:any;
  Cols:any;
  Accountingyear:any;

  constructor(private tableConstants: TableConstants,private restApiService: RestAPIService) { }

  ngOnInit(): void {
    this.onView();
    this.Cols = this.tableConstants.feedingchargetypeReportCols
  }

  onView() {
    const params = {
      'AccountingYearId' : this.Accountingyear,
    };
    this.restApiService.getByParameters(PathConstants.FeedingChargesDetail_Get,params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.data = res.Table;
       console.log(this.data)
        this.data.forEach(i => {
          i.Flag = (i.Flag) ? 'Active' : 'Inactive';
        })
      }
    });
  
  }
  onRowSelect(event, selectedRow) {

  }
}
