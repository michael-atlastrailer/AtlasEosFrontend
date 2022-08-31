import { ElementRef } from '@angular/core'
import { ViewChild } from '@angular/core'
import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  vendors: any
  @ViewChild('vendorId') vendor!: ElementRef
  orderTable: any
  selectDefault = true
  newTable: any
  orderTotal = 0
  loader = true
  grandTotal = 0
  account_id: any
  disablePrint = true
  currenDateTime = ''
  constructor(
    private getData: HttpRequestsService,
    private toastr: ToastrService,
    private token: TokenStorageService,
  ) {
    this.getAllVendorOrders()
    this.getCartByVendorId('all')
    this.account_id = this.token.getUser().account_id

    let d = new Date()
    let month = d.getMonth() + 1
    let comDate = d.getDate() + '-' + month + '-' + d.getFullYear()

    let hrs = d.getHours()
    let mins = d.getMinutes()
    let minutes = mins < 10 ? `0${mins}` : mins
    let sec = d.getSeconds()
    let ampm = hrs >= 12 ? 'pm' : 'am'

    let comTime = hrs + ':' + minutes + ':' + sec + ' ' + ampm

    this.currenDateTime = comDate + ' ' + comTime
  }

  ngOnInit(): void {}
  getAllVendorOrders() {
    let id = this.token.getUser().account_id

    this.getData
      .httpGetRequest('/dealer/get-ordered-vendor/' + id)
      .then((result: any) => {
        // console.log(result);
        if (result.status) {
          this.vendors = result.data
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error')
      })
  }

  getCartByVendorId(id: any) {
    this.loader = true
    console.log('fetching', id)
    this.orderTable = []
    if (id == 'all') {
      this.selectDefault = true
      this.getCart()
    } else {
      this.selectDefault = false
      let dealer = this.token.getUser().account_id
      this.getData
        .httpGetRequest(
          '/fetch-order-items-atlas-id-vendor-id/' + dealer + '/' + id,
        )
        .then((result: any) => {
          if (result.status) {
            console.log('search vendor res', result.data)
            this.loader = false

            this.orderTable = result.data
            this.getTotal()
          } else {
            this.loader = false

            this.toastr.info(`Something went wrong`, 'Error')
          }
        })
        .catch((err) => {
          this.loader = false

          this.toastr.info(`Something went wrong`, 'Error')
        })
    }
  }
  getCart() {
    let id = this.token.getUser().account_id
    this.getData
      .httpGetRequest('/cart/dealer/' + id)
      .then((result: any) => {
        if (result.status) {
          this.loader = false
          console.log('dealer id', result?.data)
          this.orderTable = result?.data
          this.checkVendorGroup(result.data)
        } else {
          this.loader = false

          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.loader = false

        this.toastr.info(`Something went wrong`, 'Error')
      })
  }
  checkVendorGroup(array: any) {
    let old = array

    this.newTable = old.reduce((arr: any, obj: any) => {
      const key = obj['vendor']
      if (!arr[key]) {
        arr[key] = []
      }
      arr[key].push(obj)
      return arr
    }, {})
    this.newTable = Object.entries(this.newTable)
    console.log('checking something', old, this.newTable)
    for (var i = 0; i < this.newTable.length; i++) {
      let total = 0
      if (this.newTable[i][1].length > 0) {
        for (var x = 0; x < this.newTable[i][1].length; x++) {
          let obj = this.newTable[i][1][x]

          total = total + parseFloat(obj.price)
        }
      } else {
        total = 0.0
      }
      this.grandTotal = this.grandTotal + total

      this.newTable[i].push(total)
    }
    console.log('new list alt', this.newTable, typeof this.newTable)
  }
  getTotal() {
    let total = 0
    if (this.orderTable.length > 0) {
      for (var i = 0; i < this.orderTable.length; i++) {
        let Obj: any = this.orderTable[i]!
        total = total + parseFloat(Obj.price!)
      }
      return (this.orderTotal = total)
    } else {
      return (this.orderTotal = 0)
    }
  }
  parser(data: any) {
    return JSON.parse(data)
  }
  getLocal(e: any) {
    return localStorage.getItem(e)
  }
}
