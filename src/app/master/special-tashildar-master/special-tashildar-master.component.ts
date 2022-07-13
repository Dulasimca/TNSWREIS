import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-special-tashildar-master',
  templateUrl: './special-tashildar-master.component.html',
  styleUrls: ['./special-tashildar-master.component.css']
})
export class SpecialTashildarMasterComponent implements OnInit {

  district: any;
  districtOptions: SelectItem[];
  taluk: any;
  talukOptions: SelectItem[];
  SpecialDashildar: string;
  mobileNo: any;
  emailId: string;
  data: any = [];
  checkEmail: boolean;
  cols: any;
  showTable: boolean;
  blockSpace: RegExp = /[^\s]/;
  districts?: any;
  taluks?: any;
  RowId: any = 0;
  isValidEmail: boolean;
  
  @ViewChild('f', { static: false }) specialTashildarcontrol: NgForm;
  constructor(private messageService: MessageService, private masterService: MasterService, private authService: AuthService,
    private restApiService: RestAPIService,  private tableConstants: TableConstants, private _confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.cols = this.tableConstants.SpecialTashildarcols;
    this.districts = this.masterService.getDistrictAll();
    this.taluks = this.masterService.getTalukAll();
    this.onView();
  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    switch (type) {
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;
        case 'T':
          // if(this.nativeDistrict !== undefined && this.nativeDistrict !== null) {
          //   this.disableTaluk = false;
  
          this.taluks.forEach(t => {
            if (t.dcode === this.district) {
              talukSelection.push({ label: t.name, value: t.code });
            }
          })
          this.talukOptions = talukSelection;
          this.talukOptions.unshift({ label: '-select-', value: null });
          break;

    }
    
  }

  onView() {
    this.data = [];
    this.restApiService.getByParameters(PathConstants.SpecialTashildar_Get, {'Dcode': 0}).subscribe(res => {
      this.data = res;
    })
  }

  onSubmit() {
    const isRecordExist = this.checkForDuplicate();
    if(isRecordExist) {
      this._confirmationService.confirm({
        message: 'You have already registered Do you want to change?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.onSave();
        },
        reject: () => {
          this.messageService.clear();
        }
    }) 
    } else {
      this.onSave();
    }
  }

  onSave() {
    const params = {
      'Slno': this.RowId,
      'DistrictId':this.district,
      'TalukId': this.taluk,
      'SplTashildarName': this.SpecialDashildar,
      'MobileNum': this.mobileNo,
      'EmailId': this.emailId,
      'Flag': 1
    }
    this.restApiService.post(PathConstants.SpecialTashildar_Post, params).subscribe(res => {
      if (res) {
        this.onClear();
        this.onView();
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    })
  }

  onEdit(rowData) {
    if (rowData !== null && rowData !== undefined) {
      this.RowId = rowData.Slno;
      console.log('row', this.RowId)
      this.district = rowData.DistrictId;
      this.districtOptions = [{ label: rowData.Districtname, value: rowData.DistrictId}];
      this.taluk  = rowData.TalukId;
      this.talukOptions = [{ label: rowData.Talukname, value: rowData.TalukId}];
      this.SpecialDashildar = rowData.SplTashildarName;
      this.mobileNo = rowData.MobileNum;
      this.emailId = rowData.EmailId;
    }
  }

  checkIfEmailExists() {
    if (this.emailId !== undefined && this.emailId !== null && this.emailId.trim() !== '' &&
      this.data.length !== 0) {
      this.checkEmail = true;
      const entered_email: string = this.emailId.trim();
      const substr = entered_email.split('@');
      if (substr !== undefined && substr.length > 1) {
        const last_str = substr[1].split('.');
        if (last_str !== undefined && last_str.length > 1) {
          if (last_str[1].toLowerCase() === 'com' || last_str[1].toLowerCase() === 'in') {
            this.data.forEach(i => {
              const email: string = i.EmailId;
              if (email.trim() === entered_email) {
                this.messageService.clear();
                this.messageService.add({
                  key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR, life: 2000,
                  summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.EmailAlreadyExists
                })
                this.checkEmail = false;
                this.emailId = '';
              } else {
                this.checkEmail = false;
              }
            })
          }
        }
      }
    }
  }

  refreshTaluk() {
    this.taluk = null;
    this.talukOptions = [];
  }

  onClear() {
    this.specialTashildarcontrol.reset();
    this.specialTashildarcontrol.form.markAsUntouched();
    this.specialTashildarcontrol.form.markAsPristine();
    this.district = null;
    this.districtOptions = [];
    this.taluk = null;
    this.talukOptions = [];
    this.mobileNo = null;
    this.emailId = null;
    this.RowId = 0;
  }

  checkForDuplicate(): boolean {
    let isExist = false;
    if(this.data.length !== 0) {
      for(let i = 0; i < this.data.length; i++) {
        console.log('cck', this.RowId)
        if((this.data[i].DistrictId * 1) === (this.district * 1) && 
        (this.data[i].TalukId * 1) === (this.taluk * 1) && this.RowId === 0) {
          this.RowId = this.data[i].Slno;
          isExist = true;
          break;
        } else {
          isExist = false;
          continue;
        }
      }
      console.log('ex', isExist)
      return isExist;
    }
  }
}
