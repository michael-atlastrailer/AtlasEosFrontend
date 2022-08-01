import { Component, OnInit } from '@angular/core'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'

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

  constructor(
    private httpService: HttpRequestsService,
    private toastr: ToastrService,
    private tokenStore: TokenStorageService,
  ) {}

  ngOnInit(): void {
    this.userData = this.tokenStore.getUser()
  }

  savePriceOverride() {
    let data = {
      dealerCode: this.dealerCode,
      atlasCode: this.atlasCode,
      newQty: this.newQty,
      newPrice: this.newPrice,
      authorizer: this.userData.id,
    }

    this.btnLoader = true
    this.httpService
      .httpPostRequest('/admin/save-price-override', data)
      .then((result: any) => {
        this.btnLoader = false

        if (result.status) {
          this.toastr.success(result.message, 'Success')
        } else {
          this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        this.toastr.error('Try again', 'Something went wrong')
      })
  }

  getDealerCart() {
    if (this.atlasCode != '' && this.dealerCode != '') {
      this.loader = true
      this.tableView = false

      this.httpService
        .httpGetRequest(
          '/admin/get-price-override/' + this.dealerCode + '/' + this.atlasCode,
        )
        .then((result: any) => {
          this.loader = false
          this.tableView = true

          if (result.status) {
            this.cartData = result.data

            this.dataInbound = this.cartData != '' ? true : false

            this.noOrderFound = this.cartData != '' ? false : true
          } else {
            // this.toastr.error(result.message, 'Try again')
          }
        })
        .catch((err) => {
          // this.toastr.error('Try again', 'Something went wrong')
        })
    }
  }
}
