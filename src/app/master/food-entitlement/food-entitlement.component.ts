import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-food-entitlement',
  templateUrl: './food-entitlement.component.html',
  styleUrls: ['./food-entitlement.component.css']
})
export class FoodEntitlementComponent implements OnInit {
  hostelType: number;
  hosteltypeOptions: SelectItem[];
  Hostelfunctions?: any;
  commodities?: any;
  commodityOptions: SelectItem[];
  commodity: any;
  quantity: any;
  selectedType: number;
  RowId: number;
  logged_user: User;
  data:any;
  cols:any;
  yearOptions: SelectItem[];
  year: any;
  years?: any;
  showTable: boolean;

  @ViewChild('f', { static: false }) _foodentitlement: NgForm;
  constructor(private _masterService: MasterService,private _restApiService: RestAPIService,private _messageService: MessageService,private _authService: AuthService) { }

  ngOnInit(): void {
    this.Hostelfunctions = this._masterService.getMaster('HF');
    this.commodities = this._masterService.getMaster('CM');
    this.years = this._masterService.getMaster('AY');
    this.logged_user = this._authService.UserInfo;

    this.cols = [
      {field:'AccountingYear',header:'Accounting Year'},
      {field:'FunctioningName',header:'Hostel Type'},
      {field:'CommodityName',header: 'Commodity'},
      {field:'Quantity',header: 'Quantity'},
      {field:'Flag',header: 'Status'}
    ];
  }

  onSelect(type) {
    this.data = [];
    let hostelfunctionSelection = [];
    let commoditySelection = [];
    let yearSelection = [];
    switch(type) {
      case 'HF':
        this.Hostelfunctions.forEach(f => {
          hostelfunctionSelection.push({ label: f.name, value: f.code });
        })
        this.hosteltypeOptions = hostelfunctionSelection;
        this.hosteltypeOptions.unshift({ label: '-select-', value: null });
        break; 
        case 'CM':
          this.commodities.forEach(c => {
            commoditySelection.push({ label: c.name, value: c.code });
          })
        this.commodityOptions = commoditySelection;
        this.commodityOptions.unshift({ label: '-select-', value: null });
        break;   
        case 'AY':
          this.years.forEach(y => {
            yearSelection.push({ label: y.name, value: y.code });
          })
          this.yearOptions = yearSelection;
          this.yearOptions.unshift({ label: '-select', value: null });
        break;   
    }
  }

  onSubmit() {
    const params = {
      'FoodId':this.RowId,
      'HostelType': this.hostelType,
      'Commodity': this.commodity,
      'Quantity': this.quantity,
      'AccountingYearId': this.year,
      'Flag': (this.selectedType * 1),
    };
    this._restApiService.post(PathConstants.FoodEntitlement_Post,params).subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res) {
          //  this.blockUI.stop();
           this.onClear();
           this.onView();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
            summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
          });

        } else {
          // this.blockUI.stop();
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          });
        }
      } else {
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        });
      }
    }, (err: HttpErrorResponse) => {
      // this.blockUI.stop();
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
    if (this.year !== null && this.year !== undefined) {
      const params = {
        'AccountingYearId': this.year      
      };
      this._restApiService.getByParameters(PathConstants.FoodEntitlement_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
          res.Table.forEach(i => {
                i.Flag = (i.Flag) ? 'Active' : 'Inactive';
                })
          this.showTable = true;
          this.data = res.Table;
          }
          
         else {
          this.showTable = false;
          this._messageService.clear();
          this._messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
            summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
          });
        }
      } else {
        this.showTable = false;
        this._messageService.clear();
        this._messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
          summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
        });
      }
    })
  } else {
    this._messageService.clear();
    this._messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
      summary: ResponseMessage.SUMMARY_WARNING, detail: 'Please select accounting year to view data !'
    });
  }
}


  onClear() {
    this._foodentitlement.reset();
    this._foodentitlement.form.markAsUntouched();
    this._foodentitlement.form.markAsPristine();
    this.hostelType = null;
    this.hosteltypeOptions =[];
    this.commodity = null;
    this.commodityOptions =[];
    this.quantity = null;
    this.year = null;
    this.yearOptions = [];
    this.RowId = 0;

  }

  onRowSelect(event, selectedRow) {
    this.RowId = selectedRow.FoodId;
    this.year = selectedRow.AccountingYearId;
    this.yearOptions = [{ label: selectedRow.AccountingYear, value: selectedRow.AccountingYearId}];
    this.hostelType = selectedRow.HostelType;
    this.hosteltypeOptions = [{ label: selectedRow.FunctioningName, value: selectedRow.HostelType}];
    this.commodity = selectedRow.Commodity;
    this.commodityOptions = [{ label: selectedRow.CommodityName, value: selectedRow.Commodity}];
    this.quantity = selectedRow.Quantity;
    this.selectedType = selectedRow.Flag;
  }

}
