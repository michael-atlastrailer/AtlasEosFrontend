import {
  Component,
  OnInit,
  DoCheck,
  ElementRef,
  ViewChildren,
} from '@angular/core';
import { ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
} from 'ng-apexcharts';
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
  promotionalLoader = true;
  promotionalData = false;
  promotionalStatus = false;
  promotionalAds: any;
  allCategoryData: any;
  public chartOptions: any;
  countDownDate = new Date('June 25, 2022 15:37:25').getTime();
  count: any = 34;
  countDownElement = <HTMLInputElement>(
    document.getElementById('calc_table_amount')
  );
  pdfSrc =
    'https://atlasbookingprogram.com/assets/2022%20Booking%20Program%20Terms%20&%20Conditions.pdf';
  timeSeconds = 59;
  timeDays = 0;
  timeHours: number = 24;
  timeMinutes: number = 59;
  interval: any;

  checkerInterval: any;
  startCounterChecker: any;
  countDownTimer: any;

  countDownData: any;

  initalDays: number = 0;
  initalHours: number = 0;
  initalMinutes: number = 0;
  initalSeconds: number = 0;

  showSecondsExtrazero = false;

  testStartTimer!: number;
  testStopTimer!: number;
  testTimeLeft!: number;
  starterTimerTimestamp!: number;
  endTimer = '';
  endTimerStamp!: number;
  initalEndTime: any;
  initalStartTime: any;
  init = true;
  netComplete = 0;
  showTotal = 0;
  orderRemaining = 0;
  newProduct = 0;
  defaultFlyer = 1;
  constructor(
    private getData: HttpRequestsService,
    private token: TokenStorageService
  ) {
    this.getAllVendors();
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
  ngOnInit(): void {}

  getAllVendors() {
    this.getData
      .httpGetRequest('/promotional_fliers/vendors')
      .then((result: any) => {
        console.log(result);
        if (result.status) {
          this.allCategoryData = result.data;
          console.log('albendor', result.data);
          this.defaultFlyer = result.data[0].vendor_code;
          this.fetchFlyer(result.data[0].vendor_code);
        } else {
        }
      })
      .catch((err) => {});
  }
  fetchFlyer(data: any) {
    this.init = false;

    console.log('chosen one', data);
    this.promotionalLoader = true;
    this.promotionalData = false;
    this.promotionalStatus = false;

    console.log(data, 'id');

    this.getData
      .httpGetRequest('/show-promotional-flier-by-vendor-id/' + data)
      .then((result: any) => {
        console.log(result, 'promotion');

        this.promotionalLoader = false;
        if (result.status) {
          // this.promotionalData = result.data.length > 0 ? true : false;
          // this.promotionalStatus = result.data.length <= 0 ? true : false;

          this.promotionalAds = result.data[0];
          this.promotionalData = true;
        } else {
        }
      })
      .catch((err) => {
        this.promotionalLoader = false;
        this.promotionalData = true;
      });
  }
  getDashboardData() {
    let accntId = this.token.getUser().account_id;
    this.getData
      .httpGetRequest('/dealer-dashboard/' + accntId)
      .then((result: any) => {
        console.log(result);
        if (result.status) {
          this.showTotal = result.data.show_total;
          this.newProduct = result.data.new_products;
          this.orderRemaining = result.data.order_remaining;
          this.netComplete = result.data.completed_orders ;
        } else {
        }
      })
      .catch((err) => {});
  }
}
