import { LocationStrategy } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';

@Component({
  selector: 'app-hostel-dashboard',
  templateUrl: './hostel-dashboard.component.html',
  styleUrls: ['./hostel-dashboard.component.css'],
})
export class HostelDashboardComponent implements OnInit {
  hostelName: string = '';
  hcode: any;
  info: HostelInfo = {} as HostelInfo;
  imgURL: string = '';
  responsiveOptions: any = [];
  data: any[] = [];
  attendanceData: any;
  chartOptions: any;
  menuItems: any[] = [];
  employeeList: any[] = [];
  galleryData: any[] = [];
  isGCircular: boolean = false;
  isFCircular: boolean = false;
  studentFData: any[] =[];
  hostelFData: any[] = [];
  totalArea: any = '-';
  buildingArea: any = '-';
  nFloors: any = '-';
  cwValue: any = 0;
  rfValue: any = 0;
  pgValue: any = 0;
  floorDetails: any[] = [];
  constructor(private _activatedRoute: ActivatedRoute, private _location: LocationStrategy,
    private _restApiService: RestAPIService) { }

  ngOnInit(): void {
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
    this._activatedRoute.queryParams.subscribe(params => {
      this.hcode = params["hcode"];
      this.hostelName = params["hname"];
      this.hostelName = 'Govt. ADW College Boys Hostel, Chengalpattu';
      this._location.replaceState('', '', 'hostel-dashboard', '')
    })
    var code = (this.hcode !== undefined && this.hcode !== null) ? this.hcode : 0;
    this.loadData(2376);
    this.data = [{ image: 'assets/layout/Home/Documents/TN_ADW_Food_Inspection.png', name: 'inspection' },
    { image: 'assets/layout/Home/Documents/TN_ADW_Hostel_Ground.png', name: 'ground' }];
    var keys = Object.keys(this.info);
    keys.forEach(k => {
      this.info[k] = '-';
    })
  }

  loadData(id) {
    var style = [
      { 'br_clr': '4px solid #28a745', 'bg-clr': '#b6ffc7', 'fbg-lt-clr': '#3b5998', 'fbg-rt-clr': '#bcd1fd' },
      { 'br_clr': '4px solid #2196f3', 'bg-clr': '#cee9ff', 'fbg-lt-clr': '#d06900', 'fbg-rt-clr': '#ffc992' },
      { 'br_clr': '4px solid #e91e63', 'bg-clr': '#ffdfea', 'fbg-lt-clr': '#e91e63', 'fbg-rt-clr': '#ffd6e4' },
      { 'br_clr': '4px solid #ff9800', 'bg-clr': '#ffe8c6', 'fbg-lt-clr': '#00bcd4', 'fbg-rt-clr': '#d0faff' },
    ];
    this._restApiService.getByParameters(PathConstants.HostelDetailDashboard_Get, { 'Code': id }).subscribe((res: any) => {
      if (res !== undefined && res !== null) {
        //hostel info
        if (res.Table.length !== 0) {
          res.Table.forEach(t => {
            this.info.hstlType = (t.FunctioningName !== undefined && t.FunctioningName !== null) ?
              t.FunctioningName : '-';
            this.info.buildingType = (t.HostelTypeName !== undefined && t.HostelTypeName !== null) ?
              t.HostelTypeName : '-';
            this.info.registeredCount = (t.StudentCount !== undefined && t.StudentCount !== null) ?
              t.StudentCount : '-';
            this.info.sanctionedCount = (t.sanctionedStength !== undefined && t.sanctionedStength !== null) ?
              t.sanctionedStength : '-';
            this.imgURL = (t.HostelImage !== undefined && t.HostelImage !== null) ?
              'assets/layout/' + t.Code + '/' + t.HostelImage : '';
          })
        }
        //hostel menu info
        if (res.Table3.length !== 0) {
          res.Table3.forEach(t3 => {
            var keys = Object.keys(t3);
            for (let k = 0; k < keys.length; k++) {
              if (keys[k] === 'Breakfast' || keys[k] === 'Dinner' || keys[k] === 'Snacks' || keys[k] === 'Lunch') {
                this.menuItems.push({
                  'iType': keys[k],
                  'iName': t3[keys[k]]
                })
              }
            }
          })
        }
        //infra info
        if(res.Table1.length !== 0) {
          this.totalArea = res.Table1[0].TotalArea;
          this.buildingArea = res.Table1[0].BuildingArea;
          this.nFloors = res.Table1[0].NoOfFloor;
          this.cwValue = 0;
          this.rfValue = res.Table1[0].RampFacilityCheck;
          this.pgValue = res.Table1[0].PlaygroundCheck;
          let ind = -1;
          res.Table1.forEach(t1 => {
            if (ind >= style.length - 1) {
              ind = 0;
            } else {
              ind += 1;
            }
            this.floorDetails.push({
              'floorNo': (t1.FloorNo !== undefined && t1.FloorNo !== null) ? ((t1.FloorNo !== '0') ? t1.FloorNo + 'st' : 'G') : '-',
              'bthRoom': (t1.BathRoomNos !== undefined && t1.BathRoomNos !== null) ? t1.BathRoomNos : '-',
              'ktRoom': (t1.Kitchen !== undefined && t1.Kitchen !== null) ? t1.Kitchen : '-',
              'lbRoom': (t1.Library !== undefined && t1.Library !== null) ? t1.Library : '-',
              'stRoom': (t1.StudentRoom !== undefined && t1.StudentRoom !== null) ? t1.StudentRoom : '-',
              'stdyArea': (t1.StudyingArea !== undefined && t1.StudyingArea !== null) ? t1.StudyingArea : '-',
              'tlRoom': (t1.ToiletRoomNos !== undefined && t1.ToiletRoomNos !== null) ? t1.ToiletRoomNos : '-',
              'urRoom': (t1.UrinalNos !== undefined && t1.UrinalNos !== null) ? t1.UrinalNos : '-',
              'wrdRoom': (t1.WardenRoom !== undefined && t1.WardenRoom !== null) ? t1.WardenRoom : '-',
              'fLBGColor': style[ind]['fbg-lt-clr'],
              'fRBGColor': style[ind]['fbg-rt-clr']
            })
          })
        }
        //hostel employee info
        if (res.Table7.length !== 0) {
          let ind = -1;
          res.Table7.forEach(t7 => {
            if (ind >= style.length - 1) {
              ind = 0;
            } else {
              ind += 1;
            }
            this.employeeList.push({
              'eName': t7.FirstName,
              'eId': t7.ID,
              // 'eImage': 'assets/layout/'+i.ID +'/' + '/Documents' + t7.EmployeeImage,
              'eImage': 'assets/layout/images/female.png',
              'eDesignation': t7.DesignationName,
              'eBRClr': style[ind]['br_clr'],
              'eBGColor': style[ind]['bg-clr']
            })
          })
        }
        //hostel gallery info 
        if (res.Table6.length !== 0) {
          var tempArr = [];
          res.Table6.forEach(t6 => {
            tempArr.push({
              'name': t6.ImageDescription,
              // 'image': '../../assets/layout/' + id + '/Events/2021-2022/' + t6.ImageName
              'image': 'assets/layout/Home/Documents/TN_ADW_Hostel_Ground.png'
            })
          })
          this.isGCircular = (tempArr.length > 1) ? true : false;
          this.galleryData = tempArr;
        }
        //facility info
        if(res.Table5.length !== 0) {
          res.Table5.forEach(t5 => {
            if(t5.FacilityTypeId === 1) {
              this.studentFData.push({
                'title': t5.FacilityName,
                'count': t5.NoOfCounts
              })
            } else {
              this.hostelFData.push({
                'title': t5.FacilityName,
                'count': t5.NoOfCounts
              })
            }
          })
        }
        //hostel attendance info
        if (res.Table2.length !== 0) {
          var curDate = new Date().getDate();
          res.Table2.forEach(t2 => {
            var date = new Date(t2.AttendanceDate).getDate();
            if (curDate === date) {
              t2.key = 'T';
              this.info.attendanceTdyCount = (t2.NOOfStudent !== undefined && t2.NOOfStudent !== null) ?
                t2.NOOfStudent : '-';
            } else {
              t2.key = 'Y';
              this.info.attendanceStrdyCount = (t2.NOOfStudent !== undefined && t2.NOOfStudent !== null) ?
                t2.NOOfStudent : '-';
            }
          })
        }
        this.chartOptions = {
          responsive: true,
          type: 'line',
          bezierCurve: false,
          plugins: {
            legend: {
              labels: {
                color: '#495057'
              }
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#495057'
              },
              grid: {
                color: '#ebedef'
              }
            },
            y: {
              ticks: {
                color: '#495057'
              },
              grid: {
                color: '#ebedef'
              }
            }
          }

        }
      }
    })
  }
}


export interface HostelInfo {
  sanctionedCount: any;
  registeredCount: any;
  attendanceStrdyCount: any;
  attendanceTdyCount: any;
  hstlType: string;
  buildingType: string;
}


