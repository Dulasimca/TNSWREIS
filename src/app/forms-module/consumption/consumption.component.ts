import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfirmDialog } from 'primeng/confirmdialog';

@Component({
  selector: 'app-consumption',
  templateUrl: './consumption.component.html',
  styleUrls: ['./consumption.component.css']
})
export class ConsumptionComponent implements OnInit {
  consumption: any;
  consumptionOptions: SelectItem[];
  consumptions?: any = [];
  date: any;
  commodityOptions: SelectItem[];
  commodity: any;
  commodities?: any = [];
  unitOptions: SelectItem[];
  unit: any;
  units?: any = [];
  openingBalance: any = 400;
  requiredQty: any;
  closingBalance: any;
  consumptionCols: any;
  consumptionData: any[] = [];
  consumptionId: number = 0;
  loading: boolean;
  consumedList: any[] = [];
  showDialog: boolean;
  toDate: any;
  fromDate: any;
  showAlertBox: boolean;
  maxDate: Date = new Date();
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _consumptionForm: NgForm;
  @ViewChild('cd', { static: false }) _alert: ConfirmDialog;

  constructor(private _tableConstants: TableConstants, private _masterService: MasterService,
    private _datePipe: DatePipe, private _restApiService: RestAPIService,
    private _messageService: MessageService, private _confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.consumptionCols = this._tableConstants.consumptionColumns;
    this.consumptions = this._masterService.getMaster('CT');
    this.commodities = this._masterService.getMaster('CM');
    this.units = this._masterService.getMaster('UN');
  }

  onSelect(id) {
    let consumptionSelection = [];
    let commoditySelection = [];
    let unitSelection = [];
    switch (id) {
      case 'CF':
        if (this.consumptions.length !== 0) {
          this.consumptions.forEach(c => {
            consumptionSelection.push({ label: c.name, value: c.code });
          })
        }
        this.consumptionOptions = consumptionSelection;
        this.consumptionOptions.unshift({ label: '-select-', value: null });
        break;
      case 'CM':
        if (this.commodities.length !== 0) {
          this.commodities.forEach(c => {
            commoditySelection.push({ label: c.name, value: c.code });
          })
        }
        this.commodityOptions = commoditySelection;
        this.commodityOptions.unshift({ label: '-select-', value: null });
        break;
      case 'UN':
        if (this.units.length !== 0) {
          this.units.forEach(u => {
            unitSelection.push({ label: u.name, value: u.code });
          })
        }
        this.unitOptions = unitSelection;
        this.unitOptions.unshift({ label: '-select-', value: null });
        break;
    }
  }

  loadOB() { }

  onEnter() {
    this.consumptionData.push({
      'Id': (this.consumptionId !== undefined && this.consumptionId !== null) ? this.consumptionId : 0,
      'ConsumptionType': this.consumption.value,
      'ConsumptionDate': this._datePipe.transform(this.date, 'yyyy-MM-dd'),
      'Consumption': this.consumption.label,
      'CommodityId': this.commodity.value,
      'Commodity': this.commodity.label,
      'UnitId': this.unit.value,
      'Unit': this.unit.label,
      'OB': this.openingBalance,
      'QTY': this.requiredQty,
      'CB': this.closingBalance,
    })
    this.clearForm();
  }

  calculateBalance() {
    if (this.openingBalance !== undefined && this.openingBalance !== null &&
      this.requiredQty !== undefined && this.requiredQty !== null) {
      const entered_qty = (this.requiredQty * 1);
      const opening_bal = (this.openingBalance * 1);
      this.closingBalance = (opening_bal - entered_qty).toFixed(3);
      var msg = '';
      if (entered_qty > opening_bal) {
        msg = 'Quantity entered : ' + entered_qty + ' cannot be greater than OB : ' + opening_bal;
        this._consumptionForm.controls._requiredqty.reset();
        this.requiredQty = null;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: msg
        });
      } else {
        msg = '';
        this._messageService.clear();
      }
    }
  }

  onEdit(row, index, type) {
    if (index !== undefined && index !== null && this.consumptionData.length !== 0) {
      this.consumptionData.splice(index, 1);
    }
    if (row !== undefined && row !== null) {
      if (type === 2) {
        this.showDialog = false;
        this.consumptionId = row.Id;
        console.log('r', row, this.consumptionId);
        this.date = new Date(row.ConsumptionDate);
      } else {
        this.consumptionId = 0;
      }
      this.consumption = { label: row.Consumption, value: row.ConsumptionId };
      this.consumptionOptions = [{ label: row.Consumption, value: row.ConsumptionId }];
      this.commodity = { label: row.Commodity, value: row.CommodityId };
      this.commodityOptions = [{ label: row.Commodity, value: row.CommodityId }];
      this.unit = { label: row.Unit, value: row.UnitId };
      this.unitOptions = [{ label: row.Unit, value: row.UnitId }];
      this.consumptionId = row.Id;
      this.openingBalance = (row.OB * 1).toFixed(3);
      this.requiredQty = (row.QTY * 1).toFixed(3);
      this.closingBalance = (row.CB * 1).toFixed(3);
    }
  }

  onDelete(data, index, type) {
    if (index !== undefined && index !== null) {
      if (type === 1) {
        this.consumptionData.splice(index, 1);
      } else {
        this.showAlertBox = true;
        this._confirmationService.confirm({
          message: 'Are you sure that you want to proceed?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this.showAlertBox = false;
            this.loading = true;
            this._restApiService.put(PathConstants.Consumption_Delete, { 'Id': data.Id }).subscribe(res => {
              if (res !== undefined && res !== null) {
                if (res) {
                  this.loading = false;
                  this._messageService.clear();
                  this._messageService.add({
                    key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
                    summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.DeleteSuccessMsg
                  });
                  this.consumedList.splice(index, 1);
                } else {
                  this.loading = false;
                  this._messageService.clear();
                  this._messageService.add({
                    key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
                    summary: ResponseMessage.SUMMARY_INVALID, detail: ResponseMessage.DeleteFailMsg
                  });
                }
              } else {
                this.loading = false;
                this._messageService.clear();
                this._messageService.add({
                  key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
                  summary: ResponseMessage.SUMMARY_INVALID, detail: ResponseMessage.ErrorMessage
                });
              }
            })
          },
          reject: () => {
            this.showAlertBox = false;
            this._messageService.clear();
            this._alert.disableModality();
          }
        });
      }
    }
  }

  onDateSelect() {
    this.loading = true;
    this.consumedList = [];
    this.checkValidDateSelection();
    if (this.fromDate !== undefined && this.fromDate !== null &&
      this.toDate !== undefined && this.toDate !== null) {
      const params = {
        'FromDate': this._datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        'ToDate': this._datePipe.transform(this.toDate, 'yyyy-MM-dd')
      }
      this._restApiService.getByParameters(PathConstants.Consumption_Get, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          this.consumedList = res.slice(0);
          this.loading = false;
          this.showAlertBox = true;
        } else {
          this.loading = false;
          this.showAlertBox = false;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
          });
        }
      }, (err: HttpErrorResponse) => {
        this.showAlertBox = false;
        this.loading = false;
        if (err.status === 0 || err.status === 400) {
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          })
        }
      })
    }
  }

  checkValidDateSelection() {
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' && this.toDate !== '') {
      let selectedFromDate = this.fromDate.getDate();
      let selectedToDate = this.toDate.getDate();
      let selectedFromMonth = this.fromDate.getMonth();
      let selectedToMonth = this.toDate.getMonth();
      let selectedFromYear = this.fromDate.getFullYear();
      let selectedToYear = this.toDate.getFullYear();
      if ((selectedFromDate > selectedToDate && ((selectedFromMonth >= selectedToMonth && selectedFromYear >= selectedToYear) ||
        (selectedFromMonth === selectedToMonth && selectedFromYear === selectedToYear))) ||
        (selectedFromMonth > selectedToMonth && selectedFromYear === selectedToYear) || (selectedFromYear > selectedToYear)) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR, life: 5000,
          summary: ResponseMessage.SUMMARY_INVALID, detail: ResponseMessage.ValidDateErrorMessage
        });
        this.fromDate = ''; this.toDate = '';
      }
      return this.fromDate, this.toDate;
    }
  }

  onSave() {
    this.blockUI.start();
    this._restApiService.post(PathConstants.Consumption_Post, this.consumptionData).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          this.blockUI.stop();
          this.clearAll();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });
        } else {
          this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          });
        }
      } else {
        this.blockUI.stop();
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      this.blockUI.stop();
      if (err.status === 0 || err.status === 400) {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        })
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.NetworkErrorMessage
        })
      }
    })
  }

  clearAll() {
    this.consumptionId = 0;
    this._consumptionForm.reset();
    this._consumptionForm.form.markAsUntouched();
    this._consumptionForm.form.markAsPristine();
    this.consumptionData = [];
    this.consumedList = [];
    this.commodityOptions = [];
    this.consumptionOptions = [];
    this.unitOptions = [];
    this.showAlertBox = false;
    this.loading = false;
  }

  clearForm() {
    this.consumptionId = 0;
    this._consumptionForm.reset();
    this.commodityOptions = [];
    this.consumptionOptions = [];
    this.unitOptions = [];
  }
}
