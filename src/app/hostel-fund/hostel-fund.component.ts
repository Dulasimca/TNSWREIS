import { Component, OnInit } from '@angular/core';
 
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { MessageService, SelectItem } from 'primeng/api';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { TableConstants } from 'src/app/Common-Modules/table-constants';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';


@Component({
  selector: 'app-hostel-fund',
  templateUrl: './hostel-fund.component.html',
  styleUrls: ['./hostel-fund.component.css']
})
export class HostelFundComponent implements OnInit {
  Damount : any;
  totalBudjetAmount: number;
  accYear: any;
  year: any;
  years?: any;
  district: any;
  districts?: any;
  taluk: any;
  taluks?: any;
  districtOptions: SelectItem[];
  yearOptions: SelectItem[];
  talukOptions: SelectItem[];
  toFundId: number;
  doFundId: number;
  blncAmount: number;
  totalTalukAmount: number;
  groupType: any;
  selectDistrict: any;
  accHead: any;
  budgetAmount: number;
  talukAmount: number;
  DistrictFundData: any = [];
  DistrictFundCols: any = [];
  showTable: boolean;
  districtFund: number;
  districtname: any;
  


  // @ViewChild('f', { static: false }) _toFundForm: NgForm;
  @BlockUI() blockUI: NgBlockUI;
  show: boolean;
  accFundId: any;

  constructor(private masterService: MasterService, private restApiService: RestAPIService, private messageService: MessageService,
    private tableConstants: TableConstants) { }

  ngOnInit(): void {
    this.years = this.masterService.getMaster('AY');
    this.districts = this.masterService.getMaster('DT');
    this.taluks = this.masterService.getMaster('TK');
    this.DistrictFundCols = this.tableConstants.DistrictFundColumns;
    this.totalTalukAmount = 0;
    this.toFundId = 0;
     
  }
  
  onSelect(type) {
    let districtSelection = [];
    let talukSelection = [];
    let yearSelection = [];
    switch (type) {
      case 'Y':
        this.years.forEach(y => {
          yearSelection.push({ label: y.name, value: y.code });
        })
        this.yearOptions = yearSelection;
        this.yearOptions.unshift({ label: '-select', value: null });
        break;
      case 'D':
        this.districts.forEach(d => {
          districtSelection.push({ label: d.name, value: d.code });
        })
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select-', value: null });
        break;
      case 'T':
        this.taluks.forEach(t => {
          if (t.dcode === this.selectDistrict) {
            talukSelection.push({ label: t.name, value: t.code });
          }
          console.log('rs',this.taluks)
        })
        this.talukOptions = talukSelection;
        this.talukOptions.unshift({ label: '-select', value: null });
        break;
    }

  }
  loadTable() {
    // this.districtname = this.selectDistrict;
    const data = {
      'AccountingYearId': this.year,
    }
    this.restApiService.getByParameters(PathConstants.AccHeadFundAllotment_Get, data).subscribe(res => {
      if (res) {
        res.forEach(r => {
          this.accFundId = r.AccHeadID;
          this.totalBudjetAmount = r.BudjetAmount;
        })
        this.DistrictFundData = res;

      }
    })
  }
    load() {
    this.showTable = true;
    const params = {
      'AccHeadFundId': this.accFundId,
      'DCode': this.selectDistrict,
      'Type': 2
    }
    this.restApiService.getByParameters(PathConstants.DOFundAllotment_Get, params).subscribe(res => {
      if (res) {
        res.forEach(r => {
          this.doFundId = r.DOFundId
        })
        // this.DistrictFundData = res;
      }
    })
  }
  
  // to load district amount
  loadAmount() {
    this.taluk = null;
    this.districtFund = 0;
    if (this.accFundId !== null && this.accFundId !== undefined && this.district !== null && this.district !== undefined) {
      this.blockUI.start();
      const params = {
      'AccHeadFundId': this.accFundId,
      'DCode': this.district,
      'Type': 2
      }
      this.restApiService.getByParameters(PathConstants.DOFundAllotment_Get, params).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            res.forEach(r => {
              this.districtFund = (r.DistrictAmount !== undefined && r.DistrictAmount !== null) ? r.DistrictAmount : 0;
              this.doFundId = r.DOFundId;
              this.blockUI.stop();
            })
            
  //           this.blncAmount = 0;
  //           this.totalTalukAmount = 0;
  //           if (this.blncAmount === 0) {
  //             this.blockUI.start();
  //             const data = {
  //               'AccHeadFundId': this.accFundId,
  //               'DCode': this.district,
  //               'Type': 1
  //             }
  //             this.restApiService.getByParameters(PathConstants.TOFundAllotment_Get, data).subscribe(res => {
  //               if (res !== null && res !== undefined) {
  //                 if (res.length !== 0) {
  //                   res.forEach(res => {
  //                     this.totalTalukAmount = (res.BalanceBudjetAmount !== undefined && res.BalanceBudjetAmount !== null)
  //                       ? (res.BalanceBudjetAmount * 1) : 0;
  //                     this.blockUI.stop();
  //                   })
  //                 } else {
  //                   this.blockUI.stop();
  //                   this.blncAmount = 0;
  //                 }
  //               } else {
  //                 this.blockUI.stop();
  //                 this.blncAmount = 0;
  //               }
  //               this.blncAmount = this.districtFund - this.totalTalukAmount;
  //             });
  //           }
  //         } else {
  //           this.blockUI.stop();
  //         }
  //       } else {
  //         this.blockUI.stop();
  //       }

      }
    }
  })
      
    }
    
  //   this.loadToFunds();
  
  }
  
  
  
          
          

  onSave() {
    const params = {
      'ToFundId': this.toFundId,
      'DoFundId': this.doFundId,
      'AccHeadFundId': this.accFundId,
      'DCode': this.district,
      'TCode': this.taluk,
      'TalukAmount': this.talukAmount,
      'Flag': 1
    }
    this.restApiService.post(PathConstants.TOFundAllotment_Post, params).subscribe(res => {
      if (res) {
        var message = (this.toFundId === 0) ? ResponseMessage.SuccessMessage : ResponseMessage.UpdateMsg;
        // this.clearForm();
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

  loadToFunds() {
    this.talukAmount = null;
    if (this.accFundId !== undefined && this.accFundId !== null && this.taluk !== null && this.taluk !== undefined) {
      this.blockUI.start();
      const data = {
        'AccHeadFundId': this.accFundId,
        'TCode': this.taluk,
        'Type': 2
      }
      this.restApiService.getByParameters(PathConstants.TOFundAllotment_Get, data).subscribe(res => {
        if (res !== null && res !== undefined) {
          if (res.length !== 0) {
            res.forEach(res => {
              this.talukAmount = res.TalukAmount;
              this.blockUI.stop();
            })
          } else {
            this.blockUI.stop();
            this.talukAmount = 0;
          }
        } else {
          this.blockUI.stop();
          this.talukAmount = 0;

        }
      });
    
    this.blncAmount = 0;
              this.totalTalukAmount = 0;
              if (this.blncAmount === 0) {
                this.blockUI.start();
                const data = {
                  'AccHeadFundId': this.accFundId,
                  'TCode': this.district,
                  'Type': 1
                }
                this.restApiService.getByParameters(PathConstants.TOFundAllotment_Get, data).subscribe(res => {
                  if (res !== null && res !== undefined) {
                    if (res.length !== 0) {
                      res.forEach(res => {
                        this.totalTalukAmount = (res.BalanceBudjetAmount !== undefined && res.BalanceBudjetAmount !== null)
                          ? (res.BalanceBudjetAmount * 1) : 0;
                        this.blockUI.stop();
                      })
                    } else {
                      this.blockUI.stop();
                      this.blncAmount = 0;
                    }
                  } else {
                    this.blockUI.stop();
                    this.blncAmount = 0;
                  }
                  this.blncAmount = this.districtFund - this.totalTalukAmount;
                });
              }
             else {
              this.blockUI.stop();
            }
          } else {
            this.blockUI.stop();
          }
  
        
      }
    

  checkBudjetAmount() {
    if (this.blncAmount !== undefined && this.blncAmount !== null &&
      this.talukAmount !== undefined && this.talukAmount !== null &&
      this.blncAmount !== NaN && this.talukAmount !== NaN) {
      if ((this.blncAmount * 1) < (this.talukAmount * 1)) {
        var msg = 'Entering amount should not be greater than available budget amount !';
        this.messageService.clear();
        this.messageService.add({
          key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
          summary: ResponseMessage.SUMMARY_ERROR, detail: msg
        });
        this.talukAmount = null;
      }
    }
  }
  onAdd(rowData) {
    this.show = true;
    this.accYear = rowData.ShortYear;
    this.groupType = rowData.GroupName;
    this.accHead = rowData.AccountHeadName;
    this.budgetAmount = rowData.Amount;
    this.district = rowData.Districtname;
  }

  clearForm() {
    // this._toFundForm.reset();
    this.districtOptions = [];
    this.talukOptions = [];
    this.yearOptions = [];
    this.totalTalukAmount = 0;
  }

}
