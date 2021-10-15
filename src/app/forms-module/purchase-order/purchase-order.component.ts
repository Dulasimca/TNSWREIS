import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { MasterService } from 'src/app/services/master-data.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { HttpErrorResponse } from '@angular/common/http';

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
  commodity: any;
  commodityOptions: SelectItem[];
  commodities?: any;
  unitOptions: SelectItem[];
  unit: any;
  units?: any;
  rate: any;
  quantity: any;
  purcahseOrderData: any[] = [];
  purcahseOrderCols: any;
  loading: boolean;
  showTable: boolean;
  grandTotal: number = 0;
  total: any = 0;
  purchaseId: number = 0;
  detailId: number = 0;
  logged_user: User;
  orderList: any = [];
  viewDate: Date;
  loader: boolean;
  showDialog: boolean;
  @BlockUI() blockUI: NgBlockUI;
  @ViewChild('f', { static: false }) _purchaseForm: NgForm;

  constructor(private _datepipe: DatePipe, private _tableConstants: TableConstants,
    private _masterService: MasterService, private _messageService: MessageService,
    private _authService: AuthService, private _restApiService: RestAPIService) { }

  ngOnInit(): void {
    this.purcahseOrderCols = this._tableConstants.purcahseOrderColumns;
    this.logged_user = this._authService.UserInfo;
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

  calculateTotal() {
    if (this.rate !== undefined && this.rate !== null && this.quantity !== undefined && this.quantity !== null) {
      this.total = ((this.quantity * 1) * (this.rate * 1)).toFixed(2);
    }
  }

  onEnter() {
    this.showTable = true;
    this.loading = true;
    this.purcahseOrderData = this.checkIfTotalExists(this.purcahseOrderData);
    this.purcahseOrderData.push({
      'DetailId': this.detailId,
      'OrderId': this.purchaseId,
      'Commodity': this.commodity.label,
      'CommodityId': this.commodity.value,
      'Quantity': this.quantity,
      'Rate': this.rate,
      'Unit': this.unit.label,
      'UnitId': this.unit.value,
      'Total': this.total
    })
    this.orderList = this.purcahseOrderData.slice(0);
    //grand total
    this.calculateGrandTotal();
    this.clearOrderDetails();
    this.loading = false;
  }

  checkIfTotalExists(data) {
    var result = [];
    if (data.length >= 1) {
      var last_index = data.length - 1;
      if (data[last_index].Commodity === 'Total Amount') {
        data.splice(last_index, 1);
        result = data;
      }
    }
    return result;
  }

  calculateGrandTotal() {
    let total_qty = 0;
    let total_rate = 0;
    let grand_total = 0;
    if (this.orderList.length !== 0) {
      this.orderList.forEach(p => {
        total_rate += (p.Rate * 1);
        total_qty += (p.Quantity * 1);
        grand_total += (p.Total * 1);
      })
      var item = {
        Commodity: 'Total Amount', Total: (grand_total * 1).toFixed(2)
      };
      const index = this.orderList.length;
      this.purcahseOrderData.splice(index, 0, item);
      this.grandTotal = grand_total;
    } else {
      this.grandTotal = 0;
    }
  }

  isTally(): [boolean, string] {
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

  onEdit(data, index) {
    if (data !== undefined && data !== null) {
      this.commodity = { label: data.Commodity, value: data.CommodityId };
      this.commodityOptions = [{ label: data.Commodity, value: data.CommodityId }];
      this.unit = { label: data.Unit, value: data.UnitId };
      this.unitOptions = [{ label: data.Unit, value: data.UnitId }];
      this.quantity = (data.Quantity * 1).toFixed(3);
      this.rate = (data.Rate * 1).toFixed(2);
      this.total = (data.Total * 1).toFixed(2);
      this.purcahseOrderData = this.checkIfTotalExists(this.purcahseOrderData);
      if (this.orderList.length !== 0) {
        this.purcahseOrderData.splice(index, 1);
        this.orderList = this.purcahseOrderData.slice(0);
        this.calculateGrandTotal();
      } else {
        this.purcahseOrderData = [];
        this.orderList = [];
      }
    }
  }

  onDelete(index) {
    if (index !== undefined && index !== null) {
    this.purcahseOrderData = this.checkIfTotalExists(this.purcahseOrderData);
    if (this.orderList.length !== 0) {
        this.purcahseOrderData.splice(index, 1);
        this.orderList = this.purcahseOrderData.slice(0);
        this.calculateGrandTotal();
      } else {
        this.purcahseOrderData = [];
        this.orderList = [];
      }
    }
  }

  onSave() {
    this.blockUI.start();
    var result = this.isTally();
    const isTallied = result[0];
    const message = result[1];
    if (isTallied) {
      const params = {
        'PurchaseId': this.purchaseId,
        'HostelId': this.logged_user.hostelId,
        'DistrictCode': this.logged_user.districtCode,
        'TalukId': this.logged_user.talukId,
        'ShopName': this.shopName.trim(),
        'GSTNo': this.gstNo,
        'BillNo': this.billNo,
        'BillDate': this._datepipe.transform(this.billDate, 'yyyy-MM-dd'),
        'BillAmount': this.billAmount,
        'OrderList': this.orderList
      }
      this._restApiService.post(PathConstants.PurchaseOrder_Post, params).subscribe(res => {
        if (res !== undefined && res !== null) {
          if (res) {
            this.blockUI.stop();
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
    } else {
      this.blockUI.stop();
      this._messageService.clear();
      this._messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
        summary: ResponseMessage.SUMMARY_ERROR, detail: message
      });
    }
  }

  getPurchaseOrder() {
    // const params = {
    //   'Value': this._datepipe.transform()
    // }
    this.loader = true;
    this._restApiService.getByParameters(PathConstants.PurchaseOrder_Get, {'Value': this.viewDate}).subscribe(res => {
      if(res !== undefined && res !== null && res.length !== 0) {
        this.loader = false;
      } else {
        this.loader = false;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
        })
      }
    })
  }

  editOrder(row) {
    if(row !== undefined && row !== null) {
      this.showDialog = false;
      // res.forEach(r => {
      //   this.purchaseId = (r.OrderId !== undefined) ? r.OrderId : null;
      //   this.billAmount = (r.BillAmount !== undefined && r.BillAmount !== null) ? (r.BillAmount * 1) : 0;
      //   this.billDate = (r.BillDate !== undefined && r.BillDate !== null) ? new Date(r.BillDate) : null;
      //   this.billNo = (r.BillNo !== undefined && r.BillNo !== null) ? r.BillNo : '';
      //   this.shopName = (r.ShopName !== undefined && r.ShopName !== null) ? r.ShopName : '';
      //   this.gstNo = (r.GstNo !== undefined && r.GstNo !== null) ? r.GstNo : '';
      //   if(r.DetailId !== undefined && r.DetailId !== null) {
      //     this.purcahseOrderData.push({
      //       'DetailId': r.DetailId,
      //       'OrderId': r.OrderId,
      //       'Commodity': r.Commodity,
      //       'CommodityId': r.CommodityId,
      //       'Quantity': r.Qty,
      //       'Rate': r.Rate,
      //       'Unit': r.Unit,
      //       'UnitId': r.UnitId,
      //       'Total': r.Total
      //     })
      //   }
      // })
    }
  }

  onClearAll() {
    this._purchaseForm.reset();
    this._purchaseForm.form.markAsUntouched();
    this._purchaseForm.form.markAsPristine();
    this.shopName = '';
    this.gstNo = '';
    this.billNo = '';
    this.billDate = new Date();
    this.total = 0;
    this.grandTotal = 0;
    this.purchaseId = 0;
    this.detailId = 0;
    this.clearOrderDetails();
  }

  clearOrderDetails() {
    this._purchaseForm.controls._commodity.reset();
    this._purchaseForm.controls._unit.reset();
    this._purchaseForm.controls._quantity.reset();
    this._purchaseForm.controls._rate.reset();
    this._purchaseForm.controls._total.reset();
    this.commodityOptions = [];
    this.unitOptions = [];
  }

  public getColor(name: string): string {
    return (name === 'Total Amount') ? "aliceblue" : "white";
  }

}
