import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-biometricattendance',
  templateUrl: './biometricattendance.component.html',
  styleUrls: ['./biometricattendance.component.css']
})
export class BiometricattendanceComponent implements OnInit {

  district: any;
  taluk: any;
  hostelName: any;
  hostel: any;
  
  districtOptions: SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];

  districts?: any;
  taluks?: any;
  hostels?: any;

  logged_user: User;

  toDate: any;
  fromDate: any;

  // MonthYear:any;
  data: any;
  hostelRowId: any;
  Hostelname: any;
  Districtcode: any;
  TalukId: any;
  Totalstudent: any;
  cols: any[];
  hostelId: any;

  Studentdetails?: any = [];
  Studentsdetail: any;
  Studentsdetaildata: any[] = [];

  biometricattendancecountCols: any;
  biometricattendancecountData: any = [];
  loading: boolean;
  datepipe: any;
  
    MonthYear:any;
    Mmonth : any;
    Myear : any;

    BMAttendanceReportCols: any;
   BMAttendanceData: any = [];
   showDialog: boolean;
  

  constructor(private masterService: MasterService, private restApiService: RestAPIService, private _tableConstants: TableConstants,
    private _messageService: MessageService, private _authService: AuthService, private _datePipe: DatePipe,private _router: Router) { }

  ngOnInit(): void {
    this.biometricattendancecountCols = this._tableConstants.biometricattendancecountColumns
    this.BMAttendanceReportCols = this._tableConstants.BMAttendanceReportCols
    this.cols = [
      { field: 'Districtname', header: 'District', width: '100px'},
     { field: 'Talukname', header: 'Taluk', width: '100px'},
     { field: 'HostelName', header: 'Hostel Name', width: '100px'},
     { field: 'TotalStudent', header: 'Total Student', width: '100px'},
     { field: 'monyr', header: 'Month/Year', width: '100px'},
    ];
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.logged_user = this._authService.UserInfo;
     
    // this.biometricattendancecountCols = [
    
    //   { field: 'SerialNumber', header: 'Machine Serial No', width: '100px', align: 'center !important'},
    //   { field: 'AttendanceDate', header: 'Date', width: '100px', align: 'center !important'},
    //   { field: 'StudentCount', header: 'Student Count', width: '100px', align: 'center !important'},


    // ]

  }

  onSelect(value) {
    let districtSelection = [];
    let talukSelection = [];
    if (this.logged_user.roleId !== undefined && this.logged_user.roleId !== null) {
      switch (value) {
        case 'D':
          this.districts.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          if ((this.logged_user.roleId * 1) === 1) {
            this.districtOptions.unshift({ label: 'All', value: 0 });
          }
          this.districtOptions.unshift({ label: '-select-', value: 'null' });
          break;
        case 'T':
            this.taluks.forEach(t => {
              if (t.dcode === this.district) {
                talukSelection.push({ label: t.name, value: t.code });
              }
            })
            this.talukOptions = talukSelection;
            if ((this.logged_user.roleId * 1) === 1 || (this.logged_user.roleId * 1) === 2) {
              this.talukOptions.unshift({ label: 'All', value: 0 });
            }
            this.talukOptions.unshift({ label: '-select-', value: 'null' });
          break;
         
      }
    }
  }
 


  refreshFields(value) {
    if(value === 'D') {
      this.taluk = null;
      this.talukOptions = [];
    }
      this.loadHostelList();
  }
  loadHostelList() {
    this.hostel = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    const params = {
      'DCode': this.district,
      'TCode': this.taluk,
      // 'HostelId': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ? 
      // this.logged_user.hostelId : 0,
    }
    if (this.district !== null && this.district !== undefined && this.district !== 'All' &&
    this.taluk !== null && this.taluk !== undefined && this.taluk !== 'All') {
      this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          this.hostels = res.Table;
          this.hostels.forEach(h => {
            hostelSelection.push({ label: h.HostelName, value: h.Slno });
          })
        }
      })
    }
    this.hostelOptions = hostelSelection;
    if((this.logged_user.roleId * 1) !== 4) {
      this.hostelOptions.unshift({ label: 'All', value: 0 });
    }
    this.hostelOptions.unshift({ label: '-select-', value: null });
  }


  onview()
  { 
    this.data = [];
    const params = {
      'Type':'0',
      'DCode': this.district,
      'TCode': this.taluk,
      // 'HostelId': (this.logged_user.hostelId !== undefined && this.logged_user.hostelId !== null) ? 
      // this.logged_user.hostelId : 0,
    }
    this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        this.data = res.Table;
      }  else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
        })
      }
    });
}

onRowSelect(event, selectedRow) {

}

onEdit() {
   //this._router.navigate(['/BiometricAttendance'])
  this.showDialog=true;
 
  const params = {
      'Adate':'01/31/2022',
      'HostelId':'55'
  }
  //this.restApiService.get(PathConstants.BioMetricAttendance_Get).subscribe(res => {old
    this.restApiService.getByParameters(PathConstants.BioMetricAttendance_Get,params).subscribe(res => {
    if (res.Table !== undefined && res.Table !== null) {
      if (res.Table.length !== 0) {
        this.BMAttendanceData = res.Table;
        this.loading = false;
      } else {
        this.loading = false;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
        })
      }
    } else {
      this.loading = false;
      this._messageService.clear();
      this._messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
        summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
      })
    }
  })

}
  
  

loadTable() {
  this.biometricattendancecountData = [];
    this.loading = true;
    this.Mmonth = this._datePipe.transform(this.MonthYear, 'MM');
    this.Myear = this._datePipe.transform(this.MonthYear, 'yyyy');
    const params = {
        'serialno':'BJ2C192661709',
        'month': parseInt(this.Mmonth),
        'year':  this.Myear
    }
    this.restApiService.getByParameters(PathConstants.GetBDAttendancecount_Get,params).subscribe(res => {
      if (res.Table !== undefined && res.Table !== null) {
        if (res.Table.length !== 0) {
          this.biometricattendancecountData = res.Table;
          this.loading = false;
        } else {
          this.loading = false;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          })
        }
      } else {
        this.loading = false;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
        })
      }
    })
  
}


// getbmserialnumber() {
//   this.biometricattendancecountData = [];
    
   
//     const params = {
//         'hostelid':this.hostelOptions.values
       
//     }
//     this.restApiService.getByParameters(PathConstants.GetBDAttendancecount_Get,params).subscribe(res => {
//       if (res.Table !== undefined && res.Table !== null) {
//         if (res.Table.length !== 0) {
//           this.biometricattendancecountData = res.Table;
//           this.loading = false;
//         } else {
//           this.loading = false;
//           this._messageService.clear();
//           this._messageService.add({
//             key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
//             summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
//           })
//         }
//       } else {
//         this.loading = false;
//         this._messageService.clear();
//         this._messageService.add({
//           key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
//           summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
//         })
//       }
//     })
  


// }

}




