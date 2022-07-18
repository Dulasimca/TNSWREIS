import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-tashildar-mapping',
  templateUrl: './tashildar-mapping.component.html',
  styleUrls: ['./tashildar-mapping.component.css']
})
export class TashildarMappingComponent implements OnInit {

  district: any;
  districtOptions: SelectItem[];
  taluk: any;
  talukOptions: SelectItem[];
  SpecialDashildar: string;
  selectedType: number;
  districts?: any;
  taluks?: any;
  data: any = [];
  cols: any;
  tasildhars?: any = [];
  tashildarName: any;
  tashildarNameOptions: SelectItem[];
  RowId: any = 0;
  hostel: any;
  hostelOptions: SelectItem[] = [];
  login_user: User;
  disableFields: boolean = false;
  @ViewChild('f', { static: false }) tashildarMappingcontrol: NgForm;
  
  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService,
    private tableConstants: TableConstants, private _authService: AuthService) { }

  ngOnInit(): void {
    this.cols = this.tableConstants.TashildarMappingcols;
    this.login_user = this._authService.UserInfo;
    this.districts = this.masterService.getDistrictAll();
    this.taluks = this.masterService.getTalukAll();
    this.onView();
  }

  loadTasildhar() {
    this.taluk = null;
    this.talukOptions = [];
    this.tashildarName = null;
    this.tashildarNameOptions = [];
    this.restApiService.getByParameters(PathConstants.SpecialTashildar_Get, {'Dcode': this.district}).subscribe(response => {
      this.tasildhars = response.slice(0);
    })
  }

  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    let tashildarSelection = [];
    switch (type) {
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
          this.talukOptions.unshift({ label: '-select-', value: null });
          break;
          case 'TN':
          this.tasildhars.forEach(n => {
              tashildarSelection.push({ label: n.SplTashildarName, value: n.Slno });  
          })
          this.tashildarNameOptions = tashildarSelection;
          this.tashildarNameOptions.unshift({ label: '-select-', value: null });
          break;
    }  
  }

  onView() {
    this.data = [];
    this.restApiService.getByParameters(PathConstants.TashildarMapping_Get, {'type': 0}).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0){
        res.forEach(i => {
          i.Status = (i.Flag) ? 'Active' : 'Inactive';
        })
      this.data = res;
    }
    })
  }

  onSubmit() {
    const params = {
      'Id': this.RowId,
      'DistrictId':this.district,
      'TalukId': this.taluk,
      'HostelId': this.hostel,
      'TashildarName': this.tashildarName,
      'Flag': (this.selectedType * 1)
    }
    this.restApiService.post(PathConstants.TashildarMapping_Post, params).subscribe(res => {
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
      this.RowId = rowData.Id;
      this.tashildarName = rowData.TashildarName;
      this.tashildarNameOptions = [{ label: rowData.SplTashildarName, value: rowData.TashildarName}];
      this.district = rowData.DistrictId;
      this.districtOptions = [{ label: rowData.Districtname, value: rowData.DistrictId}];
      this.taluk = rowData.TalukId;
      this.talukOptions = [{ label: rowData.Talukname, value: rowData.TalukId}];
      this.hostel = rowData.HostelId;
      this.hostelOptions = [{ label: rowData.HostelName, value: rowData.HostelId }];
      this.selectedType = rowData.Flag ? 1 : 0;
      this.onInActiveCheck(rowData);
    }
  }

  refreshTaluk() {
    this.taluk = null;
    this.talukOptions = [];
  }

  onClear() {
    this.tashildarMappingcontrol.reset();
    this.tashildarMappingcontrol.form.markAsUntouched();
    this.tashildarMappingcontrol.form.markAsPristine();
    this.tashildarName = null;
    this.tashildarNameOptions = [];
    this.district = null;
    this.districtOptions = [];
    this.taluk = null;
    this.talukOptions = [];
    this.RowId = 0;
    this.hostel = null;
    this.hostelOptions = [];
    this.disableFields = false;
  }

  onDataChecking() {
    if(this.data.length !== 0) {
      for(let i = 0; i < this.data.length; i ++) {
        if((this.data[i].HostelId * 1) === (this.hostel * 1) 
        && (this.data[i].DistrictId * 1) === (this.district * 1) && this.data[i].Flag) {
          this.hostelOptions = [];
          this.hostel = null;
          this.taluk  = null;
          this.talukOptions = [];
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: 'Selected Hostel is already exist please select different hostel'
          })
          break;
        } else {
          continue;
        }
      }
    }
  }

  onInActiveCheck(rowData) {
    this.disableFields = false;
    if (this.data.length !== 0) {
      if (rowData.Flag) {
        //disable
        this.disableFields = true;
      } else {
        for (let i = 0; i < this.data.length; i++) {         
          if ((this.data[i].HostelId * 1) === (rowData.HostelId * 1) && this.data[i].Flag) {
            this.hostel = null;
            this.hostelOptions = [];
            this.taluk = null;
            this.talukOptions = [];
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
              summary: ResponseMessage.SUMMARY_WARNING, detail: 'Selected Hostel is already ACTIVE for ' + this.data[i].SplTashildarName
            })
            break;
          } else {
            continue;
          }
        }
      }
    }
  }

  loadHostelList() {
    this.hostel = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    const params = {
      'DCode': this.district,
      'TCode': this.taluk,
      'HostelId': (this.login_user.hostelId !== undefined && this.login_user.hostelId !== null) ? 
      this.login_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
    this.taluk !== null && this.taluk !== undefined && this.taluk !== 'All') {
      this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          res.Table.forEach(h => {
            hostelSelection.push({ label: h.HostelName, value: h.Slno });
          })
        }
      })
    }
    this.hostelOptions = hostelSelection;
    this.hostelOptions.unshift({ label: '-select-', value: null });
  }

}
