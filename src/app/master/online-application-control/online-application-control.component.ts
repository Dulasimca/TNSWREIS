import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';
import { NgForm } from '@angular/forms';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { TableConstants } from 'src/app/Common-Modules/table-constants';

@Component({
  selector: 'app-online-application-control',
  templateUrl: './online-application-control.component.html',
  styleUrls: ['./online-application-control.component.css']
})
export class OnlineApplicationControlComponent implements OnInit {
  
  hostelType: any;
  hostelTypeOptions: SelectItem[];
  applicationType: any;
  applicationTypeOptions: SelectItem[];
  academicYear: any;
  yearOptions: SelectItem[];
  openingDate: any;
  closingDate: any;
  yearRange: string;
  data: any = [];
  cols: any;
  showTable: boolean;
  years?: any;
  extendDate: any;
  Hostelfunctions?: any;
  applicationtype?: any = [];
  RowId: any = 0;

  @ViewChild('f', { static: false }) onlineapplicationcontrol: NgForm;
  constructor(private masterService: MasterService,  private restApiService: RestAPIService, private datePipe: DatePipe,
    private messageService: MessageService,  private tableConstants: TableConstants) { }

  ngOnInit(): void {
    const current_year = new Date().getFullYear();
    this.cols = this.tableConstants.onlineApplicationControlColumns;
    const start_year_range = current_year - 10;
    this.yearRange = start_year_range + ':' + current_year;
    this.years = this.masterService.getMaster('AY');
    this.Hostelfunctions = this.masterService.getMaster('HF');
    this.restApiService.get(PathConstants.ApplicationType_Get).subscribe(applicationtype => {
      this.applicationtype = applicationtype.slice(0);
    })
  }

  onSelect(type) {
    let yearSelection = [];
    let hostelfunctionSelection = [];
    let applicationSelection = [];
    switch(type){
    case 'Y':
      this.years.forEach(y => {
        yearSelection.push({ label: y.name, value: y.type });
      })
      this.yearOptions = yearSelection;
      this.yearOptions.unshift({ label: '-select', value: null });
      break;
      case 'HF':
        this.Hostelfunctions.forEach(f => {
          hostelfunctionSelection.push({ label: f.name, value: f.code });
        })
        this.hostelTypeOptions = hostelfunctionSelection;
        this.hostelTypeOptions.unshift({ label: '-select-', value: null });
        break;  
        case 'AT':
          this.applicationtype.forEach(a => {
            applicationSelection.push({ label: a.Name, value: a.Id });
          })
          this.applicationTypeOptions = applicationSelection;
          this.applicationTypeOptions.unshift({ label: '-select-', value: null });
          break;  
    }
  }


  onSubmit() {
    const params = {
      'Id': this.RowId,
      'HostelType': this.hostelType,
      'ApplicationType': this.applicationType,
      'AcademicYear': this.academicYear,
      'ApplicationOpenDate': this.datePipe.transform(this.openingDate, 'MM/dd/yyyy'),
      'ApplicationCloseDate': this.datePipe.transform(this.closingDate, 'MM/dd/yyyy'),
      'Flag': 1
    }
    this.restApiService.post(PathConstants.OnlineApplicationControl_Post, params).subscribe(res => {
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

  onView() {
    this.showTable = true;
    this.restApiService.get(PathConstants.OnlineApplicationControl_Get).subscribe(res => {
      this.data = res;
      res.forEach(r => {
        r.ApplicationOpenDate = this.datePipe.transform( r.ApplicationOpenDate, 'MM/dd/yyyy')
        r.ApplicationCloseDate = this.datePipe.transform( r.ApplicationCloseDate, 'MM/dd/yyyy')
      })
    })
  }

  onEdit(rowData) {
    if (rowData !== null && rowData !== undefined) {
      this.RowId = rowData.Id;
      this.hostelType = rowData.HostelType;
      this.hostelTypeOptions = [{ label: rowData.HostelFuncType, value: rowData.HostelType}];
      this.applicationType = rowData.ApplicationType;
      this.applicationTypeOptions = [{ label: rowData.ApplicationTypeName, value: rowData.ApplicationType}];
      this.academicYear = rowData.AcademicYear;
      this.yearOptions = [{ label: rowData.ShortYear, value: rowData.AcademicYear}];
      this.openingDate = rowData.ApplicationOpenDate;
      this.closingDate = rowData.ApplicationCloseDate;
    }
  }

  onClear() {
    this.onlineapplicationcontrol.reset();
    this.onlineapplicationcontrol.form.markAsUntouched();
    this.onlineapplicationcontrol.form.markAsPristine();
    this.hostelType = null;
    this.hostelTypeOptions = [];
    this.applicationType = null;
    this.applicationTypeOptions = [];
    this.academicYear = null;
    this.yearOptions = [];
    this.RowId = 0;
  }

}
