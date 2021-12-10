import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
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
  @ViewChild('f', { static: false }) _doFundForm: NgForm;

  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService) { }

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
      const params = {
        'AccountingYearId': this.year
      }
      this.restApiService.getByParameters(PathConstants.HOFundAllotment_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            res.forEach(res => {
              this.budjetAmount = (res.BudjetAmount !== null && res.BudjetAmount !== undefined) ? res.BudjetAmount : 0;
              this.hoFundId = res.HOFundId;
            })
          }
        }
      });
    }
    this.loadDoFunds();
  }

  loadDoFunds() {
    if (this.year !== undefined && this.year !== null && this.district !== null && this.year !== undefined) {
      const data = {
        'YearId': this.year,
        'DCode': this.district
      }
      this.restApiService.getByParameters(PathConstants.DOFundAllotment_Get, data).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            res.forEach(res => {
              this.hoAmount = res.DOBudjetAmount;
            })
          }
        }
      });
    }
  }

  checkBudjetAmount() {
    if (this.hoAmount !== undefined && this.hoAmount !== null &&
      this.budjetAmount !== undefined && this.budjetAmount !== null &&
      this.hoAmount !== NaN && this.budjetAmount !== NaN) {
      if ((this.budjetAmount * 1) < (this.budjetAmount * 1)) {
        var msg = 'Entering amount should not be greater than budjet amount !';
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
  }
}

