import { Component, OnInit } from '@angular/core';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-feedingchargestype-report',
  templateUrl: './feedingchargestype-report.component.html',
  styleUrls: ['./feedingchargestype-report.component.css']
})
export class FeedingchargestypeReportComponent implements OnInit {

  // data:any;
  // Cols:any;
  // Accountingyear:any;
  // Accountingyears?:any;
  // AccountingyearOptions:SelectItem[];

  AccountingyearOptions:SelectItem[];
  feedingchargeOptions:SelectItem[];
  data:any = [];
  Cols:any;
  Accountingyear:any;
  Accountingyears?:any;
  feedingcharge:number;
  feedingcharges?:any;

  selectedType :number;
  TypeId:number;
  FeedingCharges:any
  feedchargeId=0;

  showTable: boolean;
  disableExcel: boolean = true;


  constructor(private tableConstants: TableConstants,private restApiService: RestAPIService, 
    private masterService: MasterService, private _messageService: MessageService,) { }

  ngOnInit(): void {
    //this.onView();
    this.Cols = this.tableConstants.feedingchargetypeReportCols
    this.Accountingyears = this.masterService.getMaster('AY');
  }

  onSelect(type)
  {
    let yearSelection = [];

    switch (type) {
      case 'AY':
        this.Accountingyears.forEach(y => {
          yearSelection.push({ label: y.name, value: y.code });
        })
        this.AccountingyearOptions = yearSelection;
        this.AccountingyearOptions.unshift({ label: '-select', value: null });
        break;
      }
  }


  loadTable() {
    this.data =[];
    const params = {
      'AccountingYearId' : this.Accountingyear,
    };
    this.restApiService.getByParameters(PathConstants.FeedingChargesDetail_Get,params).subscribe(res => {
      if (res !== null && res !== undefined) {
        if(res.Table.length !== 0){
        this.data = res.Table;
        this.data.forEach(i => {
          i.Flag = (i.Flag) ? 'Active' : 'Inactive';
        })
        this.disableExcel = false;
      }else{
        this.disableExcel = true;
      this._messageService.clear();
      this._messageService.add({
        key: 't-msg', severity: ResponseMessage.SEVERITY_WARNING,
        summary: ResponseMessage.SUMMARY_WARNING, detail: ResponseMessage.NoRecForCombination
      })
    }
  }
    else{
      this.disableExcel = true;
    this._messageService.clear();
    this._messageService.add({
      key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
      summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
    })
  }
    });
  
  }
  onRowSelect(event, selectedRow) {

  }
}
