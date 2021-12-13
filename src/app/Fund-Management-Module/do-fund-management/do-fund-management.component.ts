import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
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
  budjetAmount: number;
  districtOptions: SelectItem[];
  districts?: any;
  district: any;
  hoAmount: number;
  doFundId: number;
  hoFundId: number;
  blncAmount: number;
  totalDistrictAmt: number;
  @ViewChild('f', { static: false }) _doFundForm: NgForm;
  @BlockUI() blockUI: NgBlockUI;


  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.years = this.masterService.getMaster('AY');
    this.districts = this.masterService.getMaster('DT');
    this.totalDistrictAmt = 0;
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
      'Id': this.doFundId,
      'HoFundId': this.hoFundId,
      'AccYear': this.year,
      'DCode': this.district,
      'DOBudjetAmount': this.hoAmount,
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

  loadAmount() {
    this.budjetAmount = 0;  
    if (this.year !== null && this.year !== undefined) {
    this.blockUI.start();
      const params = {
        'AccountingYearId': this.year
      }
      this.restApiService.getByParameters(PathConstants.HOFundAllotment_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            res.forEach(res => {
              this.budjetAmount = (res.BudjetAmount !== null && res.BudjetAmount !== undefined) ? res.BudjetAmount : 0;
              this.hoFundId = res.HOFundId;
              this.blockUI.stop();
            })
          }else {
            this.blockUI.stop();
          }
        }else{
          this.blockUI.stop();
        }
      });  
    }
      this.blncAmount = 0;
      if(this.blncAmount === 0){
      this.blockUI.start();
        const data = {
          'YearId': this.year,
          'DCode': 0,
          'Type': 1
        }
        this.restApiService.getByParameters(PathConstants.DOFundAllotment_Get, data).subscribe(res => {
          if (res !== null && res !== undefined) {
            if (res.length !== 0) {
              res.forEach(res => {
                this.totalDistrictAmt = (res.BalanceBudjetAmount !== undefined && res.BalanceBudjetAmount !== null) 
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
          this.blncAmount = this.budjetAmount - this.totalDistrictAmt;
        });
    }
     this.loadDoFunds();
}

  loadDoFunds() {
    this.hoAmount = null;
    if (this.year !== undefined && this.year !== null && this.district !== null && this.district !== undefined) {
      this.blockUI.start();
      const data = {
        'YearId': this.year,
        'DCode': this.district,
        'Type': 2
      }
      this.restApiService.getByParameters(PathConstants.DOFundAllotment_Get, data).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            res.forEach(res => {
              this.hoAmount = res.DOBudjetAmount;
        this.blockUI.stop();
            })
          } else {
            this.blockUI.stop();
            this.hoAmount = 0;
          } 
        } else {
          this.blockUI.stop();
          this.hoAmount = 0;
        } 
      });
    }
  }

  checkBudjetAmount() {
    if (this.hoAmount !== undefined && this.hoAmount !== null &&
      this.blncAmount !== undefined && this.blncAmount !== null &&
      this.hoAmount !== NaN && this.blncAmount !== NaN) {
      if ((this.blncAmount * 1) < (this.hoAmount * 1)) {
        var msg = 'Entering amount should not be greater than available budjet amount !';
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: msg
        });
        this.hoAmount = null;
      }
    }
  }

  clearForm() {
    this._doFundForm.reset();
    this.districtOptions = [];
    this.yearOptions = [];
    this.totalDistrictAmt = 0;
  }
}

