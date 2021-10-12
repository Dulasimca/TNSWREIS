import { Component, ElementRef,OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-hostelgo',
  templateUrl: './hostelgo.component.html',
  styleUrls: ['./hostelgo.component.css']
})
export class HostelgoComponent implements OnInit {
  Mslno: 0;
  Gono:any;
  GoDate: any;
  Remarks: any;
 
  Totalstudent:any;
  Hostelname: string;

  HostelID: string;
  Hostels?: any;
  HostelOptions: SelectItem[];

  districtOptions: SelectItem[];
  district: any;
  districts?: any;
  


  Taluk:any;
  Taluks?:any;
  TalukIdOptions:SelectItem[];

  data:any;
  cols: any;

  disableTaluk: boolean = true;
  constructor(private restApiService: RestAPIService, private messageService: MessageService ,
                     private masterService: MasterService,private _datePipe: DatePipe) { }

  ngOnInit(): void {

    this.districts = this.masterService.getMaster('DT');
    this.Taluks = this.masterService.getMaster('TK');

    this.cols = [
      {field: 'RID',header: 'ID'},
      {field: 'HostelID',header: 'HostelID'	},
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
      'hostelid': '1',
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
    this.restApiService.get(PathConstants.Hostelgo_Get).subscribe(res => {
     if(res !== null && res !== undefined && res.length !==0) {
       this.data = res.Table;
      
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
 
  
}
}




