import { Component, OnInit } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};
declare var $: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public chartOptions: any;
  constructor() {
   this.chartOptions = {
     series: [
       {
         name: 'Sales summary',
         data: [30, 1500, 35000],
       },
     ],
     chart: {
       height: 350,
       type: 'bar',
     },
     title: {
       text: '',
     },
     colors: {},
     xaxis: {
       categories: ['Day 1', 'Day 2', 'Day 3'],
     },
     yaxis: {
       categories: [
         '0',
         '5000',
         '10000',
         '15000',
         '20000',
         '25000',
         '30000',
         '35000',
         '40000',
         '45000',
       ],
     },
   };
  }

  ngOnInit(): void {}
}
