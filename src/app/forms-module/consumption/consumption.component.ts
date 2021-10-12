import { Component, OnInit } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { TableConstants } from 'src/app/Common-Modules/table-constants';

@Component({
  selector: 'app-consumption',
  templateUrl: './consumption.component.html',
  styleUrls: ['./consumption.component.css']
})
export class ConsumptionComponent implements OnInit {
  consumption: string;
  consumptionOptions: SelectItem[];
  consumptions?: any;
  commodityOptions: SelectItem[];
  commodity: string;
  commodities?: any;
  unitOptions: SelectItem[];
  unit: string;
  units?: any;
  openingBalance: any;
  requiredQty: any;
  closingBalance: any;
  consumptionCols: any;
  consumptionData: any = [];
  loading: boolean;

  constructor(private _tableConstants: TableConstants) { }

  ngOnInit(): void {
    this.consumptionCols = this._tableConstants.consumptionColumns;
  }

  onSelect(id) {
    let consumptionSelection = [];
    let commoditySelection = [];
    let unitSelection = [];
    switch (id) {
      case 'CF':
        break;
      case 'CM':
        if (this.commodities !== undefined && this.commodities !== null) {
          this.commodities.forEach(c => {
            commoditySelection.push({ label: c.name, value: c.code });
          })
        }
        this.commodityOptions = commoditySelection;
        this.commodityOptions.unshift({ label: '-select-', value: null });
        break;
      case 'UN':
        if (this.units !== undefined && this.units !== null) {
          this.units.forEach(u => {
            unitSelection.push({ label: u.name, value: u.code });
          })
        }
        this.unitOptions = unitSelection;
        this.unitOptions.unshift({ label: '-select-', value: null });
        break;
    }
  }

  onEnter() {
    
  }

  onDelete(index) {

  }

  onSave() {

  }

}
