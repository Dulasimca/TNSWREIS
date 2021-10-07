import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { MasterService } from 'src/app/services/master-data.service';

@Component({
  selector: 'app-hostelmaster',
  templateUrl: './hostelmaster.component.html',
  styleUrls: ['./hostelmaster.component.css']
})
export class HostelmasterComponent implements OnInit {
 
  Hostelname: string;
  Hosteltamilname: string;
  Hosteltype: string;
  Hosteltypes?: any;
  HosteltypeOptions: SelectItem[];
  DistrictcodeOptions: SelectItem[];
  Districtcode: any;
  Districtcodes?: any;
  TalukId: any;
  TalukIds?: any;
  TalukIdOptions: SelectItem[];
  Buildingno: any;
  Street: any;
  Landmark: string;
  upload: any;
  pincode: any;
  Longitude: any;
  Latitude: any;
  Radius: any;
  Totalstudent: any;
  mobileNo: any;
  daysOptions: SelectItem[];
  masterData?: any = [];
  days?: any = [];
  data?: any = [];
  Table2?: any;
  Slno: any;
  
  constructor(private http: HttpClient, private restApiService: RestAPIService,
    private masterService: MasterService) { }

  public ngOnInit(): void {

    this.Districtcodes = this.masterService.getMaster('DT');
    console.log('hostel', this.Districtcodes);
    this.Hosteltypes = this.masterService.getMaster('HT');
    console.log('hostel', this.Hosteltypes);

    this.TalukIds = this.masterService.getMaster('T');
    this.Slno = 0;
  }
  


  onSelect(type) {
    let hostelSelection = [];
    let districtSelection = [];
    let talukSelection = [];
    this.masterData = [];
    switch (type) {
      case 'HT':
        this.Hosteltypes.forEach(h => {
          hostelSelection.push({ label: h.name, code: h.code });
        });
        this.HosteltypeOptions = hostelSelection;
        break;
      case 'D':
        this.Districtcodes.forEach(d => {
          this.masterData.push({ label: d.name, value: d.code });
        })
        break;
      case 'T':
        this.TalukIds.forEach(t => {
          this.masterData.push({ label: t.name, code: t.code });
        })
        break;
        let classSelection = [];
        let sectionSelection = [];

      // switch (type) {
      //   case 'C':
      //     this.classes.forEach(c => {
      //       classSelection.push({ label: c.name, value: c.code })
      //     });
      //     this.classOptions = classSelection;
      //     this.classOptions.unshift({ label: '-select', value: null });
      //     break;

    }
  }
  onSubmit() {
    const params = {
      'Slno': this.Slno,
      'HostelName': this.Hostelname,
      'HostelNameTamil': this.Hosteltamilname,
      'HTypeId': this.Hosteltype,
      'Districtcode': this.Districtcode,
      'Talukid': this.TalukId,
      'BuildingNo': this.Buildingno,
      'Street': this.Street,
      'Landmark': this.Landmark,
      'Pincode': this.pincode,
      'Longitude': this.Longitude,
      'Latitude': this.Latitude,
      'Radius': this.Radius,
      'TotalStudent': this.Totalstudent,
      'Phone': this.mobileNo,
      'HostelImage': this.upload
    };
    this.restApiService.post(PathConstants.Hostel_Post, params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          //   this.blockUI.stop();
          //   this.clear();
          //   this.messageService.clear();
          //   this.messageService.add({
          //     key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          //     summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          //   });
          // } else {
          //   this.blockUI.stop();
          //   this.messageService.clear();
          //   this.messageService.add({
          //     key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          //     summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          //   });
          // }
          // } else {
          // this.messageService.clear();
          // this.messageService.add({
          //   key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          //   summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          // });
          // }
          // }, (err: HttpErrorResponse) => {
          // this.blockUI.stop();
          // if (err.status === 0 || err.status === 400) {
          //   this.messageService.clear();
          //   this.messageService.add({
          //     key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          //     summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          //   })
        }
      }
    })
  }
  onView() {
    const params = {
      'HTypeId': 1,
      'Talukid': 1
    }
    this.restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
      if (res !== null && res !== undefined && res.length !== 0) {
        console.log(res);
        this.data = res;
      }

    })
  }
  clear() {

  }


}
