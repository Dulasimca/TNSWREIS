import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { HttpClient  } from '@angular/common/http';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MasterService } from 'src/app/services/master-data.service';
import { NgForm } from '@angular/forms';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpErrorResponse } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { User } from 'src/app/Interfaces/user';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-attendance-report',
  templateUrl: './attendance-report.component.html',
  styleUrls: ['./attendance-report.component.css']
})
export class AttendanceReportComponent implements OnInit {

  fromdate: Date = new Date();
  _districtname:string
  _taluknname:string
  _hostel:string
  attdrepthostelname:any
  districtOptions:SelectItem[];
  talukOptions:SelectItem[];
  Districtcode: number;
  Districtcodes?: any;
  TalukId: number;
  TalukIds?: any;
  disableTaluk: boolean = true;
  data:any;
  todate:Date = new Date();
  cols: any;

  hostelName: number;
  hostels?: any;
  hostelOptions: SelectItem[];
  role: number;
  districts?: any;
  taluks?: any;
  
  showDistrict: boolean;
  showTaluk: boolean;
  showHostelName: boolean;
  checkEmail: boolean;
  isDistrict : boolean;
  isTaluk:boolean;
  isHostel:boolean;
  login_user: User;

 

  constructor(private http: HttpClient, private restApiService: RestAPIService,
    private masterService: MasterService,private messageService: MessageService,private datepipe: DatePipe,private authService: AuthService) { }

  ngOnInit(): void {
    
    this.login_user = this.authService.UserInfo;
    this.Districtcode=this.login_user.districtCode;
    this.TalukId=this.login_user.talukId;
    this.hostelName=this.login_user.hostelId;
    this.role=this.login_user.roleId;
    this.selectHostelInfo();
    this.Districtcodes = this.masterService.getMaster('DT');
    this.TalukIds = this.masterService.getMaster('TK');
    this.cols = [
      {field:'AttendanceDate',header: 'Date'},
      {field:'DistrictName',header: 'District Name'},
      {field:'TalukName',header: 'Taluk Name'},
      {field:'HostelName',header: 'Hostel Name'},
      {field:'NOOfStudent',header: 'Total Student'},
      {field:'Remarks',header: 'Remarks'},
    ];
    this.DataChangeBasedonRole();
  }
  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    let hostelSelection = [];
    
    switch (type) {   
      case 'D':
          this.Districtcodes.forEach(d => {
            districtSelection.push({ label: d.name, value: d.code });
          })
          this.districtOptions = districtSelection;
          this.districtOptions.unshift({ label: 'All', value: 0 });
          if (this.Districtcode !== null && this.Districtcode !== undefined) {
            this.disableTaluk = false;
           } else {
             this.disableTaluk = true; 
           }
          break;
          case 'TK':
            this.TalukIds.forEach(t => {
              if (t.dcode === this.Districtcode){
              talukSelection.push({ label: t.name, value: t.code });
            }
            });
            this.talukOptions = talukSelection;
            this.talukOptions.unshift({ label: 'All', value: 0 });
            break;
            case 'HN':
              console.log(this.hostels);
              this.hostels.forEach(h => {
                hostelSelection.push({ label: h.HostelName, value: h.Slno });
              })
              this.hostelOptions = hostelSelection;
              this.hostelOptions.unshift({ label: 'All', value: 0 });
              break;
    }
    
  }
  selectHostelInfo() {
  let  hostelSelection = [];
    const params = {
      'Type': 1,
      'Value': this.Districtcode

    }
    if (this.Districtcode !== null && this.Districtcode !== undefined) {
      this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
        if (res !== null && res !== undefined && res.length !== 0) {
          if(this.role==4)
          {
           res.Table.forEach(d => {
            if (d.Slno === this.hostelName){
              hostelSelection.push({ label: d.HostelName, value: d.Slno });
            }
          });
  
            this.hostelOptions = hostelSelection;
        }
        else
        {
          this.hostels = res.Table;
        }
    
        };

      });
    }
  }

  DataChangeBasedonRole() {
    console.log("Roleid",this.role,this.Districtcode )
    console.log("District",this.Districtcodes )
  
    let districtSelection = [];
    let talukSelection = [];
    let hostelSelection = [];
    if (this.role != undefined && this.role !== null) {
      if (this.role === 4) {
        this.Districtcodes.forEach(d => {
          if (d.code === this.Districtcode){
          districtSelection.push({ label: d.name, value: d.code });
          }
        });
        this.districtOptions = districtSelection;

        this.TalukIds.forEach(d => {
          if (d.code === this.TalukId){
            talukSelection.push({ label: d.name, value: d.code });
          }
        });
        this.talukOptions = talukSelection;
        this.isDistrict = true;
        this.isTaluk = true;
        this.isHostel = true;

      } else if (this.role === 3) {
        this.Districtcodes.forEach(d => {
          if (d.code === this.Districtcode){
          districtSelection.push({ label: d.name, value: d.code });
          }
        });
        this.districtOptions = districtSelection;
        this.isDistrict = true;
        this.isTaluk = false;
        this.isHostel = false;

      } else if (this.role === 2) {
        
        this.Districtcodes.forEach(d => {
          if (d.code === this.Districtcode){
          districtSelection.push({ label: d.name, value: d.code });
          }
        });
        this.districtOptions = districtSelection;


        this.TalukIds.forEach(d => {
          if (d.code === this.TalukId){
            talukSelection.push({ label: d.name, value: d.code });
          }
        });
        this.talukOptions = talukSelection;
        this.isDistrict = false;
        this.isTaluk = false;
        this.isHostel = true;

      } else if (this.role === 1) {
        this.isDistrict = false;
        this.isTaluk = false;
        this.isHostel = false;
      } else {
        this.isDistrict = false;
        this.isTaluk = false;
        this.isHostel = false;
      }
    }
  }

 

  onview() {
    const params={
      'HostelID' : this.hostelName != undefined && this.hostelName != null ? this.hostelName : 0,	
     'Districtcode'	: this.Districtcode != undefined && this.Districtcode != null ? this.Districtcode : 0 ,
     'Talukid'		: this.TalukId != undefined && this.TalukId != null ? this.TalukId : 0 ,
    'FromDate'		:this.datepipe.transform(this.fromdate,'MM/dd/yyyy'), 
     'Todate'		:this.datepipe.transform(this.todate,'MM/dd/yyyy')
    }
    this.restApiService.getByParameters(PathConstants.Attendance_Get,params).subscribe(res => {
     if(res !== null && res !== undefined && res.length !==0) {
       this.data = res.Table;
     }

    
   });

}
showImage(Id)
{

}
}
