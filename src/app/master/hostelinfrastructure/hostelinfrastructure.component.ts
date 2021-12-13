import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-hostelinfrastructure',
  templateUrl: './hostelinfrastructure.component.html',
  styleUrls: ['./hostelinfrastructure.component.css']
})
export class HostelinfrastructureComponent implements OnInit {

  login_user: any;
  hostelname: string;
  districtname: any;
  talukname: string;
  TotalArea:any;
  BuildingArea:any;
  NoOfFloor:any;
  NoOfRoom:any;
  Kitchen:any;
  Bathroom:any;
  data:any;
  cols:any;
  disableFields: boolean;
  hostelinfras:any;
  Districtcode:any;
  Talukid:any;
  HostelId:any;
  CreatedDate:Date;
  hostelinfraId = 0;
 @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) hostelinfrastructure: NgForm;

  constructor(private http: HttpClient, private restApiService: RestAPIService,
    private masterService: MasterService,  private messageService: MessageService, private _authService: AuthService,  
    private _restApiService: RestAPIService, private _messageService: MessageService 
  ) { }

  ngOnInit(): void 
  {
    this.login_user = this._authService.UserInfo;
    this.districtname = this.login_user.districtName;
    this.talukname = this.login_user.talukName;
    this.hostelname = this.login_user.hostelName;

    this.Districtcode = this.login_user.districtCode;
    this.Talukid = this.login_user.talukId;
    this.HostelId = this.login_user.hostelId;
    this.disableFields = true;
    this.onview();


    this.cols = [

      
      { field: 'Districtname', header: 'District' },
      { field: 'Talukname', header: 'Taluk' },
      { field: 'HostelName', header: 'Hostel' },
      { field: 'TotalArea', header: 'Total Area' },
      { field: 'BuildingArea', header: 'Building Area' },
      { field: 'NoOfFloor', header: 'No Of Floor' },
      { field: 'NoOfRoom', header: 'No Of Room' }, 
      { field: 'Kitchen', header: 'Kitchen' },
      { field: 'Bathroom', header: 'Bathroom' },
      { field: 'CreatedDate', header: 'Created Date' },
    ]
  }

  onSubmit()
  {
    this.blockUI.start();
    const params = {
      'Id': this.hostelinfraId,
      'Districtcode':  this.Districtcode,
      'Talukid': this.Talukid,
      'HostelId': this.HostelId,
      'TotalArea': this.TotalArea,
      'BuildingArea': this.BuildingArea,
      'NoOfFloor': this.NoOfFloor,
      'NoOfRoom': this.NoOfRoom,
      'Kitchen': this.Kitchen,
      'Bathroom': this.Bathroom,
      'Flag': 1,
    };
   //console.log(params)
    this.restApiService.post(PathConstants.HostelInfraStructure_Post,params).subscribe(res => {
      console.log(res)
      if (res !== undefined && res !== null) {
        if (res) {
          this.blockUI.stop();
         
          this.onClear();
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });
          
        } else {
          this.blockUI.stop();
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          });
        }
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockUI.stop();
      if (err.status === 0 || err.status === 400) {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
  
      }
    })
   
  }
  
  onview() {
   
  
      const params = {
        'Districtcode'	: this.Districtcode,
        'Talukid'	: this.Talukid ,
        'HostelId'	: this.HostelId
    };
    // this.restApiService.getByParameters(PathConstants.HostelInfraStructure_Get,params).subscribe(res => {
    //   if (res !== null && res !== undefined && res.length !== 0) {
    //     this.data = res.Table;
    //     this.districtname = this.login_user.districtName;
    //       this.talukname = this.login_user.talukName;
    //       this.hostelname = this.login_user.hostelName;
      
    //       this.Districtcode = this.login_user.districtCode;
    //       this.Talukid = this.login_user.talukId;
    //       this.HostelId = this.login_user.hostelId;
    //   }
    // });

    this.restApiService.getByParameters(PathConstants.HostelInfraStructure_Get,params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if (res.Table.length !== 0) {
            this.disableFields = true;
            res.Table.forEach(r => {
          
          })
          this.data = res.Table;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_INFO,
            summary: ResponseMessage.SUMMARY_ALERT, life: 4000,
            detail: 'Existing Data for ' + this.hostelname
          })
        } else {
          this._messageService.clear();
          this.disableFields = false;
        }
      } else {
        this._messageService.clear();
        this.disableFields = false;
      }
    }) 
    }
    onClear()
    {
     this.hostelinfraId = 0;
     this.Kitchen='';
     this.NoOfFloor='';
     this.NoOfRoom='';
     this.TotalArea='';
     this.BuildingArea='';
     this.Bathroom='';
     this.disableFields = true;
    }
onRowSelect(event, selectedRow)
{
  console.log(selectedRow)
  this.hostelinfraId = selectedRow.Id;
  this.hostelname = selectedRow.HostelName;
  this.districtname =selectedRow.Districtname;
  this.talukname = selectedRow.Talukname;
  this.TotalArea = selectedRow.TotalArea;
  this.BuildingArea = selectedRow.TotalArea;
  this.NoOfFloor = selectedRow.NoOfFloor;
  this.NoOfRoom = selectedRow.NoOfRoom;
  this.Kitchen = selectedRow.Kitchen;
  this.Bathroom = selectedRow.Bathroom;
  this.HostelId = selectedRow.HostelId;
  this.disableFields = false;
}
}
