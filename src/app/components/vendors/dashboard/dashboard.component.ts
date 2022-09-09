import { Component, OnInit } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexPlotOptions,
  ApexYAxis,
} from 'ng-apexcharts'

export type ChartOptions = {
  series: ApexAxisChartSeries
  chart: ApexChart
  xaxis: ApexXAxis
  dataLabels: ApexDataLabels
  plotOptions: ApexPlotOptions
  fill: ApexFill
  title: ApexTitleSubtitle
  yaxis: ApexYAxis
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  loader = true
  tableView = false
  mostPurchasers: any
  totalOrder = 0
  totalSales = 0
  userData: any
  orderReceived = 0
  selectedVendorCode = ''
  public chartOptions: Partial<ChartOptions>

  constructor(
    private getData: HttpRequestsService,
    private tokenStore: TokenStorageService,
  ) {
    this.chartOptions = {
      series: [
        {
          name: 'Sales summary',
          data: [0, 0],
        },
      ],
      //Math.round(value * 1.5)
      yaxis: {
        min: 0,
        max: 35000,

        tickAmount: 7,
        labels: {
          formatter: function (value: any) {
            return '$' + Math.round(value)
          },
        },
      },
      chart: {
        height: 350,
        type: 'bar',
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: undefined,
        formatter: function (value: any) {
          return '$' + value.toFixed(2)
        },
      },
      title: {
        text: '',
      },
      xaxis: {
        tooltip: {
          enabled: true,
          offsetY: -35,
        },
        categories: ['Day 1', 'Day 2'],
      },
    }
  }

  ngOnInit(): void {
    this.userData = this.tokenStore.getUser()

    this.getChartData()
    this.getDashboardAnalysisData()
    this.getDashboardMostPurchaserData()
  }

  getSingleDashboardMostPurchaserData() {
    this.getData
      .httpGetRequest(
        '/vendor/vendor-single-dashboard-most-purchaser/' +
          this.userData.vendor_code,
      )
      .then((result: any) => {
        this.tableView = true
        this.loader = false
        if (result.status) {
          this.mostPurchasers = result.data
        } else {
        }
      })
      .catch((err) => {
        this.loader = false
      })
  }

  getSingleDashboardAnalysisData() {
    this.getData
      .httpGetRequest(
        '/vendor/vendor-single-dashboard-analysis/' + this.userData.vendor_code,
      )
      .then((result: any) => {
        if (result.status) {
          this.totalSales = result.data.total_sales
          this.orderReceived = result.data.total_orders
        } else {
        }
      })
      .catch((err) => {
        this.loader = false
      })
  }

  getDashboardMostPurchaserData() {
    this.getData
      .httpGetRequest(
        '/vendor/vendor-dashboard-most-purchaser/' + this.userData.id,
      )
      .then((result: any) => {
        this.tableView = true
        this.loader = false
        if (result.status) {
          this.mostPurchasers = result.data
        } else {
        }
      })
      .catch((err) => {
        this.loader = false
      })
  }

  getDashboardAnalysisData() {
    this.getData
      .httpGetRequest('/vendor/vendor-dashboard-analysis/' + this.userData.id)
      .then((result: any) => {
        if (result.status) {
          this.totalSales = result.data.total_sales
          this.orderReceived = result.data.total_orders
        } else {
        }
      })
      .catch((err) => {
        this.loader = false
      })
  }

  getChartData() {
    this.getData
      .httpGetRequest('/fetch-all-vendor-orders-per-day/' + this.userData.id)
      .then((result: any) => {
        console.log(result)
        if (result.status) {
          let chartData: any = []
          let chartDate: any = []

          let resData = result.data

          let index = 0

          resData.map((item: any) => {
            if (index <= 2) {
              chartData.push(item.amount)
              chartDate.push(item.date)
            }

            index++
          })

          if (chartData.length < 2) {
            chartData[1] = 0
          }
          if (chartData.length > 0) {
            let last2 = chartData.slice(-2)

            this.chartOptions = {
              series: [
                {
                  name: 'Sales summary',
                  data: last2,
                },
              ],
              //Math.round(value * 1.5)
              yaxis: {
                tickAmount: 7,

                labels: {
                  // formatter: function (value: any) {
                  //   return '$' + Math.round(value)
                  // },
                },
              },
              chart: {
                height: 350,
                type: 'bar',
              },
              dataLabels: {
                enabled: true,
                enabledOnSeries: undefined,
                // formatter: function (value: any) {
                //   return '$' + value.toFixed(2)
                // },
              },
              title: {
                text: '',
              },
              xaxis: {
                tooltip: {
                  enabled: true,
                  offsetY: -35,
                },
                categories: ['Day 1', 'Day 2'],
              },
            }
          }
        } else {
        }
      })
      .catch((err) => {
        this.loader = false
      })
  }
}
