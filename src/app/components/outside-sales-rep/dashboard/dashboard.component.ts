import { Component, OnInit } from '@angular/core';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
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
  totalDealers = 0;
  purchaseTotal = 0;
  totalLogged = 0;
  totalNotLogged = 0;
  constructor(
    private getData: HttpRequestsService,
    private token: TokenStorageService,
    private toastr: ToastrService
  ) {
    this.getDashboardData();
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
  getDashboardData() {
    let accntId = this.token.getUser().id;
    this.getData
      .httpGetRequest('/sales-rep/dashboard-analysis/' + accntId)
      .then((result: any) => {
        console.log(result);
        if (result.status) {
          this.totalDealers = result.data.total_dealers;
          this.totalLogged = result.data.total_logged_in;
          this.totalNotLogged = result.data.total_not_logged_in;
          this.purchaseTotal = result.data.total_sales;
          console.log(
            'res dashboard',
            result.data,
            this.totalDealers,
            this.totalLogged,
            this.totalNotLogged,
            this.purchaseTotal
          );
        } else {
        }
      })
      .catch((err) => {});
  }

  ngOnInit(): void {}
}
