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
  fundData: any[] = [];
  treeData: TreeNode[];
  cols: any = [];

  constructor(private masterService: MasterService, private restApiService: RestAPIService) { }

  ngOnInit(): void {
    this.years = this.masterService.getMaster('AY');
    this.districts = this.masterService.getMaster('DT');
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'size', header: 'Date' },
      { field: 'type', header: 'Budjet Amount' }
    ];
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
        this.districtOptions.unshift({ label: 'All', value: 0 });
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;
    }
  }

  loadBudjet() {
    this.budjetAmount = 0;
    if (this.accYear !== null && this.accYear !== undefined) {
      const params = {
        'AccountingYearId': this.accYear
      }
      this.restApiService.getByParameters(PathConstants.HOFundAllotment_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          this.showField = true;
          if (res.length !== 0) {
            res.forEach(res => {
              this.budjetAmount = res.BudjetAmount;
            })
          } else {
            this.showField = false;
          }
        } else {
          this.showField = false;
        }
      });
    }
  }

  loadTable() {
    if (this.district !== null && this.district !== undefined && this.accYear !== null && this.accYear !== undefined) {
      const params = {
        'DCode': this.district,
        'AccountingYear': this.accYear
      }
      this.restApiService.getByParameters(PathConstants.FundManagementReport_Get, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.fundData = res;
        }
      })
    }
  }

  constructTreeData() {
    var treeData = [];
    var district = [];
    var taluk = [];
    var hostel = [];
    if (this.fundData.length !== 0) {
      for (let i = 0; i < this.fundData.length - 1; i++) {
        if (this.fundData[i].Districtcode === this.fundData[i + 1].Districtcode) {
          treeData.push({ 
            "data": {
              'name': this.fundData[i].Districtname,
              'amount': this.fundData[i].DOBudjetAmount,
            },
            "children": [{
              "data": {
                'name': this.fundData[i].Talukname,
                'amount': this.fundData[i].TOBudjetAmount
              },
              "children": [
                {
                  "data": {
                    'name': this.fundData[i].HostelName,
                    'amount': this.fundData[i].HostelBudjetAmount
                  }
                }
              ]
            }]
          })
        }
      }
    }
  }
}
