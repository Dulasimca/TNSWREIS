import { Component, OnInit } from '@angular/core';
import {RadioButtonModule} from 'primeng/radiobutton';
import { MessageService } from 'primeng/api';
import { MasterService } from 'src/app/services/master-data.service';
import { RestAPIService } from 'src/app/services/restAPI.service';
//import { HttpErrorResponse } from '@angular/common/http';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';

@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  styleUrls: ['./district.component.css']
})
export class DistrictComponent implements OnInit {

  data:any;
  district:any
  selectedType:number;
  districtcode:number;
  cols:any
  selectedCategory: any = null;
  Districtname:any

  

  constructor(  private restApiService: RestAPIService, 
    private masterService: MasterService, private messageService: MessageService
   ) { }


  ngOnInit(): void {
   
    this.cols = [

      {field:'Districtcode',header: 'District Code'},
      {field:'Districtname',header: 'District Name'},
      {field:'Flag',header: 'Status'},

    ];
  }


  onSubmit() {
    const params = {
      'Districtcode': this.districtcode != undefined ? this.districtcode :0, 
      'Districtname': this.Districtname, 
      'Flag': 1, 
    };
      this.restApiService.post(PathConstants.DistrictMaster_post, params).subscribe(res => {
        
    });
  
  }

  onview(){
    this.restApiService.get(PathConstants.DistrictMaster_Get).subscribe(res => {
      if(res !== null && res !== undefined && res.length !==0) {
        this.data = res.Table;
        this.data.forEach(i => {
          i.Flag = (i.Flag) ? 'Active' : 'Inactive';
        })
       
      } 
      
    });

  }

  onRowSelect(event, selectedRow) {

    this.Districtname = selectedRow.Districtname;
    this.districtcode = selectedRow.Districtcode;
  }
  onClear(){

  }
}

    