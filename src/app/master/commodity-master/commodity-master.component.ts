import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { BooleanLiteral } from 'typescript';

@Component({
  selector: 'app-commodity-master',
  templateUrl: './commodity-master.component.html',
  styleUrls: ['./commodity-master.component.css']
})
export class CommodityMasterComponent implements OnInit {
  
  commodityName: string;
  commodityTamilName: string;
  selectedType: number;
  commodityGroup: any;
  cgroupOptions: SelectItem [];
  commodityId: any;
  cdata: any = [];
  showTable: boolean;

  @ViewChild('f', { static: false }) _commodityMaster: NgForm;


  constructor(private restApiService: RestAPIService, private messageService: MessageService) { }

  ngOnInit(): void {
    this.commodityId = 0;
  }

  onSelect(type)
  {

  }
  onEdit(rowData) {

  }
  onSave()
{
  const params = {
    'Id': this.commodityId,
    'Name': this.commodityName,
    'NameTamil': this.commodityTamilName,
    'CommodityGroupId': this.commodityGroup,
    'Flag': this.selectedType

  };
  this.restApiService.post(PathConstants.CommodityMaster_Post,params).subscribe(res => {
    if (res) {
      console.log('s',res);
      this.clearform();
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
  clearform() {
    this._commodityMaster.reset();
  }
  onView() {
     this.showTable = true;
  }

}

