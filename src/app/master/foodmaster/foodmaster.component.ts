import { Component, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
//import { ResponseMessage } from 'src/app/Common-Module/Message';
//import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';


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
  selectedday: string;
  daysOptions: SelectItem[];
  Slno:any;
  //@BlockUI() blockUI: NgBlockUI;
  public progress: number;
  public message: string;

  //  NewFileName:string;
  //  @ViewChild('f', { static: false }) _bookForm: NgForm;
  //  @Output() public onUploadFinished = new EventEmitter();
  constructor( private http: HttpClient, private restApiService: RestAPIService, 
    private masterService: MasterService, private messageService: MessageService
   ) { }


  ngOnInit(): void {
    this.classes = this.masterService.getMaster('Food');
    this.cols = [
       {field:'Slno',header: 'ID'},
       {field: 'selectedday',header: 'Weekdays'},
       {field: 'BreakFast',header:'BreakFast:காலை உணவு'},
       {field: 'Lunch',header:'Lunch:மதிய உணவு'},
       {field:'Snacks',header: 'Snacks:சிற்றுண்டி'},
       {field: 'Dinner',header: 'Dinner:இரவு உணவு'},
     
       
     ];
     this.Slno=0;
  }
  onSelect() {
    let classSelection = [];
    
        this.classes.forEach(c => {
          classSelection.push({  label : c.name, value: c.code })
        });
        this.daysOptions = classSelection;
        this.daysOptions.unshift({ label: '-select', value: null });
    }
    // public uploadFile = (files) => {
    //   if (files.length === 0) {
    //     return;
    //   }
      
    //   this.formData = new FormData()
    //   let fileToUpload: any = <File>files[0];
   
    //   const filename = fileToUpload.name + '^' + FileUploadConstant.Booksfolder;
    //   this.formData.append('file', fileToUpload, filename);
    //   console.log('file', fileToUpload);
    //   console.log('formdata', this.formData);
    //   this.NewFileName=fileToUpload.name;
    //   this.http.post(this.restApiService.BASEURL +PathConstants.FileUpload_Post, this.formData)
    //     .subscribe(event => 
    //       {
    //     //          if (event.type === HttpEventType.UploadProgress)
    //     //    this.progress = Math.round(100 * event.loaded / event.total);
    //     //   else if (event.type === HttpEventType.Response) {
    //     //    this.message = 'Upload success.';
          
    //     //  //   this.onUploadFinished.emit(event.body);
    //     //   }
    //     }
    //     );
    // }  
  
    onSubmit() {  
      //this.blockUI.start();
      const params = {
        'Slno': this.Slno,
        'DayId': this.selectedday,
        'Breakfast': this.BreakFast,  
        'Lunch': this.Lunch,     
        'Snacks': this.Snacks,
        'Dinner': this.Dinner,  
        
      };
      
      console.log(params);
      this.restApiService.post(PathConstants.FoodMaster_Post, params).subscribe(res => {
        if(res !== undefined && res !== null) {
          if (res) {
  
        //     this.blockUI.stop();
        //     this.onClear();
        //     this.messageService.clear();
        //     this.messageService.add({
        //       key: 't-msg', severity: ResponseMessage.SEVERITY_SUCCESS,
        //       summary: ResponseMessage.SUMMARY_SUCCESS, detail: ResponseMessage.SuccessMessage
        //     });
        //     this.message = 'Upload success.';
  
        //   } else {
        //     this.blockUI.stop();
        //     this.messageService.clear();
        //     this.messageService.add({
        //       key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
        //       summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        //     });
        //   }
        //   } else {
        //   this.messageService.clear();
        //   this.messageService.add({
        //     key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
        //     summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
        //   });
        //   }
        //   }, (err: HttpErrorResponse) => {
        //   this.blockUI.stop();
        //   if (err.status === 0 || err.status === 400) {
        //     this.messageService.clear();
        //     this.messageService.add({
        //       key: 't-msg', severity: ResponseMessage.SEVERITY_ERROR,
        //       summary: ResponseMessage.SUMMARY_ERROR, detail: ResponseMessage.ErrorMessage
         //   })
         }
         }
        })
    }
          
  onview() {
    const params = { 
     
    }
    
   this.restApiService.getByParameters(PathConstants.DaysMaster_Get, params).subscribe(res => {
    if(res !== null && res !== undefined && res.length !==0) {
      this.data = res;
    }
    
  });

//   onRowSelect(event, selectedRow) {
//     // this.Slno = selectedRow.RowId;

//     // let classSelection = [];
//     // this.classes.forEach(c => {
//     //   if(selectedRow.ClassId==c.code)
//     //   classSelection.push({ label: c.name, value: c.code })
//     // });
    
//     // this.daysOptions  = classSelection;
//     // this.selectedday = selectedRow.DayId;
//     // this.BreakFast = selectedRow.Breakfast;
//     // this.Lunch = selectedRow.Lunch;
//     // this.Snacks=selectedRow.Snacks;
//     // this.Dinner=selectedRow.Dinner;
// }
}
} 