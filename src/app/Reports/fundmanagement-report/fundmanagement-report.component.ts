import { Component, OnInit } from '@angular/core';
import { SelectItem, TreeNode } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import * as Rx from 'rxjs';

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
  fundData: any[] = [];
  treeData: TreeNode[] = [];
  cols: any = [];

  constructor(private masterService: MasterService, private restApiService: RestAPIService) { }

  ngOnInit(): void {
    this.years = this.masterService.getMaster('AY');
    this.districts = this.masterService.getMaster('DT');
    this.budjetAmount = 0;
    this.cols = [
      { field: 'name', header: 'Name' },
      { field: 'amount', header: 'Budjet Amount' },
      //   { field: 'type', header: 'Budjet Amount' }
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
          if (res.length !== 0) {
            res.forEach(res => {
              this.budjetAmount = res.BudjetAmount;
            })
          } else {
            this.budjetAmount = 0;
          }
        } else {
          this.budjetAmount = 0;
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
          this.constructTreeData()
        }
      })
    }
  }

  populateDummyData() {

  }

  constructTreeData() {
    if (this.fundData.length !== 0) {
      ///extracting unique data (district, taluk, hostel)
      var district_hash = Object.create(null),
        district = [];
      var taluk_hash = Object.create(null),
        taluk = [];
      var hostel_hash = Object.create(null),
        hostel = [];
      this.fundData.forEach(function (o) {
        /// match and bind unique values
        var key = ['TOFundId', 'HOFundId', 'DOFundId'].map(function (k) { return o[k]; }).join('|');
        var dkey = ['DOFundId'].map(function (d) { return o[d]; }).join('|');
        if (!district_hash[dkey]) {
          district_hash[dkey] = {
            name: o.Districtname,
            amount: o.DOBudjetAmount,
            talukFundId: o.TOFundId,
            hostelFundId: o.HostelFundId,
            districtFundId: o.DOFundId,
            hashType: 'DISTRICT'
          };
          district.push(district_hash[dkey]);
        }
        if (!taluk_hash[key] && o.TOFundId !== null) {
          taluk_hash[key] = {
            name: o.Talukname,
            amount: o.TOBudjetAmount,
            talukFundId: o.TOFundId,
            hostelFundId: o.HostelFundId,
            districtFundId: o.DOFundId,
            hashType: 'TALUK'
          };
          taluk.push(taluk_hash[key]);
        }
        if (!hostel_hash[key] && o.HostelFundId !== null) {
          hostel_hash[key] = {
            name: o.HostelName,
            amount: o.HostelBudjetAmount,
            talukFundId: o.TOFundId,
            hostelFundId: o.HostelFundId,
            districtFundId: o.DOFundId,
            hashType: 'HOSTEL'
          };
          hostel.push(hostel_hash[key]);
        }
      })
      ///creating a treenode and adding parent and child to it
      var treeNode = [];
      let d_sno = 0;
      // pushing children based on each row in parent data
      for (let d = 0; d < district.length; d++) {
        d_sno = d_sno + 1;
        district[d].slno = d_sno;
        var talukChild = [];
        var hostelChild = [];
        let h_sno = 0;
        for (let h = 0; h < hostel.length; h++) {
          if (hostel[h].talukFundId === hostel[h].talukFundId) {
            h_sno = h_sno + 1;
            hostel[h].slno = h_sno;
            hostelChild.push({
              "data": hostel[h] //children (treenode-3)
            })
          } else {
            continue;
          }
        }
        let t_sno = 0;
        for (let t = 0; t < taluk.length; t++) {
          if (taluk[t].districtFundId === district[d].districtFundId) {
            t_sno = t_sno + 1;
            taluk[t].slno = t_sno;
            talukChild.push({
              "data": taluk[t], //children to district(parent)/parent to hostel(children) (treenode-2)
              "children": hostelChild //inner children to taluk
            })
          } else {
            continue;
          }
        }
        treeNode.push({
          "data": district[d], //parent (treenode-1)
          "children": talukChild //children with inner children
        })
      }
      this.treeData = treeNode; //assigning treenode to tree table data
    }
  }

  public getColor(name: string): string {
    var colorCode: string;
    if (name === 'TALUK') {
      colorCode = "#e3f2fd"
    } else if (name === 'HOSTEL') {
      colorCode = "#d2d4d7";
    } else {
      colorCode = "white";
    }
    return colorCode;
  }
}
