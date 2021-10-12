import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { MasterService } from 'src/app/services/master-data.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ResponseMessage } from 'src/app/Common-Modules/messages';

@Component({
  selector: 'app-purchase-order',
  templateUrl: './purchase-order.component.html',
  styleUrls: ['./purchase-order.component.css']
})
export class PurchaseOrderComponent implements OnInit {
  billNo: any = '';
  billDate: Date = new Date();
  shopName: string = '';
  gstNo: any = '';
  billAmount: any;
  commodity: string;
  commodityOptions: SelectItem[];
  commodities?: any;
  unitOptions: SelectItem[];
  unit: string;
  units?: any;
  rate: any;
  quantity: any;
  purcahseOrderData: any = [];
  purcahseOrderCols: any;
  loading: boolean;
  showTable: boolean;
  grandTotal: number = 0;
  @BlockUI() blockUI: NgBlockUI;
  constructor(private _datepipe: DatePipe, private _tableConstants: TableConstants,
    private _masterService: MasterService, private _messageService: MessageService) { }

  ngOnInit(): void {
    this.purcahseOrderCols = this._tableConstants.purcahseOrderColumns;
    this.units = this._masterService.getMaster('UN');
    this.commodities = this._masterService.getMaster('CM');
  }

  onSelect(id) {
    let commoditySelection = [];
    let unitSelection = [];
    switch (id) {
      case 'CM':
        if (this.commodities !== undefined && this.commodities !== null) {
          this.commodities.forEach(c => {
            commoditySelection.push({ label: c.name, value: c.code });
          })
        }
        this.commodityOptions = commoditySelection;
        this.commodityOptions.unshift({ label: '-select-', value: null });
        break;
      case 'UN':
        if (this.units !== undefined && this.units !== null) {
          this.units.forEach(u => {
            unitSelection.push({ label: u.name, value: u.code });
          })
        }
        this.unitOptions = unitSelection;
        this.unitOptions.unshift({ label: '-select-', value: null });
        break;

    }
  }

  onEnter() {
    this.loading = true;
    this.purcahseOrderData.push({
      'CommodityId': this.commodity,
      'Quantity': (this.quantity * 1).toFixed(3),
      'Rate': (this.rate * 1).toFixed(2),
      'Unit': this.unit,

    })
    //grand total

    this.showTable = true;
    this.loading = false;
  }

  isTally(): [boolean,string] {
    let result: boolean, message: string;
    if (this.grandTotal !== undefined && this.grandTotal !== null && this.grandTotal !== NaN &&
      this.billAmount !== undefined && this.billAmount !== null && this.billAmount !== NaN) {
      const g_total = (this.grandTotal * 1);
      const b_amt = (this.billAmount * 1);
      if (g_total === b_amt) {
        result = true;
        message = 'Tallied !'
      } else {
        result = false;
        message = 'Bill amount entered: ' + b_amt + ' is less or greater than grand total of entered items in list: ' 
        + g_total;
      }
    } else {
      result = false;
      message = 'Please ensure bill amount is entered correctly and grand total is appearing on screen !';
    }
    return [result, message];
  }

  onEdit(data) {
    if (data !== undefined && data !== null) {
      this.commodity = data.CommodityId;
      this.commodityOptions = [{ label: data.Commodity, value: data.CommodityId }];
      this.quantity = (data.quantity * 1).toFixed(3);
      this.rate = (data.rate * 1).toFixed(2);
      this.billDate = new Date(data.BillDate);
      this.billNo = data.BillNo;
      this.shopName = data.ShopName;
      this.gstNo = data.GSTNo;
    }
  }

  onDelete(index) {
    if (index !== undefined && index !== null) {
      this.purcahseOrderData.splice(index, 1);
    }
  }

  onSave() {
    this.blockUI.start();
    var result = this.isTally();
    const isTallied = result[0];
    const message = result[1];
    if (isTallied) {
      const params = {
        'ShopName': this.shopName,
        'GSTNo': this.gstNo,
        'BillNo': this.billNo,
        'BillDate': this._datepipe.transform(this.billDate, 'yyyy-MM-dd')
      }
    } else {
      this.blockUI.stop();
      this._messageService.clear();
      this._messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
        summary: ResponseMessage.SUMMARY_ERROR, detail: message
      });
    }
  }

  onClear() {
    this.shopName = '';
    this.gstNo = '';
    this.billNo = '';
    this.billDate = new Date();
  }

}
