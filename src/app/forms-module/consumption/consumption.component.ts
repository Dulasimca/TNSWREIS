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
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

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
  openingBalance: any;
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
  // showAlertBox: boolean;
  maxDate: Date = new Date();
  logged_user: User;
  biometricId: any;
  disableOB: boolean;
  studentCount: any;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _consumptionForm: NgForm;
  @ViewChild('cd', { static: false }) _alert: ConfirmDialog;

  constructor(private _tableConstants: TableConstants, private _masterService: MasterService,
    private _datePipe: DatePipe, private _restApiService: RestAPIService, private _authService: AuthService,
    private _messageService: MessageService, private _confirmationService: ConfirmationService) { }

  ngOnInit(): void {
    this.consumptionCols = this._tableConstants.consumptionDetailsColumns;
    this.consumptions = this._masterService.getMaster('CT');
    this.commodities = this._masterService.getMaster('CM');
    this.units = this._masterService.getMaster('UN');
    this.logged_user = this._authService.UserInfo;
    this.disableOB = false;
    const params = {
      'HostelId': this.logged_user.hostelId,
      'FromDate': '',
      'ToDate': '',
      'Type': 1
    }
    this._restApiService.getByParameters(PathConstants.Consumption_Get, params).subscribe(res => {
      if (res) {
        this.biometricId = res[0].DeviceId;
      } else {
        console.log('No Device Id found for this hostel');
      }
    })
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

  loadOB() {
    this.blockUI.start();
    let Qty = 0;
    this.openingBalance = 0;
    const params = {
      'Commodity': (this.commodity.value !== null && this.commodity.value !== undefined) ? this.commodity.value : 0,
      'AccountingYear': 4,
      'Date': this._datePipe.transform(this.date, 'MM/dd/yyyy')
    }
    this._restApiService.getByParameters(PathConstants.QuantityForConsumption_Get, params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res.length !== 0) {
          this.blockUI.stop();
          Qty = res[0].Quantity;
        } else {
          this.blockUI.stop();
        }
      } else {
        this.blockUI.stop();
      }
    })

    const BM_params = {
      'Code': this.biometricId,
      'Date': this._datePipe.transform(this.date, 'MM/dd/yyyy')
    }
    this.studentCount = 0;
    this.blockUI.start();
    this._restApiService.getByParameters(PathConstants.BioMetricsForConsumption_Get, BM_params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res.length !== 0) {
          this.blockUI.stop();
          let Count = res[0].StudentCount;
          this.studentCount = Count;
          this.openingBalance = (Qty * Count);
          this.disableOB = ((this.openingBalance * 1) === 0) ? false : true;
        } else {
          this.studentCount = 0;
          this.blockUI.stop();
        }
      } else {
        this.studentCount = 0;
        this.blockUI.stop();
      }
    })

  }

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
      'HostelId': this.logged_user.hostelId,
      'TalukCode': this.logged_user.talukId,
      'DistrictCode': this.logged_user.districtCode
    })
  //  this.clearForm();
  // this._consumptionForm.form.controls._consumption.reset();
  // this._consumptionForm.form.controls._commodity.reset();
  // this._consumptionForm.form.controls._unit.reset();
  this.date = null;
 this.commodity = null;
 this.commodityOptions = [];
 this.unit = null;
 this.unitOptions = [];
 this.consumption = null;
 this.consumptionOptions = [];
  this.openingBalance = 0;
  this.studentCount = 0;
  this.requiredQty = 0;
  this.closingBalance = 0;
  
  }

  calculateBalance() {
    if (this.openingBalance !== undefined && this.openingBalance !== null &&
      this.requiredQty !== undefined && this.requiredQty !== null) {
      const entered_qty = (this.requiredQty * 1);
      const opening_bal = (this.openingBalance * 1);
      let remaining_bal = 0;
      if(this.consumptionData.length !== 0) {
        this.consumptionData.forEach(c => {
          if(c.CommodityId === this.commodity.value) {
          remaining_bal += c.QTY
          }
        })
        remaining_bal = opening_bal - remaining_bal;
      } else {
        remaining_bal = opening_bal;
      }
      this.closingBalance = (remaining_bal - entered_qty).toFixed(3);
      var msg = '';
      if (entered_qty > remaining_bal) {
        msg = 'Quantity entered : ' + entered_qty + ' cannot be greater than OB : ' + remaining_bal;
        this._consumptionForm.controls._requiredqty.reset();
        this.requiredQty = null;
        this.closingBalance = 0;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: msg
        });
      } else {
       // this.closingBalance = (remaining_bal - entered_qty).toFixed(3);
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
        this.date = new Date(row.ConsumptionDate);
      } else {
        this.consumptionId = 0;
      }
      this.date = new Date(row.ConsumptionDate);
      this.consumption = { label: row.Consumption, value: row.ConsumptionType };
      this.consumptionOptions = [{ label: row.Consumption, value: row.ConsumptionType }];
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
        this._confirmationService.confirm({
          message: 'Are you sure that you want to proceed?',
          header: 'Confirmation',
          icon: 'pi pi-exclamation-triangle',
          accept: () => {
            this._alert.disableModality();
            this.blockUI.start();
            this._restApiService.put(PathConstants.Consumption_Delete, { 'Id': data.Id }).subscribe(res => {
              if (res !== undefined && res !== null) {
                if (res) {
                  this.blockUI.stop();
                  this._messageService.clear();
                  this._messageService.add({
                    key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
                    summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.DeleteSuccessMsg
                  });
                  this.consumedList.splice(index, 1);
                } else {
                  this.blockUI.stop();
                  this._messageService.clear();
                  this._messageService.add({
                    key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
                    summary: ResponseMessage.SUMMARY_INVALID, detail: ResponseMessage.DeleteFailMsg
                  });
                }
              } else {
                // this.loading = false;
                this.blockUI.stop();
                this._messageService.clear();
                this._messageService.add({
                  key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
                  summary: ResponseMessage.SUMMARY_INVALID, detail: ResponseMessage.ErrorMessage
                });
              }
            })
          },
          reject: () => {
            this._messageService.clear();
            this._alert.disableModality();
          }
        });
      }
    }
  }

  onView() {
    this.showDialog = true;
    this.fromDate = null;
    this.toDate = null;
    this.consumedList = [];
  }

  onDateSelect() {
    this.consumedList = [];
    this.checkValidDateSelection();
    if (this.fromDate !== undefined && this.fromDate !== null &&
      this.toDate !== undefined && this.toDate !== null) {
      this.loading = true;
      const params = {
        'FromDate': this._datePipe.transform(this.fromDate, 'yyyy-MM-dd'),
        'ToDate': this._datePipe.transform(this.toDate, 'yyyy-MM-dd'),
        'HostelId': this.logged_user.hostelId,
        'Type': 2
      }
      this._restApiService.getByParameters(PathConstants.Consumption_Get, params).subscribe(res => {
        if (res !== undefined && res !== null && res.length !== 0) {
          res.forEach(r => {
            r.cDate = this._datePipe.transform(r.ConsumptionDate, 'dd/MM/yyyy');
          })
          this.consumedList = res.slice(0);
          this.loading = false;
        } else {
          this.loading = false;
          this.showDialog = false;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecordMessage
          });
        }
      }, (err: HttpErrorResponse) => {
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
    if (this.fromDate !== undefined && this.toDate !== undefined && this.fromDate !== '' &&
      this.toDate !== '' && this.fromDate !== null && this.toDate !== null) {
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
        this.fromDate = null; this.toDate = null;
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
          this.onClearAll();
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

  onClearAll() {
    this.consumptionId = 0;
 //   this._consumptionForm.reset();
    this.openingBalance = 0;
    this.closingBalance = 0;
    this.requiredQty = 0;
    this._consumptionForm.form.markAsUntouched();
    this._consumptionForm.form.markAsPristine();
    this.consumptionData = [];
    this.consumedList = [];
    this.commodityOptions = [];
    this.consumptionOptions = [];
    this.unitOptions = [];
    this.loading = false;
  }

  clearForm() {
    this.consumptionId = 0;
    this._consumptionForm.reset();
    this.commodityOptions = [];
    this.consumptionOptions = [];
    this.unitOptions = [];
    this.date = new Date();
  }
}
