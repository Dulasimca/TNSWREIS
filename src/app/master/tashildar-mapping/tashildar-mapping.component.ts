import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
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
  tname?: any = [];
  tashildarName: any;
  tashildarNameOptions: SelectItem[];
  RowId: any = 0;

  @ViewChild('f', { static: false }) tashildarMappingcontrol: NgForm;
  
  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService,
    private tableConstants: TableConstants) { }

  ngOnInit(): void {
    this.cols = this.tableConstants.TashildarMappingcols;
    this.districts = this.masterService.getDistrictAll();
    this.taluks = this.masterService.getTalukAll();
    this.restApiService.get(PathConstants.SpecialTashildar_Get).subscribe(tashildarName => {
      this.tname = tashildarName.slice(0);
    })
    this.onView();
    this.onDataChecking();
    this.onDistrictChecking();
    this.onNameChecking();
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
          this.tname.forEach(n => {
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
          i.status = (i.Flag) ? 'Active' : 'Inactive';
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
      this.selectedType = rowData.Flag;
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
  }

  onDataChecking() {
    if(this.data.length !== 0) {
      for(let i = 0; i < this.data.length; i ++) {
        if((this.data[i].TalukId * 1) === (this.taluk * 1)) {
          this.tashildarName = this.data[i].SplTashildarName;
          this.district =this.data[i].DistrictId;
          this.taluk =this.data[i].TalukId;  
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: 'Selected Taluk is already exist please select different taluk'
          })
          break;
        } else {
          continue;
        }
      }
    }
  }

  onDistrictChecking() {
    if(this.data.length !== 0) {
      for(let i = 0; i < this.data.length; i ++) {
        if((this.data[i].DistrictId * 1) === (this.district * 1)) {
          this.tashildarName = this.data[i].SplTashildarName;
          this.district =this.data[i].DistrictId;
          this.taluk =this.data[i].TalukId;  
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: 'Selected District is already exist please select different district'
          })
          break;
        } else {
          continue;
        }
      }
    }
  }

  onNameChecking() {
    if(this.data.length !== 0) {
      for(let i = 0; i < this.data.length; i ++) {
        if((this.data[i].TashildarName * 1) === (this.tashildarName * 1)) {
          this.tashildarName = this.data[i].SplTashildarName;
          this.district =this.data[i].DistrictId;
          this.taluk =this.data[i].TalukId;  
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: 'Selected Name is already exist please select different name'
          })
          break;
        } else {
          continue;
        }
      }
    }
  }

}
