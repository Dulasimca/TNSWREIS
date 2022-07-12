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
  selector: 'app-institute-master-entry',
  templateUrl: './institute-master-entry.component.html',
  styleUrls: ['./institute-master-entry.component.css']
})
export class InstituteMasterEntryComponent implements OnInit {

  district: any;
  instituteName: any;
  instituteCode: any;
  instituteType: any;
  address: any;
  instituteData: any = [];
  instituteCols: any;
  districtOptions: SelectItem[];
  instituteOptions: SelectItem[];
  loading: boolean;
  types?: any;
  districts?: any;
  selectedType: any;
  Id: any;
  @ViewChild('f', { static: false }) _institutemasterForm: NgForm;


  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService,
    private tableConstants: TableConstants) { }

  ngOnInit(): void {
    this.Id = 0;
    this.districts = this.masterService.getMaster('DT');
    this.types = this.masterService.getMaster('HF');
    this.instituteCols = this.tableConstants.InstituteMasterColumns;
  }

  onSelect(type) {
    let districtSelection = [];
    let institutionTypeSelection = [];
    switch (type) {
      case 'IT':
        this.types.forEach(r => {
          institutionTypeSelection.push({ label: r.name, value: r.type });
        })
        this.instituteOptions = institutionTypeSelection;
        this.instituteOptions.unshift({ label: '-select', value: null });
        break;
      case 'DT':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select', value: null });
        break;
    }
  }

  onSubmit() {
    const params = {
      'Id': this.Id,
      'Districtcode': this.district,
      'InstituteType': this.instituteType,
      'InstituteName': this.instituteName,
      'Address': this.address,
      'ICode': this.instituteCode,
      'Flag': (this.selectedType * 1)
    };

    this.restApiService.post(PathConstants.InstituteMasterEntry_Post, params).subscribe(res => {
      if (res) {
        // this.clearform();
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
    this.Id = rowData.Id;
    this.district = rowData.Districtcode;
    this.districtOptions = [{ label: rowData.Districtname, value: rowData.Districtcode }];
    this.instituteType = rowData.IType;
    this.instituteOptions = [{ label: rowData.InsitutionTypeName, value: rowData.IType }];
    this.instituteName = rowData.Name;
    this.address = rowData.Addressinfo;
    this.instituteCode = rowData.InstituteCode;
    this.selectedType =rowData.Flag;
  }

  onView() {
    this.instituteData = [];
    if (this.district !== null && this.district !== undefined) {
    this.loading = true;
      const params = {
        'Dcode': this.district
      }
      this.restApiService.getByParameters(PathConstants.Institute_Get, params).subscribe(res => {
        res.forEach(i => {
          i.status = (i.Flag) ? 'Active' : 'Inactive';
          i.HstlInstituteType = (i.IType === 1) ? 'School' : 'College'
        })
        this.instituteData = res;
        this.loading = false;
        this.clearform();
      })
    }
    else {
      this.loading = false;
      this.messageService.clear();
      this.messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
        summary: ResponseMessage.SUMMARY_ALERT, detail: ResponseMessage.SelectDistrict
      });
    }
  }

  clearform() {
     this._institutemasterForm.reset();
    // this._institutemasterForm.controls._institute.reset();
    // this._institutemasterForm.controls._institutecode.reset();
    // this._institutemasterForm.controls._institute.reset();
    // this._institutemasterForm.controls._institute.reset();

  }
}
