import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  hostelCount: number;
  wardenCount: number;
  studentCount: number;
  chartOptions: any;
  consumptionData: any;
  expensesToday: any;
  expensesMonthly: any;
  constructor() { }

  ngOnInit(): void {
    this.hostelCount = 877;
    this.wardenCount = 871;
    this.studentCount = 1577;
    this.expensesToday = 10147;
    this.expensesMonthly = 45871;
    this.loadChart();
  }

  loadChart() {
    this.consumptionData = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      datasets: [
          {
              label: 'Expenses in rupees',
              data: [4500, 5121, 4451.99, 6784.44, 7812.08, 7411.33, 8457.74, 6548.5, 7455.10, 5466.11, 0,0],
              fill: false,
              borderColor: '#42A5F5',
              tension: 0,
              bezierCurve: false,
    },
      ]
  };
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

}
