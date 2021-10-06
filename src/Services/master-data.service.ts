import { Injectable, OnInit } from '@angular/core';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from './restAPI.service';

@Injectable({
  providedIn: 'root'
})

export class MasterService {
  masterData?: any = [];
  accountingData?: any = [];
  data?: any = [];
  constructor(private restApiService: RestAPIService) { }

  initializeMaster() {
      //console.log('hi');
   this.restApiService.get(PathConstants.DaysMaster_Get).subscribe(res => {
      this.data = res;
    });
   

  }

  getMaster(type): any {
    
      
    this.masterData = [];
    
    switch (type) {
      
      case 'Food':
        this.restApiService.get(PathConstants.DaysMaster_Get).subscribe(res => {
            this.data = res;
            this.data.forEach(c => {
                this.masterData.push({ name: c.Name +' / '+ c.NameTamil, code: c.Slno });
              })
          });
       
        break;

    }
    return this.masterData;
  }

}