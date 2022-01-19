import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-foodentitlement-report',
  templateUrl: './foodentitlement-report.component.html',
  styleUrls: ['./foodentitlement-report.component.css']
})
export class FoodentitlementReportComponent implements OnInit {
  yearOptions: SelectItem[];
  year: any;
  years?: any;
  hostelType: number;
  hosteltypeOptions: SelectItem[];
  Hostelfunctions?: any;
  logged_user: User;
  data:any;
  cols:any;

  constructor(private restApiService: RestAPIService, 
    private masterService: MasterService, private _messageService: MessageService,private _authService: AuthService) { }

  ngOnInit(): void {
    this.Hostelfunctions = this.masterService.getMaster('HF');
    this.years = this.masterService.getMaster('AY');
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
    let hostelfunctionSelection = [];
    let yearSelection = [];
    switch(type) {
      case 'HF':
        this.Hostelfunctions.forEach(f => {
          hostelfunctionSelection.push({ label: f.name, value: f.code });
        })
        this.hosteltypeOptions = hostelfunctionSelection;
        this.hosteltypeOptions.unshift({ label: '-select-', value: null });
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

onLoad() {
    const params = {
      'AccountingYearId' : this.year,
    };
    this.restApiService.getByParameters(PathConstants.FoodEntitlement_Get,params).subscribe(res => {
      if (res !== null && res !== undefined && res.Table.length !== 0) {
        this.data = res.Table;
        this.data.forEach(i => {
          i.Flag = (i.Flag) ? 'Active' : 'Inactive';
        })
        
      }else{
      this._messageService.clear();
      this._messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
        summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
      })
    }
    });
}
}
