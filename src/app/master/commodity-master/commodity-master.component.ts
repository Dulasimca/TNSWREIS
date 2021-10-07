import { Component, OnInit } from '@angular/core';
import { BooleanLiteral } from 'typescript';

@Component({
  selector: 'app-commodity-master',
  templateUrl: './commodity-master.component.html',
  styleUrls: ['./commodity-master.component.css']
})
export class CommodityMasterComponent implements OnInit {
  
  commodityName: string;
  commodityTamilName: string;
  active: boolean;
  inactive: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
