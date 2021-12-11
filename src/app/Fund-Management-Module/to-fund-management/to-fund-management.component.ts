import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-to-fund-management',
  templateUrl: './to-fund-management.component.html',
  styleUrls: ['./to-fund-management.component.css']
})
export class TOFundManagementComponent implements OnInit {
  talukAmount: any;
  Damount: any;
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

  @ViewChild('f', { static: false }) _toFundForm: NgForm;
  @BlockUI() blockUI: NgBlockUI;

  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.years = this.masterService.getMaster('AY');
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.totalTalukAmount = 0;
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
        })
        this.talukOptions = talukSelection;
        this.talukOptions.unshift({ label: '-select', value: null });
        break;
    }

  }
  // to load district amount
  loadAmount() {
    this.taluk = null;
    this.Damount = 0;
    if (this.year !== null && this.year !== undefined && this.district !== null && this.district !== undefined) {
      this.blockUI.start();
      const params = {
        'YearId': this.year,
        'DCode': this.district
      }
      this.restApiService.getByParameters(PathConstants.DOFundAllotment_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            res.forEach(r => {
              this.Damount = (r.DOBudjetAmount !== undefined && r.DOBudjetAmount !== null) ? r.DOBudjetAmount : 0;
              this.doFundId = r.DOFundId;
            this.blockUI.stop();
            })
          }else{
            this.blockUI.stop();
          }
        }else {
          this.blockUI.stop();

        }
        
      })
      this.blncAmount = 0;
      if(this.blncAmount === 0){
      this.blockUI.start();
      const data = {
        'YearId': this.year,
        'TCode': this.district,
        'Type': 1
      }
      this.restApiService.getByParameters(PathConstants.TOFundAllotment_Get, data).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            res.forEach(res => {
              this.totalTalukAmount = (res.BalanceBudjetAmount !== undefined && res.BalanceBudjetAmount !== null) 
                ? (res.BalanceBudjetAmount * 1) : 0;
                this.blockUI.stop();
              })
            }else {
              this.blockUI.stop();
              this.blncAmount = 0;
            }
          } else {
            this.blockUI.stop();
            this.blncAmount = 0;
          }
          this.blncAmount = this.Damount - this.totalTalukAmount;
      });
    }
    }
    this.loadToFunds();
  }

  onSave() {
    const params = {
      'Id': this.toFundId,
      'DoFundId': this.doFundId,
      'AccYear': this.year,
      'DCode': this.district,
      'TCode': this.taluk,
      'TOBudjetAmount': this.talukAmount,
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
    if (this.year !== undefined && this.year !== null && this.taluk !== null && this.taluk !== undefined) {
      this.blockUI.start();
      const data = {
        'YearId': this.year,
        'TCode': this.taluk,
        'Type':2
      }
      this.restApiService.getByParameters(PathConstants.TOFundAllotment_Get, data).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            res.forEach(res => {
              this.talukAmount = res.TOBudjetAmount;
              this.blockUI.stop();
            })
          } else {
            this.blockUI.stop();
            this.talukAmount = 0;
          } 
        } else {
          this.blockUI.stop();
          this.talukAmount = 0;
        
        }
      });
    }
  }

  checkBudjetAmount() {
    if (this.blncAmount !== undefined && this.blncAmount !== null &&
      this.talukAmount !== undefined && this.talukAmount !== null &&
      this.blncAmount !== NaN && this.talukAmount !== NaN) {
      if ((this.blncAmount * 1) < (this.talukAmount * 1)) {
        var msg = 'Entering amount should not be greater than available budjet amount !';
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: msg
        });
        this.talukAmount = null;
      }
    }
  }

  clearForm() {
    this._toFundForm.reset();
    this.districtOptions = [];
    this.talukOptions = [];
    this.yearOptions = [];
    this.totalTalukAmount = 0;
  }
}
