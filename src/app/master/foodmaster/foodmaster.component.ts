import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ResponseMessage } from 'src/app/Common-Modules/messages';
import { BlockUI, NgBlockUI } from 'ng-block-Ui';
import { Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-foodmaster',
  templateUrl: './foodmaster.component.html',
  styleUrls: ['./foodmaster.component.css']
})
export class FoodmasterComponent implements OnInit {
  
  BreakFast: string;
  Lunch:string;
  Snacks:string;
  Dinner:string;
  data:any;
  classes?: any;
  cols: any;
  selectedday: any;
  daysOptions: SelectItem[];
  Slno:any;
  @BlockUI() blockUI: NgBlockUI;
  public progress: number;
  public message: string;

  @ViewChild('f', { static: false }) foodmasterForm: NgForm;
  constructor( private http: HttpClient, private restApiService: RestAPIService, 
    private masterService: MasterService, private messageService: MessageService
   ) { }


  ngOnInit(): void {
    this.classes = this.masterService.getMaster('FD');
    
    this.cols = [
       {field:'Slno',header: 'ID'},
       {field: 'Name',header: 'Weekdays:வார நாட்கள்'},
       {field: 'BreakFast',header:'BreakFast:காலை உணவு'},
       {field: 'Lunch',header:'Lunch:மதிய உணவு'},
       {field:'Snacks',header: 'Snacks:சிற்றுண்டி'},
       {field: 'Dinner',header: 'Dinner:இரவு உணவு'},
     ];
  }
  onSelect() {
    let foodSelection = [];
        this.classes.forEach(d => {
          foodSelection.push({  label : d.name, value: d.code })
        });
        this.daysOptions = foodSelection;
        this.daysOptions.unshift({ label: '-select', value: null });
    }
   
    onSubmit() {  
      this.blockUI.start();
      const params = {
        'Slno': this.Slno != undefined ? this.Slno : 0,
        'DayId': this.selectedday.value,
        'Breakfast': this.BreakFast,  
        'Lunch': this.Lunch,     
        'Snacks': this.Snacks,
        'Dinner': this.Dinner,  
        
      };
      
      
      this.restApiService.post(PathConstants.FoodMaster_Post, params).subscribe(res => {
        if(res !== undefined && res !== null) {
          if (res) {
  
            this.blockUI.stop();
            this.onClear();
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
              summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
            });
           
  
          } else {
            this.blockUI.stop();
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
              summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
            });
          }
          } else {
          this.messageService.clear();
          this.messageService.add({
            key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
            summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
          });
          }
          }, (err: HttpErrorResponse) => {
          this.blockUI.stop();
          if (err.status === 0 || err.status === 400) {
            this.messageService.clear();
            this.messageService.add({
              key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
              summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
           })
         
         }
        })
    }
          
  onview() {
   this.restApiService.get(PathConstants.FoodMaster_Get).subscribe(res => {
    if(res !== null && res !== undefined && res.length !==0) {
      this.data = res.Table;
    }
    
  });


}

  onRowSelect(event, selectedRow) {
    this.Slno = selectedRow.Slno;


    let foodSelection = [];
    this.classes.forEach(d => {
      if(selectedRow.DayId==d.code)
      {
      foodSelection.push({  label : d.name, value: d.code })
      }
    });
    this.daysOptions = foodSelection;
    this.selectedday = selectedRow.DayId;
    this.BreakFast = selectedRow.BreakFast;
    this.Lunch = selectedRow.Lunch;
    this.Snacks=selectedRow.Snacks;
    this.Dinner=selectedRow.Dinner;
}

onClear() {
  this.foodmasterForm.reset();
    this.foodmasterForm.form.markAsUntouched();
    this.foodmasterForm.form.markAsPristine();
    this.BreakFast='',
    this.Lunch='',
    this.Snacks='',
    this.Dinner=''

}
}