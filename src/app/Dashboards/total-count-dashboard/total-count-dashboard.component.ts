import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
// import * as HighchartsMore from "highcharts/highcharts-more";
import More from 'highcharts/highcharts-more'
import { PathConstants } from 'src/app/Common-Modules/PathConstants';
import { RestAPIService } from 'src/app/services/restAPI.service';
More(Highcharts)

@Component({
  selector: 'app-total-count-dashboard',
  templateUrl: './total-count-dashboard.component.html',
  styleUrls: ['./total-count-dashboard.component.css']
})
export class TotalCountDashboardComponent implements OnInit {
  data: any[] = [];
  tempArr: any[] = [];
  ugArr: any[] = [];
  pgArr: any[] = [];
  highcharts = Highcharts;
  highchartss = Highcharts
  chartOptions: any;
  barchartOptions : any;
  chartLabels: any[];
  pgChartOptions: any;
  ugChartOptions: any;

  constructor(private restApiService: RestAPIService) { }

  ngOnInit(): void {
     this.loadChartData();
 
   // this.restApiService.get(PathConstants.CMDashboardGraph_Get).subscribe(res => {

   // })

    this.restApiService.get(PathConstants.CMMainDashBoard_Get).subscribe(res =>{
      res.forEach(x => {
        var obj = x;
        var keys = Object.keys(obj);
        console.log('test',keys)
        for(let k=0; k<keys.length; k++){
          console.log('p',x[keys[k]])
          var name: string = x['name'];
          if(name.toLowerCase() === 'school') {
            if(keys[k] !== 'name' && keys[k] !== 'Id') {
          this.tempArr.push({
             name: keys[k],
            y: x[keys[k]],
          })
        }
        }
        if(name.toLowerCase() === 'college-ug') {
         if(keys[k] !== 'name' && keys[k] !== 'Id') {
       this.ugArr.push({
          name: keys[k],
         y: x[keys[k]],
       })
       console.log('ugArr',this.ugArr)
     }
     }
     if(name.toLowerCase() === 'college-pg') {
      if(keys[k] !== 'name' && keys[k] !== 'Id') {
    this.pgArr.push({
       name: keys[k],
      y: x[keys[k]],
    })
    console.log('pgArr',this.pgArr)
  }
  }
      }
      })
    console.log('d',this.tempArr)
    this.data = this.tempArr;
    //  Highcharts.setOptions({
    //   });
    this.chartOptions = {
      colors:  
      [' #00ffff' , '#1fe8f0', '#5cbad1', '#998cb2', '#b875a3', '#cc6699'],
     
      credits: {
        enabled: false
     },
     chart: {
        plotBorderWidth: null,
        plotShadow: false
     },
     title: {
        text: 'School Hostel'
     },
     tooltip: {
        pointFormat: '{series.name}: <b>{point.y:.0f}</b>'
     },
     plotOptions: {
        pie: {
           allowPointSelect: true,
           cursor: 'pointer',
           dataLabels: {
              enabled: false,
              format: '<b>{point.name}%</b>:{point.y:.0f}',
              distance: '-30%',
           },
            showInLegend: true
        }
     },
     series: [{
        type: 'pie',
        name: 'Count',
        colorByPoint: true,
        data: this.tempArr,
     }]
  };

  //pie-chart 2 - College-UG Hostel
  this.ugChartOptions = {
     colors :[ '#ccff33' , ' #99ff59', '#66ff80', '#3dff9e',  '#14ffbd','#00ffcc'],

   credits: {
     enabled: false
  },
  chart: {
     plotBorderWidth: null,
     plotShadow: false
  },
  title: {
     text: 'College-UG Hostel'
  },
  tooltip: {
     pointFormat: '{series.name}: <b>{point.y:.0f}</b>'
  },
  plotOptions: {
     pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
           enabled: false,
           format: '<b>{point.name}%</b>:{point.y:.0f}',
           distance: '-30%',
        },
         showInLegend: true
     }
  },
  series: [{
     type: 'pie',
     name: 'Count',
     colorByPoint: true,
     data: this.ugArr,
  }]
};

  //clge PG 
this.pgChartOptions = {
  colors :['#b599b278','#987294b8','#987294','#8b5a85','#653c60','#452942'],
credits: {
  enabled: false
},
chart: {
  plotBorderWidth: null,
  plotShadow: false
},
title: {
  text: 'College-PG Hostel'
},
tooltip: {
  pointFormat: '{series.name}: <b>{point.y:.0f}</b>'
},
plotOptions: {
  pie: {
     allowPointSelect: true,
     cursor: 'pointer',
     dataLabels: {
        enabled: false,
        format: '<b>{point.name}%</b>:{point.y:.0f}',
        distance: '-30%',
     },
      showInLegend: true
  }
},
series: [{
  type: 'pie',
  name: 'Count',
  colorByPoint: true,
  data: this.pgArr,
}]
};
})
  }
  

  //bar chart
  loadChartData ()  {
   this.restApiService.get(PathConstants.CMDashboardGraph_Get).subscribe((response: any[]) => {
      if (response !== undefined && response !== null && response.length !== 0) {
        this.chartLabels = response[1];
console.log('l',this.chartLabels)
   this.barchartOptions = {
      title: {
         text: 'Hostel Employee Count'
       },
       series: [{ data: response[2], name: 'Chef/Cook', color: '#2d6b6a' },
       { data: response[3], name: 'Deputy Warden', color: '#c7c714' },
       { data: response[4], name: 'Sweeper', color: '#921740' },
       { data: response[5], name: 'Watchman', color: '#98696f' },

      ],

       plotOptions: {
         bar: {
           dataLabels: {
             enabled: true
           }
         },
         series: {
           stacking: 'normal',
           pointWidth: '25',
           pointPadding: 0,
           borderWidth: 0
         }
       },
       chart: {
         type: "column"
       },
       credits: {
         enabled: false
       },
       xAxis: {
         categories: this.chartLabels
       },
       yAxis: {
         min: 0,
         title: {
           text: 'Total Count in No s',
           align: 'high'
         },

         stackLabels: {
           enabled: true,
           style: {
            fontWeight: 'bold',
             overflow: 'justify',
             
           }
         }
       },
       legend: {
         align: 'right',
         x: -10,
         verticalAlign: 'top',
         y: 5,
         floating: false,
         borderColor: '#CCC',
         borderWidth: 1,
         shadow: false
       },
     };
   }
})
  }
}

