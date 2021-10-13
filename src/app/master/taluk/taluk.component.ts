import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SelectItem } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BlockUI, NgBlockUI } from 'ng-block-Ui';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';

@Component({
  selector: 'app-taluk',
  templateUrl: './taluk.component.html',
  styleUrls: ['./taluk.component.css']
})
export class TalukComponent implements OnInit {

  
  data:any;
  taluk:any
  selectedCategory: any = null;
  districtOptions:SelectItem[];
  selectdistrict:any
  selectedType: number;
  cols:any
  Talukid:number;
  classes?: any;
  

  constructor( private http: HttpClient, private restApiService: RestAPIService, 
    private masterService: MasterService, private messageService: MessageService
   ) { }

  ngOnInit(): void {
    
    this.classes = this.masterService.getMaster('DT');
    
    this.cols = [

      {field:'Districtcode',header: 'District Code'},
      
      {field:'Districtname',header: 'District Name'},
      {field:'Talukname',header: 'Taluk Name'},
      {field:'Flag',header: 'Status'},
      

    ];

  }

  onSelect() {
    
   this.classes = this.masterService.getMaster('DT');
    let districtSelection = [];
        this.classes.forEach(d => {
          districtSelection.push({  label : d.name, value: d.code })
        });
        this.districtOptions = districtSelection;
        this.districtOptions.unshift({ label: '-select', value: null });
    }



  onSubmit(){

    console.log('hi')
   // this.blockUI.start();
   console.log(this.selectdistrict.value)
    const params = {
      
      'Talukid': this.Talukid != undefined ? this.Talukid :0, 
      'Districtcode': this.selectdistrict.value,
      'Talukname': this.taluk,  
      'Talukcode': "A",   
      'Flag': 1,   
    };
    console.log(params)
    this.restApiService.post(PathConstants.TalukMaster_post, params).subscribe(res => {
        
    });

  }
  onview(){
    this.restApiService.get(PathConstants.TalukMaster_Get).subscribe(res => {
      if(res !== null && res !== undefined && res.length !==0) {
         this.data = res.Table;
         this.data.forEach(i => {
          i.Flag = (i.Flag) ? 'Active' : 'Inactive';
        })

      } 
      
    });
  }

  onRowSelect(event, selectedRow) {
    this.Talukid = selectedRow.Talukid;
    this.classes = this.masterService.getMaster('DT');
   
       this.taluk=selectedRow.Talukname;
      let districtSelection = [];
      this.classes.forEach(d => {
      if(selectedRow.Districtcode==d.code)
      {
        districtSelection.push({  label : d.name, value: d.code })
      }
    });
      this.districtOptions=districtSelection;
    
      this.selectdistrict=districtSelection[0];
     
      this.selectedType=selectedRow.Flag;
  }

}
