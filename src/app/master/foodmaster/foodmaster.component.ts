import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
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
  
  selectedday: string;
  daysOptions: SelectItem[];


  constructor(private restApiService: RestAPIService, 
    private masterService: MasterService
   ) { }


  ngOnInit(): void {
    this.classes = this.masterService.getMaster('Food');
  }
  onSelect() {
    let classSelection = [];
    
        this.classes.forEach(c => {
          classSelection.push({  label : c.name, value: c.code })
        });
        this.daysOptions = classSelection;
        this.daysOptions.unshift({ label: '-select', value: null });
    }
  onview() {
    const params = { 
     
    }
   this.restApiService.getByParameters(PathConstants.DaysMaster_Get, params).subscribe(res => {
    if(res !== null && res !== undefined && res.length !==0) {
      console.log(res);
      this.data = res;
    }
    
  })
}
onSubmit() {
}

onClear() {
}
}
