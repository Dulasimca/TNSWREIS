import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-district-wise-dashboard',
  templateUrl: './district-wise-dashboard.component.html',
  styleUrls: ['./district-wise-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class DistrictWiseDashboardComponent implements OnInit {
  items: any[] = [];
  data: any[] = [];
  isScrollDown: boolean = true;

	constructor(private _restApiService: RestAPIService, private _scroller: ViewportScroller) {}
		
  ngOnInit(): void {
    this.loadData();
    this.items = [
      { 'name': 'Chennai', 'hcount': 120, 'boysHostelCount': 50, 'girlsHostelCount': 70, 'sanctionedBoysCount': 200
    , 'sanctionedGirlsCount': 200, 'boysCount': 85, 'girlsCount': 50 },
    { 'name': 'Chidambaram', 'hcount': 90, 'boysHostelCount': 42, 'girlsHostelCount': 38, 'sanctionedBoysCount': 120
    , 'sanctionedGirlsCount': 100, 'boysCount': 75, 'girlsCount': 35 },
    { 'name': 'Cuddalore', 'hcount': 80, 'boysHostelCount': 50, 'girlsHostelCount': 30, 'sanctionedBoysCount': 80
    , 'sanctionedGirlsCount': 60, 'boysCount': 70, 'girlsCount': 50 },
    { 'name': 'Dindigul', 'hcount': 95, 'boysHostelCount': 50, 'girlsHostelCount': 45, 'sanctionedBoysCount': 110
    , 'sanctionedGirlsCount': 90, 'boysCount': 102, 'girlsCount': 66 },
    { 'name': 'Dharmapuri', 'hcount': 112, 'boysHostelCount': 82, 'girlsHostelCount': 30, 'sanctionedBoysCount': 200
    , 'sanctionedGirlsCount': 120, 'boysCount': 180, 'girlsCount': 98 },
    { 'name': 'Krishnagiri', 'hcount': 95, 'boysHostelCount': 50, 'girlsHostelCount': 45, 'sanctionedBoysCount': 110
    , 'sanctionedGirlsCount': 90, 'boysCount': 102, 'girlsCount': 66 },
    { 'name': 'Madurai', 'hcount': 112, 'boysHostelCount': 82, 'girlsHostelCount': 30, 'sanctionedBoysCount': 200
    , 'sanctionedGirlsCount': 120, 'boysCount': 180, 'girlsCount': 98 },
    { 'name': 'Dindigul', 'hcount': 95, 'boysHostelCount': 50, 'girlsHostelCount': 45, 'sanctionedBoysCount': 110
    , 'sanctionedGirlsCount': 90, 'boysCount': 102, 'girlsCount': 66 },
    { 'name': 'Dharmapuri', 'hcount': 112, 'boysHostelCount': 82, 'girlsHostelCount': 30, 'sanctionedBoysCount': 200
    , 'sanctionedGirlsCount': 120, 'boysCount': 180, 'girlsCount': 98 },
    { 'name': 'Krishnagiri', 'hcount': 95, 'boysHostelCount': 50, 'girlsHostelCount': 45, 'sanctionedBoysCount': 110
    , 'sanctionedGirlsCount': 90, 'boysCount': 102, 'girlsCount': 66 },
    { 'name': 'Dindigul', 'hcount': 95, 'boysHostelCount': 50, 'girlsHostelCount': 45, 'sanctionedBoysCount': 110
    , 'sanctionedGirlsCount': 90, 'boysCount': 102, 'girlsCount': 66 },
    { 'name': 'Dharmapuri', 'hcount': 112, 'boysHostelCount': 82, 'girlsHostelCount': 30, 'sanctionedBoysCount': 200
    , 'sanctionedGirlsCount': 120, 'boysCount': 180, 'girlsCount': 98 },
    { 'name': 'Krishnagiri', 'hcount': 95, 'boysHostelCount': 50, 'girlsHostelCount': 45, 'sanctionedBoysCount': 110
    , 'sanctionedGirlsCount': 90, 'boysCount': 102, 'girlsCount': 66 },
    { 'name': 'Madurai', 'hcount': 112, 'boysHostelCount': 82, 'girlsHostelCount': 30, 'sanctionedBoysCount': 200
    , 'sanctionedGirlsCount': 120, 'boysCount': 180, 'girlsCount': 98 },
    { 'name': 'Madurai', 'hcount': 112, 'boysHostelCount': 82, 'girlsHostelCount': 30, 'sanctionedBoysCount': 200
    , 'sanctionedGirlsCount': 120, 'boysCount': 180, 'girlsCount': 98 },
    { 'name': 'Dindigul', 'hcount': 95, 'boysHostelCount': 50, 'girlsHostelCount': 45, 'sanctionedBoysCount': 110
    , 'sanctionedGirlsCount': 90, 'boysCount': 102, 'girlsCount': 66 },
    { 'name': 'Dharmapuri', 'hcount': 112, 'boysHostelCount': 82, 'girlsHostelCount': 30, 'sanctionedBoysCount': 200
    , 'sanctionedGirlsCount': 120, 'boysCount': 180, 'girlsCount': 98 },
    { 'name': 'Krishnagiri', 'hcount': 95, 'boysHostelCount': 50, 'girlsHostelCount': 45, 'sanctionedBoysCount': 110
    , 'sanctionedGirlsCount': 90, 'boysCount': 102, 'girlsCount': 66 },
    { 'name': 'Madurai', 'hcount': 112, 'boysHostelCount': 82, 'girlsHostelCount': 30, 'sanctionedBoysCount': 200
    , 'sanctionedGirlsCount': 120, 'boysCount': 180, 'girlsCount': 98 },
    ];
    this.items.forEach((i, index) => {
      console.log('ind', index)
      if(index < 5) {
        this.data.push(i)
      }
    })
    console.log('data', this.data)
  }

  loadData() {
    this._restApiService.getByParameters(PathConstants.DashboardCategory_Get, {'type': 2}).subscribe((res: any) => {
      if(res !== undefined && res !== null) {
        if(res.length !== 0) {
          this.items = res;
        }
      }
    })
  }

  scrollDown() {
    var curr_len = this.data.length;
    var max_len = curr_len + 5;
    this.items.forEach((i, index) => {
      if(index >= curr_len && index < max_len) {
        this.data.push(i)
      }
    })
    if(this.data.length === this.items.length) {
      this.isScrollDown = false;
    }
    this._scroller.scrollToAnchor("scroller");
  }

}
