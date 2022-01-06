import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-to-fund-management',
  templateUrl: './to-fund-management.component.html',
  styleUrls: ['./to-fund-management.component.css']
})
export class TOFundManagementComponent implements OnInit {
  Damount: any;
  totalBudjetAmount: number;
  accYear: any;
  year: any;
  years?: any;
  district: any;
  districts?: any;
  taluk: any;
  taluks?: any;
  districtOptions: SelectItem[];
  yearOptions: SelectItem[];
  talukOptions: SelectItem[];
  toFundId: number;
  doFundId: number;
  blncAmount: number;
  totalTalukAmount: number;
  groupType: any;
  selectDistrict: any;
  accHead: any;
  budgetAmount: number;
  talukAmount: number;
  DistrictFundData: any = [];
  DistrictFundCols: any = [];
  showTable: boolean;
  districtFund: number;
  districtName: any;



  @ViewChild('f', { static: false }) _toFundForm: NgForm;
  @BlockUI() blockUI: NgBlockUI;
  show: boolean;
  accFundId: any;

  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService,
    private tableConstants: TableConstants) { }

  ngOnInit(): void {
    this.years = this.masterService.getMaster('AY');
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.DistrictFundCols = this.tableConstants.DistrictFundColumns;
    this.totalTalukAmount = 0;
    this.toFundId = 0;

  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    let yearSelection = [];
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
      case 'T':
        this.taluks.forEach(t => {
          if (t.dcode === this.district) {
            talukSelection.push({ label: t.name, value: t.code });
          }
          console.log('rs', this.taluks)
        })
        this.talukOptions = talukSelection;
        this.talukOptions.unshift({ label: '-select', value: null });
        break;
    }

  }
  load() {
    this.showTable = true;
    const params = {
      'AccountingYearId': this.year,
      'AccHeadId': 0,
      'Type': 2
    }
    this.restApiService.getByParameters(PathConstants.AccHeadFundAllotment_Get, params).subscribe(res => {
      if (res) {
        res.Table.forEach(r => {
          this.accFundId = r.Id,
            // this.accHeadId = r.AccHeadID,
            this.totalBudjetAmount = r.BudjetAmount
        })
        // this.AccHeadData = res;
      }
    })
  }
   
  // to load district amount
  loadAmount() {
    console.log('amnt')
    this.showTable = true;
    this.taluk = null;
    this.districtFund = 0;
    if (this.year !== null && this.year !== undefined && this.district !== null && this.district !== undefined) {
      this.blockUI.start();
      const params = {
        'AccHeadFundId': 29,
        'DCode': this.district,
        'YearId': this.year,
        'Type': 2
      }
      this.restApiService.getByParameters(PathConstants.DOFundAllotment_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.Table.length !== 0) {
            res.Table.forEach(res => {
            this.doFundId = res.DOFundId;
            })
            this.DistrictFundData = res.Table;
            this.blockUI.stop();
          } else {
            this.blockUI.stop();
          }
        } else {
          this.blockUI.stop();
        }



      })

    }
    //   this.loadToFunds();

  }






  onSave() {
    const params = {
      'ToFundId': this.toFundId,
      'DoFundId': this.doFundId,
      'AccHeadFundId': this.accFundId,
      'DCode': this.district,
      'TCode': this.taluk,
      'TalukAmount': this.talukAmount,
      'Flag': 1
    }
    this.restApiService.post(PathConstants.TOFundAllotment_Post, params).subscribe(res => {
      if (res) {
        var message = (this.toFundId === 0) ? ResponseMessage.SuccessMessage : ResponseMessage.UpdateMsg;
        this.clearForm();
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: message
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    })
  }

  loadToFunds() {
    this.talukAmount = null;
    if (this.accFundId !== undefined && this.accFundId !== null && this.taluk !== null && this.taluk !== undefined) {
      this.blockUI.start();
      const data = {
        'AccHeadFundId': this.accFundId,
        'TCode': this.taluk,
        'Type': 1
      }
      this.restApiService.getByParameters(PathConstants.TOFundAllotment_Get, data).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            this.totalTalukAmount = (res.Table[0].TotalTalukAmount !== undefined && res.Table[0].TotalTalukAmount !== null)
              ? (res.Table[0].TotalTalukAmount * 1) : 0;
            this.blncAmount = this.districtFund - this.totalTalukAmount;
            this.blockUI.stop();
         } else {
            this.blncAmount = this.districtFund;
          }
          if (res.Table1.length !== 0) {
            this.talukAmount = (res.Table1[0].AllotedAmount * 1);
          } else {
            this.talukAmount = 0;
          }
          this.blockUI.stop();
        } else {
          this.blockUI.stop();
          this.blncAmount = 0;
        }
      });
    }
  }


  


  checkBudjetAmount() {
    if (this.blncAmount !== undefined && this.blncAmount !== null &&
      this.talukAmount !== undefined && this.talukAmount !== null &&
      this.blncAmount !== NaN && this.talukAmount !== NaN) {
      if ((this.blncAmount * 1) < (this.talukAmount * 1)) {
        var msg = 'Entering amount should not be greater than available budget amount !';
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: msg
        });
        this.talukAmount = null;
      }
    }
  }
  onAdd(rowData) {
    this.show = true;
    this.accYear = rowData.ShortYear;
    this.groupType = rowData.GroupName;
    this.accHead = rowData.AccountHeadName;
    this.budgetAmount = rowData.Amount;
    this.districtName = rowData.Districtname;
    this.districtFund = rowData.DistrictAmount;
  }

  clearForm() {
    // this._toFundForm.reset();
    this.talukOptions = [];
    this.totalTalukAmount = 0;
    this.talukAmount = 0;
    this.blncAmount = 0;
  }
}
