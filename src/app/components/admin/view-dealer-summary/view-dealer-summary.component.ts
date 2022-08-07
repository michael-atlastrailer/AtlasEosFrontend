import { Component, OnInit } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-view-dealer-summary',
  templateUrl: './view-dealer-summary.component.html',
  styleUrls: ['./view-dealer-summary.component.scss'],
})
export class ViewDealerSummaryComponent implements OnInit {
  tableView = true
  loader = false
  atlasCode = ''
  dealerCode = ''
  cartData: any
  newQty = ''
  newPrice = ''
  noOrderFound = false
  dataInbound = false
  btnLoader = false
  userData: any
  dealerSummary: any
  grandTotal = ''

  constructor(
    private httpService: HttpRequestsService,
    private toastr: ToastrService,
    private tokenStore: TokenStorageService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.userData = this.tokenStore.getUser()

    this.route.params.subscribe((params) => {
      if (params['account']) {
        this.dealerCode = params['account']
        this.getDealerSummary()
        //this.getSingleDealerSummary()
      } else {
      }
    })
  }

  getDealerSummary() {
    this.loader = true
    this.tableView = false

    this.httpService
      .httpGetRequest('/admin/view-dealer-summary/' + this.dealerCode)
      .then((result: any) => {
        this.loader = false
        this.tableView = true

        if (result.status) {
          this.dealerSummary = result.data.data
          this.grandTotal = result.data.grand_total
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        // this.toastr.error('Try again', 'Something went wrong')
      })
  }
}
