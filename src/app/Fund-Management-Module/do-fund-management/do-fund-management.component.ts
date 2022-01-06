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
  selector: 'app-do-fund-management',
  templateUrl: './do-fund-management.component.html',
  styleUrls: ['./do-fund-management.component.css']
})
export class DOFundManagementComponent implements OnInit {
  yearOptions: SelectItem[];
  year: any;
  years?: any;
  totalBudjetAmount: number;
  districtOptions: SelectItem[];
  districts?: any;
  district: any;
  // hoAmount: number;
  // doFundId: number;
  // hoFundId: number;
  blncAmount: number;
  totalDistrictAmt: number;
  AccHeadData: any = [];
  AccHeadCols: any = [];
  showTable: boolean;
  accYear: any;
  groupType: any;
  accHead: any;
  budgetAmount: number;
  districtAmount: number;
  showTransfer: boolean;
  accFundId: number;

  @ViewChild('f', { static: false }) _doFundForm: NgForm;
  @BlockUI() blockUI: NgBlockUI;
  doFundId: any;
  accHeadId: any;
  FundId: any;


  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService,
    private tableConstants: TableConstants) { }

  ngOnInit(): void {
    this.years = this.masterService.getMaster('AY');
    this.districts = this.masterService.getMaster('DT');
    this.AccHeadCols = this.tableConstants.AccHeadColumns;
    this.totalDistrictAmt = 0;
    this.doFundId = 0;
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

  onSave() {
    const params = {
      'DOFundId': this.doFundId,
      'AccHeadFundId': this.accFundId,
      'DCode': this.district,
      'DistrictFund': this.districtAmount,
      'AccYearId': this.year,
      'Flag': 1
    }
    this.restApiService.post(PathConstants.DOFundAllotment_Post, params).subscribe(res => {
      if (res) {
        var message = (this.doFundId === 0) ? ResponseMessage.SuccessMessage : ResponseMessage.UpdateMsg;
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


  // loadAmount() {
  //   this.budjetAmount = 0;
  //   if (this.year !== null && this.year !== undefined) {
  //     this.blockUI.start();
  //     const params = {
  //       'AccountingYearId': this.year
  //     }
  //     this.restApiService.getByParameters(PathConstants.HOFundAllotment_Get, params).subscribe(res => {
  //       if (res !== null && res !== undefined) {
  //         if (res.length !== 0) {
  //           res.forEach(res => {
  //             this.budjetAmount = (res.BudjetAmount !== null && res.BudjetAmount !== undefined) ? res.BudjetAmount : 0;
  //             this.hoFundId = res.HOFundId;
  //             this.blockUI.stop();
  //             /// load total district budget amt so far, if any districts have entered their budget
  //             this.blncAmount = 0;
  //             this.totalDistrictAmt = 0;
  //             if (this.blncAmount === 0) {
  //               this.blockUI.start();
  //               const data = {
  //                 'YearId': this.year,
  //                 'DCode': 0,
  //                 'Type': 1
  //               }
  //               this.restApiService.getByParameters(PathConstants.DOFundAllotment_Get, data).subscribe(res => {
  //                 if (res !== null && res !== undefined) {
  //                   if (res.length !== 0) {
  //                     res.forEach(res => {
  //                       this.totalDistrictAmt = (res.BalanceBudjetAmount !== undefined && res.BalanceBudjetAmount !== null)
  //                         ? (res.BalanceBudjetAmount * 1) : 0;
  //                       this.blockUI.stop();
  //                     })
  //                   } else {
  //                     this.blockUI.stop();
  //                     this.blncAmount = 0;
  //                   }
  //                 } else {
  //                   this.blockUI.stop();
  //                   this.blncAmount = 0;
  //                 }
  //                 this.blncAmount = this.budjetAmount - this.totalDistrictAmt;
  //               });
  //             }
  //           })
  //         } else {
  //           this.blockUI.stop();
  //         }
  //       } else {
  //         this.blockUI.stop();
  //       }
  //     });
  //   }
  //   this.loadDoFunds();
  // }

  // loadDoFunds() {
  //   this.hoAmount = 0;
  //   if (this.year !== undefined && this.year !== null && this.district !== null && this.district !== undefined) {
  //     this.blockUI.start();
  //     const data = {
  //       'YearId': this.year,
  //       'DCode': this.district,
  //       'Type': 2
  //     }
  //     this.restApiService.getByParameters(PathConstants.DOFundAllotment_Get, data).subscribe(res => {
  //       if (res !== null && res !== undefined) {
  //         if (res.length !== 0) {
  //           res.forEach(res => {
  //             this.hoAmount = res.DOBudjetAmount;
  //             this.blockUI.stop();
  //           })
  //         } else {
  //           this.blockUI.stop();
  //           this.hoAmount = 0;
  //         }
  //       } else {
  //         this.blockUI.stop();
  //         this.hoAmount = 0;
  //       }
  //     });
  //   }
  // }
  loadTable() {
    this.showTable = true;
    const params = {
      'AccountingYearId': this.year,
      'Type': 2
    }
    this.restApiService.getByParameters(PathConstants.AccHeadFundAllotment_Get, params).subscribe(res => {
      if (res) {
        res.Table.forEach(r => {
          this.accFundId = r.Id,
            this.accHeadId = r.AccHeadID,
            this.totalBudjetAmount = r.BudjetAmount
        })
        this.AccHeadData = res.Table;
      }
    })
  }
  // if (this.year !== null && this.year !== undefined) {
  //   this.blockUI.start();
  //   const params = {
  //     'AccountingYearId': this.year
  //   }
  //   this.restApiService.getByParameters(PathConstants.HOFundAllotment_Get, params).subscribe(res => {
  //     if (res !== null && res !== undefined) {
  //       if (res.length !== 0) {
  //         res.forEach(res => {
  //           this.totalBudjetAmount = (res.BudjetAmount !== null && res.BudjetAmount !== undefined) ? res.BudjetAmount : 0;
  //           this.
  //           //  this.hoFundId = res.HOFundId;
  //           this.blockUI.stop();
  //         })
  //       } else {
  //         this.blockUI.stop();
  //       }
  //     } else {
  //       this.blockUI.stop();
  //     }
  // })
  loadDoFunds() {
    if (this.accHeadId !== null && this.accHeadId !== undefined && this.district !== null && this.district !== undefined) {
      // to check available balance        
      const data = {
        'AccHeadFundId': this.FundId,
        'DCode': this.district,
        'YearId': this.year,
        'Type': 1
      }
      this.restApiService.getByParameters(PathConstants.DOFundAllotment_Get, data).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.Table.length !== 0) {
        //    this.doFundId = res[0].DOFundId;
            this.totalDistrictAmt = (res.Table[0].TotalDOBudjetAmount !== undefined && res.Table[0].TotalDOBudjetAmount !== null)
              ? (res.Table[0].TotalDOBudjetAmount * 1) : 0;
            this.blncAmount = this.budgetAmount - this.totalDistrictAmt;
          } else {
            this.blncAmount = this.budgetAmount;
          }
          if (res.Table1.length !== 0) {
            this.districtAmount = (res.Table1[0].AllotedAmount * 1);
          } else {
            this.districtAmount = 0;
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
    if (this.districtAmount !== undefined && this.districtAmount !== null &&
      this.blncAmount !== undefined && this.blncAmount !== null &&
      this.districtAmount !== NaN && this.blncAmount !== NaN) {
      if ((this.blncAmount * 1) < (this.districtAmount * 1)) {
        var msg = 'Entering amount should not be greater than available budget amount !';
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: msg
        });
        this.districtAmount = null;
      }
    }
  }

  onAdd(rowData) {
    this.showTransfer = true;
    this.accYear = rowData.ShortYear;
    this.groupType = rowData.GroupName;
    this.accHead = rowData.AccountHeadName;
    this.budgetAmount = rowData.Amount;
    this.FundId = rowData.Id;  //fund id from rowdata
  }

  clearForm() {
    this.districtOptions = [];
    this.districtAmount = 0;
    this.totalDistrictAmt = 0;
    this.blncAmount = 0;
  }
}

