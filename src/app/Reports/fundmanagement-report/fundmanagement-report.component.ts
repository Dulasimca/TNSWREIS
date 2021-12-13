import { Component, OnInit } from '@angular/core';
import { SelectItem, TreeNode } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-fundmanagement-report',
  templateUrl: './fundmanagement-report.component.html',
  styleUrls: ['./fundmanagement-report.component.css']
})
export class FundmanagementReportComponent implements OnInit {

  accYear: any;
  district: any;
  districtOptions: SelectItem[];
  yearOptions: SelectItem[];
  districts?: any;
  years?: any;
  budjetAmount: number;
  showField: boolean;
  fundData: TreeNode[];
  cols: any = [];

  constructor(private masterService: MasterService, private restApiService: RestAPIService) { }

  ngOnInit(): void {
    this.years = this.masterService.getMaster('AY');
    this.districts = this.masterService.getMaster('DT');
  }
  

  onSelect(type) {
    let yearSelection = [];
    let districtSelection = [];
    switch (type) {
      case 'Y':
        this.years.forEach(y => {
          yearSelection.push({ label: y.name, value: y.code });
        })
        this.yearOptions = yearSelection;
        this.yearOptions.unshift({ label: '-select', value: null });
        break;
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;
  }

}
loadBudjet() {
  // this.budjetAmount = 0;
    if (this.accYear !== null && this.accYear !== undefined) {
      const params = {
        'AccountingYearId': this.accYear
      }
      this.restApiService.getByParameters(PathConstants.HOFundAllotment_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          this.showField = true;
          if (res.length !== 0) {
            res.forEach(res => {
              this.budjetAmount = res.BudjetAmount ;
            })
          } else {
          this.showField = false;
        } 
      }else {
          this.showField = false;
        }
      });
    }
}
loadTable() {
  this.cols = [
    { field: 'name', header: 'Name' },
    { field: 'size', header: 'Date' },
    { field: 'type', header: 'Budjet Amount' }
];
}
}
