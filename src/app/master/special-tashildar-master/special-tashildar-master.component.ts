import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
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
    private restApiService: RestAPIService,  private tableConstants: TableConstants) { }

  ngOnInit(): void {
    this.cols = this.tableConstants.SpecialTashildarcols;
    this.districts = this.masterService.getDistrictAll();
    this.taluks = this.masterService.getTalukAll();
    
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
    this.showTable = true;
    this.restApiService.get(PathConstants.SpecialTashildar_Get).subscribe(res => {
      this.data = res;
    })
    this.messageService.clear();
    this.messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
      summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
    })
  }

  onSubmit() {
    const params = {
      'Slno': this.RowId,
      'DistrictId':this.district,
      'TalukId': this.taluk,
      'SplTashildarName': this.SpecialDashildar,
      'MobileNum': this.mobileNo,
      'EmailId': this.emailId,
      'Flag': 1
    }
    console.log('enter')
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
      this.district = rowData.DistrictId;
      this.districtOptions = [{ label: rowData.Districtname, value: rowData.DistrictId}];
      this.taluk  = rowData.TalukId;
      this.talukOptions = [{ label: rowData.Talukname, value: rowData.TalukId}];
      this.SpecialDashildar = rowData.SplTashildarName;
      this.mobileNo = rowData.MobileNum;
      this.emailId = rowData.EmailId;
    }
  }

  validateEmail() {
    var regex = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
    if(this.emailId !== undefined && this.emailId !== null) {
      var str: string = this.emailId;
      if(str.match(regex)) {
        this.isValidEmail = false;
      } else {
        this.isValidEmail = true;
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
    this.specialTashildarcontrol = null;
    this.mobileNo = null;
    this.emailId = null;
    this.RowId = 0;
  }

}
