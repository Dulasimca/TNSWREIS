import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-ho-fundmanagement',
  templateUrl: './ho-fundmanagement.component.html',
  styleUrls: ['./ho-fundmanagement.component.css']
})
export class HOFundmanagementComponent implements OnInit {

  goNumber: any;
  yearOptions: SelectItem[];
  Date: any;
  budjetAmount: any;
  year: any;
  years?: any;
  hoFundId: number;
  headAmount: number;
  accountHead: any;
  headOptions: SelectItem[];
  groupTypeOptions: SelectItem[];
  groupType: any;
  groupTypes?: any;
  accHeads? : any;
  accHeadOptions: SelectItem[];
  blncAmount: number;
  showFields: boolean;
  totalAccHeadAmount: number;






  @BlockUI() blockUI: NgBlockUI;

  @ViewChild('f', { static: false }) _hoFundForm: NgForm;
  
  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService,
    private _datePipe: DatePipe) { }

  ngOnInit(): void {
    this.years = this.masterService.getMaster('AY');
    this.restApiService.get(PathConstants.AccHeadType_Get).subscribe(res => {
      this.accHeads = res;
    });
    this.restApiService.get(PathConstants.GroupHeadType_Get).subscribe(res => {
      this.groupTypes = res;
    });
    this.totalAccHeadAmount = 0;
  }

  onSelect(type) {
    let yearSelection = [];
    let accSelection = [];
    let groupSelection = [];
    switch(type) {
      case 'AY':
    this.years.forEach(y => {
      yearSelection.push({ label: y.name, value: y.code });
    })
    this.yearOptions = yearSelection;
    this.yearOptions.unshift({ label: '-select', value: null });
        case 'AH':
              this.accHeads.forEach(a => {
                accSelection.push({ label:a.AccountHeadName, value: a.Id });
            })
            this.accHeadOptions = accSelection;
            this.accHeadOptions.unshift({ label: '-select', value: null });
        break;
        case 'GT':
          this.groupTypes.forEach(g => {
            groupSelection.push({ label:g.GroupName, value: g.Id });
        })
        this.groupTypeOptions = groupSelection;
        this.groupTypeOptions.unshift({ label: '-select', value: null });
    break;
      }
  }

  onSave() {
    // const params = {
    //   'Id': this.hoFundId,
    //   'AccYear': this.year,
    //   'GoNumber': this.goNumber,
    //   'GoDate': this._datePipe.transform(this.Date, 'dd-MM-yyyy'),
    //   'BudjetAmount': this.budjetAmount,
    //   'Flag': 1
    // }
    // this.restApiService.post(PathConstants.HOFundAllotment_Post, params).subscribe(res => {
    //   if (res) {
    //     var message = (this.hoFundId === 0) ? ResponseMessage.SuccessMessage : ResponseMessage.UpdateMsg;
    //     this.clearForm();
    //     this.messageService.clear();
    //     this.messageService.add({
    //       key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
    //       summary: ResponseMessage.SUMMARY_SUCCESS, detail: message
    //     });
    //   } else {
    //     this.messageService.clear();
    //     this.messageService.add({
    //       key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
    //       summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
    //     });
    //   }
    // })
 const params = {
   'Id': 0,
   'HoFundId': this.hoFundId,
   'AccYear': this.year,
   'GroupTypeId': this.groupType,
   'AccHeadId': this.accountHead,
   'Amount': this.headAmount,
   'Flag': 1
 }
 this.restApiService.post(PathConstants.AccHeadFundAllotment_Post, params).subscribe(res => {
  if (res) {
    var message = (this.hoFundId === 0) ? ResponseMessage.SuccessMessage : ResponseMessage.UpdateMsg;
    this.messageService.clear();
    this.messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
      summary: ResponseMessage.SUMMARY_SUCCESS, detail: message
    });
  }
})
  }

  loadData() {
    this.showFields = false;
    this.blockUI.start();
    const params = {
      'AccountingYearId': this.year
    }
    this.restApiService.getByParameters(PathConstants.HOFundAllotment_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if(res.length !== 0){
        res.forEach(res => {
          this.goNumber = res.GONumber;
          this.Date = new Date(res.GODate);
          this.budjetAmount = res.BudjetAmount;
          this.hoFundId = res.HOFundId;
        this.blockUI.stop();
          this.showFields = true;
        })
      }else {
        this.showFields = false;
        this.blockUI.stop();
      }
    }else {
      this.showFields = false;
        this.blockUI.stop();
      }
    })
  }
loadAmount() {
  const params = {
    'AccountingYearId': this.year,
    'Type': 1
  }
  this.restApiService.getByParameters(PathConstants.AccHeadFundAllotment_Get, params).subscribe(res => {
    if (res !== null && res !== undefined) {
      if (res.length !== 0) {
        res.forEach(res => {
          this.totalAccHeadAmount = (res.BalanceBudjetAmount !== undefined && res.BalanceBudjetAmount !== null)
            ? (res.BalanceBudjetAmount * 1) : 0;
          this.blockUI.stop();
        })
      } else {
        this.blockUI.stop();
        this.blncAmount = 0;
      }
    } else {
      this.blockUI.stop();
      this.blncAmount = 0;
    }
    // this.blncAmount = this.headAmount - this.totalAccHeadAmount;
  });
}
  checkBudjetAmount() {
    if (this.headAmount !== undefined && this.headAmount !== null &&
      this.blncAmount !== undefined && this.blncAmount !== null &&
      this.headAmount !== NaN && this.blncAmount !== NaN) {
      if ((this.blncAmount * 1) < (this.headAmount * 1)) {
        var msg = 'Entering amount should not be greater than available budjet amount !';
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: msg
        });
        this.headAmount = null;
      }
    }
  }

  clearForm() {
    this._hoFundForm.reset();
    this.yearOptions = [];
  }
}
