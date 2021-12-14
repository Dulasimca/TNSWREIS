import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-hostel-fund-management',
  templateUrl: './hostel-fund-management.component.html',
  styleUrls: ['./hostel-fund-management.component.css']
})
export class HostelFundManagementComponent implements OnInit {

  yearOptions: SelectItem[];
  year: any;
  years?: any;
  districtOptions: SelectItem[];
  district: any;
  districts?: any;
  taluk: any;
  taluks?: any;
  talukOptions: SelectItem[];
  hostelName: any;
  hostels?: any;
  hostelOptions: SelectItem[];
  talukAmount: any;
  hostelAmount: any;
  toFundId: number;
  hostelFundId: number;
  logged_user: User;
  blncAmount: number;
  totalHostelAmount: number;

  @ViewChild('f', { static: false }) _hostelFundForm: NgForm;
  @BlockUI() blockUI: NgBlockUI;

  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.logged_user = this.authService.UserInfo;
    this.years = this.masterService.getMaster('AY');
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.totalHostelAmount = 0;

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

  selectDistrict() {
    this.hostelName = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    const params = {
      'Type': 1,
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ?
        this.logged_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined) {
      this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
          this.hostels.forEach(h => {
            hostelSelection.push({ label: h.HostelName, value: h.Slno });
          })
          this.hostelOptions = hostelSelection;
          this.hostelOptions.unshift({ label: '-select', value: null });
        };
      })
    }
  }
  // to load taluk amount
  loadAmount() {
    this.hostelName = null;
    this.talukAmount = 0;
    if (this.year !== null && this.year !== undefined && this.taluk !== null && this.taluk !== undefined) {
      this.blockUI.start();
      const params = {
        'YearId': this.year,
        'TCode': this.taluk
      }
      this.restApiService.getByParameters(PathConstants.TOFundAllotment_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            res.forEach(r => {
              this.talukAmount = (r.TOBudjetAmount !== undefined && r.TOBudjetAmount !== null) ? r.TOBudjetAmount : 0;
              this.toFundId = r.TOFundId;
              this.blockUI.stop();
            })
            this.blncAmount = 0;
            this.totalHostelAmount = 0;
            if (this.blncAmount === 0) {
              this.blockUI.start();
              const data = {
                'YearId': this.year,
                'HCode': this.taluk,
                'Type': 1
              }
              this.restApiService.getByParameters(PathConstants.HostelFundAllotment_Get, data).subscribe(res => {
                if (res !== null && res !== undefined) {
                  if (res.length !== 0) {
                    res.forEach(res => {
                      this.totalHostelAmount = (res.BalanceBudjetAmount !== undefined && res.BalanceBudjetAmount !== null)
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
                this.blncAmount = this.talukAmount - this.totalHostelAmount;
              })
            }
          } else {
            this.blockUI.stop();
          }
        } else {
          this.blockUI.stop();
        }
      })
    }
    this.loadHostelFunds();
    this.selectDistrict();
  }

  onSubmit() {
    const params = {
      'Id': this.hostelFundId,
      'ToFundId': this.toFundId,
      'AccYear': this.year,
      'DCode': this.district,
      'TCode': this.taluk,
      'HCode': this.hostelName,
      'HostelBudjetAmount': this.hostelAmount,
      'Flag': 1
    }
    this.restApiService.post(PathConstants.HostelFundAllotment_Post, params).subscribe(res => {
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

  loadHostelFunds() {
    this.hostelAmount = null;
    if (this.year !== undefined && this.year !== null && this.hostelName !== null && this.hostelName !== undefined) {
      this.blockUI.start();
      const data = {
        'YearId': this.year,
        'HCode': this.hostelName,
        'Type': 2
      }
      this.restApiService.getByParameters(PathConstants.HostelFundAllotment_Get, data).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            res.forEach(res => {
              this.hostelAmount = res.HostelBudjetAmount;
              this.blockUI.stop();
            })
          } else {
            this.blockUI.stop();
            this.hostelAmount = 0;
          }
        } else {
          this.blockUI.stop();
          this.hostelAmount = 0;

        }
      });
    }
  }

  checkBudjetAmount() {
    if (this.hostelAmount !== undefined && this.hostelAmount !== null &&
      this.talukAmount !== undefined && this.talukAmount !== null &&
      this.hostelAmount !== NaN && this.talukAmount !== NaN) {
      if ((this.talukAmount * 1) < (this.hostelAmount * 1)) {
        var msg = 'Entering amount should not be greater than budjet amount !';
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: msg
        });
        this.hostelAmount = null;
      }
    }
  }

  clearForm() {
    this._hostelFundForm.reset();
    this.yearOptions = [];
    this.districtOptions = [];
    this.talukOptions = [];
    this.hostelOptions = [];
    this.totalHostelAmount = 0;
  }
}

