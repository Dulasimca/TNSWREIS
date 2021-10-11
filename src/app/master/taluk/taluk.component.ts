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
  
  cols:any
  Talukid:number;
  classes?: any;
  categories: any[] = [{name: 'Active', key: 'A'}, {name: 'InActive', key: 'M'},];

  constructor( private http: HttpClient, private restApiService: RestAPIService, 
    private masterService: MasterService, private messageService: MessageService
   ) { }

  ngOnInit(): void {
    
    this.classes = this.masterService.getMaster('DT');
    this.selectedCategory = this.categories[1];

    this.cols = [

      {field:'Districtcode',header: 'District Code'},
      
      {field:'Districtname',header: 'District Name'},
      {field:'Talukname',header: 'Taluk Name'},
      

    ];

  }

  onSelect() {
    
   this.classes = this.masterService.getMaster('DT');
    let districtSelection = [];
        this.classes.forEach(d => {
          districtSelection.push({  label : d.name, value: d.value })
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
      } 
      
    });
  }

  onRowSelect(event, selectedRow) {
    this.Talukid = selectedRow.Talukid;
    this.classes = this.masterService.getMaster('DT');
    console.log(this.classes)
       this.taluk=selectedRow.Talukname;
      let districtSelection = [];
      this.classes.forEach(d => {
      if(selectedRow.Districtcode==d.value)
      {
        districtSelection.push({  label : d.name, value: d.value })
      }
    });
      this.districtOptions=districtSelection;
    
      this.selectdistrict=districtSelection[0];
      console.log(this.selectdistrict)

  }

}
