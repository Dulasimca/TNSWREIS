import { Component, ElementRef,OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';
import { textChangeRangeIsUnchanged } from 'typescript';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-hostel-go',
  templateUrl: './hostel-go.component.html',
  styleUrls: ['./hostel-go.component.css']
})
export class HostelGoComponent implements OnInit {
  Mslno: 0;
  Gono:any;
  GoDate: any;
  Remarks: any;
  logged_user: User;
  Totalstudent:any;
  

  Hostel: any;
  Hostels?: any;
  HostelOptions: SelectItem[];

 
  district: any;
  districts?: any;
  districtOptions: SelectItem[];
  


  Taluk:any;
  Taluks?:any;
  TalukIdOptions:SelectItem[];

  data:any;
  cols: any;

  disableTaluk: boolean = true;
  constructor(private restApiService: RestAPIService, private messageService: MessageService ,
                     private masterService: MasterService,private _datePipe: DatePipe, private authService: AuthService) { }

  ngOnInit(): void {

    this.districts = this.masterService.getMaster('DT');
    this.Taluks = this.masterService.getMaster('TK');
    this.logged_user = this.authService.UserInfo;
    this.cols = [
      {field: 'HostelID',header: 'Hostel ID'	},
      {field: 'HostelName',header: 'Hostel Name'},
      {field: 'GoNumber',header:'Go Number'},
      {field: 'GoDate',header:'Go Date'},
      {field: 'AllotmentStudent',header: 'Total Student'},
      {field: 'Districtname',header: 'District Name'},
      {field: 'Talukname',header: 'Taluk Name'},
      {field: 'Remarks',header: 'Remarks'},
    ];
    
  }
  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    
    switch (type) {
      case 'DT':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select-', value: null });
       
        if (this.district.value !== null && this.district.value !== undefined) {
          this.disableTaluk = false;
           this.Hostelfilter()
        } else {
          this.disableTaluk = true;
        }
        break;
        case 'TK':
          if (this.district.value !== undefined && this.district.value !== null) {
            this.Taluks.forEach(t => {
              if (t.dcode === this.district.value) {
                talukSelection.push({ label: t.name, value: t.code });
              }
            })
            this.TalukIdOptions = talukSelection;
            this.TalukIdOptions.unshift({ label: '-select-', value: null });
          }
         
          break;
         
    }
  }
  onSave() {
    const params =  {
      'Slno'	:		this.Mslno,
      'hostelid': this.Hostel.value,
      'Districtcode': this.district.value,      
      'Talukid': this.Taluk.value,
      'GoNo': this.Gono,
      'GoDate': this._datePipe.transform(this.GoDate, 'yyyy-MM-dd'),
      'Remarks': this.Remarks,
      'TotalStudent': this.Totalstudent,
      'Flag' : true
    };
    this.restApiService.post(PathConstants.Hostelgo_post,params).subscribe(res => {
      if (res) {
        console.log('s',res);
        this.clearform();
      
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
  clearform() {
     this.Gono = '',
     this.Remarks = '',
     this.Totalstudent =''
     
  }
  onView() {
    const params = {
      'DCode' : this.logged_user.districtCode,
      'TCode' : this.logged_user.talukId,
      'Value': this.logged_user.hostelId
    }
    this.restApiService.getByParameters(PathConstants.Hostelgo_Get, params).subscribe(res => {
     if(res !== null && res !== undefined && res.length !==0) {
       this.data = res.Table;
     }     
   });
 }

 Hostelfilter() {
    const Params = {
      'Type'	:		1,
      'Value': this.district.value,
      }
  this.restApiService.getByParameters(PathConstants.Hostel_Get,Params).subscribe(res => {
   if(res !== null && res !== undefined && res.length !==0) {
     this.Hostels = res.Table;
     let HostelSelection = [];
     this.Hostels.forEach(t => {
          HostelSelection.push({ label: t.HostelName, value: t.Slno });
      })
      this.HostelOptions = HostelSelection;
      this.HostelOptions.unshift({ label: '-select-', value: null });
      console.log(this.Hostels)
   }     
 });
}

 onRowSelect(event, selectedRow) {
  this.Mslno = selectedRow.RID;
  this.Gono = selectedRow.GoNumber;
  this.GoDate = this._datePipe.transform(selectedRow.GoDate, 'MM/dd/yyyy');
  this.Remarks = selectedRow.Remarks;
  this.Totalstudent = selectedRow.AllotmentStudent;
  this.districtOptions= [{ label: selectedRow.Districtname, value: selectedRow.Districtname }];
  this.TalukIdOptions= [{ label: selectedRow.Talukname, value: selectedRow.Talukname }];
  this.HostelOptions= [{ label: selectedRow.HostelName, value: selectedRow.Slno }];
}
}




