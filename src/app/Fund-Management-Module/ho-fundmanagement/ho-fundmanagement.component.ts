import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-ho-fundmanagement',
  templateUrl: './ho-fundmanagement.component.html',
  styleUrls: ['./ho-fundmanagement.component.css']
})
export class HOFundmanagementComponent implements OnInit {

  goNumber: any;
  yearOptions: SelectItem[];
  Date: any;
  budjetAmount: any;
  year: any;
  years?: any;
  hoFundId: number;
  @ViewChild('f', { static: false }) _hoFundForm: NgForm;
  
  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService,
    private _datePipe: DatePipe) { }

  ngOnInit(): void {
    this.years = this.masterService.getMaster('AY')
  }

  onSelect() {
    let yearSelection = [];
    this.years.forEach(y => {
      yearSelection.push({ label: y.name, value: y.code });
    })
    this.yearOptions = yearSelection;
    this.yearOptions.unshift({ label: '-select', value: null });
  }

  onSave() {
    const params = {
      'Id': this.hoFundId,
      'AccYear': this.year,
      'GoNumber': this.goNumber,
      'GoDate': this._datePipe.transform(this.Date, 'dd-MM-yyyy'),
      'BudjetAmount': this.budjetAmount,
      'Flag': 1
    }
    this.restApiService.post(PathConstants.HOFundAllotment_Post, params).subscribe(res => {
      if (res) {
        var message = (this.hoFundId === 0) ? ResponseMessage.SuccessMessage : ResponseMessage.UpdateMsg;
        this.clearForm();
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
          summary: ResponseMessage.SUMMARY_SUCCESS, detail: message
        });
      } else {
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    })
  }

  loadData() {
    const params = {
      'AccountingYearId': this.year
    }
    this.restApiService.getByParameters(PathConstants.HOFundAllotment_Get, params).subscribe(res => {
      if (res !== null && res !== undefined) {
        res.forEach(res => {
          this.goNumber = res.GONumber;
          this.Date = new Date(res.GODate);
          this.budjetAmount = res.BudjetAmount;
        })
      }
    })
  }

  clearForm() {
    this._hoFundForm.reset();
    this.yearOptions = [];
  }
}
