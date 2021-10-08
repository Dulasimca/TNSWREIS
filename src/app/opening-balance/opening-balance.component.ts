import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { MasterService } from '../services/master-data.service';

@Component({
  selector: 'app-opening-balance',
  templateUrl: './opening-balance.component.html',
  styleUrls: ['./opening-balance.component.css']
})
export class OpeningBalanceComponent implements OnInit {

  commodityName: string;
  commodityOptions: SelectItem[];
  yearOptions:  SelectItem[];;
  unit: any;
  year: any;
  taluk: string;
  hostelName: string;
  district: string;
  unitOptions:  SelectItem[];
  talukOptions: SelectItem[];
  hostelOptions: SelectItem[];
  districtOptions: SelectItem[];
  quantity: any;
  entryDate: any;
  blncdata: any = [];
  showTable: boolean;
  
  units?: any;
  

  constructor(private masterService: MasterService) { }

  ngOnInit(): void {

    this.units = this.masterService.getMaster('U');

  }

  onSelect(type) {
    let unitSelection = [];
    switch (type) {
      case 'U':
        this.units.forEach(u => {
          unitSelection.push({ label: u.name, value: u.code });
        })
        this.unitOptions = unitSelection;
        this.unitOptions.unshift({ label: '-select', value: null });
        break;

}
  }
  onEdit(rowData) {

  }
  onView() {
    this.showTable = true;
  }
}
