import { Component, OnInit } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'

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
  constructor(
    private getData: HttpRequestsService,
    private tokenStore: TokenStorageService,
  ) {}

  ngOnInit(): void {
    this.userData = this.tokenStore.getUser()
    this.getDashboardData()
  }

  getDashboardData() {
    this.getData
      .httpGetRequest(
        '/vendor/vendor-dashboard/' +
          this.userData.vendor_code +
          '/' +
          this.userData.id,
      )
      .then((result: any) => {
        this.tableView = true
        this.loader = false
        console.log(result)
        if (result.status) {
          this.totalSales = result.data.total_sales
          this.mostPurchasers = result.data.purchasers
          this.orderReceived = result.data.total_orders
        } else {
        }
      })
      .catch((err) => {
        this.loader = false
      })
  }
}
