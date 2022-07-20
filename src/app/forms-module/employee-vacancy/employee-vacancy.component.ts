import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-employee-vacancy',
  templateUrl: './employee-vacancy.component.html',
  styleUrls: ['./employee-vacancy.component.css']
})
export class EmployeeVacancyComponent implements OnInit {
  districtOptions: SelectItem[];
  district: number;
  talukOptions: SelectItem[];
  taluk: number;
  hostelOptions: SelectItem[];
  hostel: number;
  districts?: any = [];
  taluks?: any = [];
  designations?: any = [];
  designation: string;
  designationOptions: SelectItem[];
  sanction: number;
  filled: number;
  vacancy: number;
  vacantFromDate: Date;
  reason: string = "";
  maxDate: Date = new Date();
  EmpVacancyId: any = 0;
  isSubmitted: boolean = false;
  employeeVacancyCols: any;
  employeeVacancyData: any[] = [];
  loading: boolean;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _employeeVacancyForm: NgForm;
  constructor(private _masterService: MasterService, private _restApiService: RestAPIService,
    private _messageService: MessageService, private _tableConstants: TableConstants,
    private _datepipe: DatePipe) { }

  ngOnInit(): void {
    this.districts = this._masterService.getDistrictAll();
    this.taluks = this._masterService.getTalukAll();
    this.employeeVacancyCols = this._tableConstants.EmployeeVacancyDetailcolumns;
    this._restApiService.get(PathConstants.EmployeeDesignation_Get).subscribe(designations => {
      this.designations = designations.slice(0);
    })
  }

  onSelect(value) {
    let districtSelection = [];
    let talukSelection = [];
    let designationSelection = [];
    switch (value) {
      case 'DT':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection.slice(0);
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;
      case 'TK':
        if (this.district !== undefined && this.district !== null) {
          this.taluks.forEach(t => {
            if (t.dcode === this.district) {
              talukSelection.push({ label: t.name, value: t.code });
            }
          })
          this.talukOptions = talukSelection.slice(0);
          this.talukOptions.unshift({ label: '-select-', value: null });
        }
        break;
      case 'DG':
        this.designations.forEach(d => {
          designationSelection.push({ label: d.Name, value: d.Id });
        });
        this.designationOptions = designationSelection.slice(0);
        this.designationOptions.unshift({ label: '-select-', value: null });
        break;
    }
  }

  refreshFields(value) {
    if (value === 'DT') {
      this._employeeVacancyForm.form.controls['_taluk'].reset();
      this._employeeVacancyForm.form.controls['_hostel'].reset();
      this.taluk = null;
      this.talukOptions = [];
      this.hostel = null;
      this.hostelOptions = [];
    } else {
      this._employeeVacancyForm.form.controls['_hostel'].reset();
      this.hostel = null;
      this.hostelOptions = [];
      this.loadHostelList();
    }
  }


  loadHostelList() {
    this.hostel = null;
    this.hostelOptions = [];
    let hostelSelection = [];
    if (this.district !== null && this.district !== undefined && this.taluk !== undefined && this.taluk !== null) {
      const params = {
        'DCode': this.district,
        'TCode': this.taluk,
      }
      if (this.district !== null && this.district !== undefined &&
        this.taluk !== null && this.taluk !== undefined) {
        this._restApiService.getByParameters(PathConstants.Hostel_Get, params).subscribe(res => {
          if (res !== null && res !== undefined && res.length !== 0) {
            res.Table.forEach(h => {
              hostelSelection.push({ label: h.HostelName, value: h.Slno, gender: h.HGenderType, type: h.HostelFunctioningType });
            })
          }
        })
      }
      this.hostelOptions = hostelSelection;
      this.hostelOptions.unshift({ label: '-select-', value: null });
    }
  }

  calculateVacancy() {
    if (this.sanction !== undefined && this.sanction !== null && this.filled !== undefined && this.filled !== null) {
      this.vacancy = this.sanction - this.filled;
      console.log('vaca', this.vacancy)
    }
  }

  onSubmit() {
    this.isSubmitted = true;
    this.blockUI.start();
    const params = {
      'EmployeeVacanyId': this.EmpVacancyId,
      'DCode': this.district,
      'TCode': this.taluk,
      'HCode': this.hostel,
      'DesignationId': this.designation,
      'SanctionNo': this.sanction,
      'FilledNo': this.filled,
      'VacancyNo': this.vacancy,
      'VacantDate': this.vacantFromDate,
      'Reason': this.reason
    }
    this._restApiService.post(PathConstants.EmployeeVacancy_Post, params).subscribe(response => {
      if (response !== undefined && response !== null) {
        if (response) {
          this.blockUI.stop();
          this.isSubmitted = false;
          this.onClear(2);
          this.onView();
          this._messageService.clear();
          this._messageService.add({
            key: 'd-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          })
        } else {
          this.isSubmitted = false;
          this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          })
        }
      } else {
        this.isSubmitted = false;
        this.blockUI.stop();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    }, (err: HttpErrorResponse) => {
      this.isSubmitted = false;
      this.blockUI.stop();
      if (err.status === 0 || err.status === 400) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      }
    })
  }

  onView() {
    this.employeeVacancyData = [];
    if (this.district !== undefined && this.district !== null &&
      this.taluk !== undefined && this.taluk !== null &&
      this.hostel !== undefined && this.hostel !== null) {
      this.loading = true;
      const params = {
        'HCode': this.hostel,
        'TCode': this.taluk,
        'DCode': this.district
      }
      this._restApiService.getByParameters(PathConstants.EmployeeVacancy_Get, params).subscribe(response => {
        if (response?.length !== 0) {
          response.forEach(r => {
            r.VacantFormattedDate = this._datepipe.transform(r.VacantDate, 'dd-MM-yyyy');
          })
          this.employeeVacancyData = response;
          this.loading = false;
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
  }

  onEdit(selectedRow) {
    if(selectedRow !== undefined && selectedRow !== null) {
      this.EmpVacancyId = selectedRow.Id;
      this.district = selectedRow.DCode;
      this.districtOptions = [{ label: selectedRow.Districtname, value: selectedRow.DCode }];
      this.taluk = selectedRow.TCode;
      this.talukOptions = [{ label: selectedRow.Talukname, value: selectedRow.TCode }];
      this.hostel = selectedRow.HCode;
      this.hostelOptions = [{ label: selectedRow.HostelName, value: selectedRow.HCode }];
      this.designation = selectedRow.DesignationId;
      this.designationOptions = [{ label: selectedRow.Name, value: selectedRow.DesignationId }];
      this.vacantFromDate = new Date(selectedRow.VacantDate);
      this.sanction = selectedRow.Sanction;
      this.vacancy = selectedRow.Vacancy;
      this.filled = selectedRow.Filled;
      this.reason = selectedRow.Reason;
    }
  }

  onClear(type) {
    if (type === 1) {
      this._employeeVacancyForm.reset();
      this.talukOptions = [];
      this.hostelOptions = [];
      this.districtOptions = [];
      this.employeeVacancyData = [];
    } else {
      this._employeeVacancyForm.controls._designation.reset();
      this._employeeVacancyForm.controls._sanctionNo.reset();
      this._employeeVacancyForm.controls._filledNo.reset();
      this._employeeVacancyForm.controls._vacancyNo.reset();
      this._employeeVacancyForm.controls._vacancyFromDate.reset();
      this._employeeVacancyForm.controls._reason.reset();
    }
    this._employeeVacancyForm.form.markAsUntouched();
    this._employeeVacancyForm.form.markAsPristine();
    this.designationOptions = [];
    this.EmpVacancyId = 0;
    this.isSubmitted = false;
  }

}
