import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ResponseMessage } from 'src/app/Common-Modules/messages';

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
  consumptionData: any = [];
  consumptionId: number = 0;
  loading: boolean;
  consumptionList: any[] = [];
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _consumptionForm: NgForm;

  constructor(private _tableConstants: TableConstants, private _masterService: MasterService,
    private _datePipe: DatePipe, private _restApiService: RestAPIService,
    private _messageService: MessageService) { }

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
        if(this.consumptions.length !== 0) {
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

  loadConsumption() {
    this._restApiService.getByParameters(PathConstants.Consumption_Get, { 'Value': this.date }).subscribe(res => {
      if(res !== undefined && res !== null && res.length !== 0) {
        this.consumptionData = res.slice(0);
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
    })
    this.consumptionList.push({
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
    this._consumptionForm.reset();
  }

  calculateBalance() {
    if(this.openingBalance !== undefined && this.openingBalance !== null &&
      this.requiredQty !== undefined && this.requiredQty !== null) {
        const entered_qty = (this.requiredQty * 1);
        const opening_bal = (this.openingBalance * 1);
        this.closingBalance = (opening_bal - entered_qty).toFixed(3);
        var msg = '';
        if(entered_qty > opening_bal) {
          msg = 'Quantity entered : ' + entered_qty + ' cannot be greater than OB : ' + opening_bal;
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

  onEdit(row) {
    if(row !== undefined && row !== null) {
      this.consumption = { label: row.Consumption, value: row.ConsumptionId };
      this.consumptionOptions = [{ label: row.Consumption, value: row.ConsumptionId }];
      this.commodity = { label: row.Commodity, value: row.CommodityId };
      this.commodityOptions = [{ label: row.Commodity, value: row.CommodityId }];
      this.unit = { label: row.Unit, value: row.UnitId };
      this.unitOptions = [{ label: row.Unit, value: row.UnitId }];
      this.consumptionId = row.DailyId;
      this.openingBalance = (row.OB * 1).toFixed(3);
      this.requiredQty = (row.QTY * 1).toFixed(3);
      this.closingBalance = (row.CB * 1).toFixed(3);
    }
  }

  onDelete(index) {

  }

  onSave() {

  }

  onClear() {
    this.consumptionId = 0;
    this._consumptionForm.reset();
    this._consumptionForm.form.markAsUntouched();
    this._consumptionForm.form.markAsPristine();
    this.consumptionData = [];
    this.consumptionList = [];
  }

}
