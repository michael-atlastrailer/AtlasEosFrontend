import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnInit,
  ViewChildren,
  QueryList,
} from '@angular/core'
import Swal from 'sweetalert2'

import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { ActivatedRoute, Router } from '@angular/router'
import { ToastrService } from 'ngx-toastr'
import { filter } from 'rxjs'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { MatSortModule } from '@angular/material/sort'
import { MatSort, Sort } from '@angular/material/sort'
import { LiveAnnouncer } from '@angular/cdk/a11y'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { DataSource } from '@angular/cdk/collections'
import { CommonModule, CurrencyPipe } from '@angular/common'

export interface PeriodicElement {
  atlas_id: any
  vendor: string
  description: string
  booking: number
  special: number
  extended: number
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    atlas_id: '',
    vendor: '',
    description: '',
    booking: 0,
    special: 0,
    extended: 0,
  },
]
declare var $: any

@Component({
  selector: 'app-test-show-order',
  templateUrl: './test-show-order.component.html',
  styleUrls: ['./test-show-order.component.scss'],
})
export class TestShowOrderComponent implements OnInit {
  allCategoryData: any
  noData = false
  tableLoader = false
  tableStatus = false
  cartLoader = false
  productData: any
  selectVendor = 0
  @ViewChild('vendorId') vendor!: ElementRef
  vendorId: any
  searchatlasId: any
  tableData: PeriodicElement[] = []
  displayedColumns: string[] = [
    'qty',
    'atlas_id',
    'vendor',
    'description',
    'booking',
    'special',
    'extended',
  ]

  loader = false
  tableView = true

  orderLen = 0
  orderSuccess = false
  sortTable: any
  dataSrc = new MatTableDataSource<PeriodicElement>()
  @ViewChild(MatPaginator)
  paginator!: MatPaginator
  canOrder = false
  isMod = false
  orderTable: object[] = []
  cartHistory: object[] = []
  orderTotal = 0

  /////////// Old Code ////

  assortedItems: [] | any = []
  currentState: [] | any = []
  assortFilter: [] | any = []
  assortSecondFilter: [] | any = []
  newArrayFilter: [] | any = []

  benchMarkQty = 4

  normalPrice = 0
  currentProductAmt = 0
  overTotal: any = 0

  anotherLinePhase: any | [] = []
  anotherLinePhaseFilter: any | [] = []
  groupsArray: any | [] = []

  allAddedItemAtlasID: any | [] = []

  @ViewChildren('extend')
  extendField!: QueryList<ElementRef>

  dummyAmt = 0
  userData: any
  incomingVendorData: any
  allVendors: any
  showDropdown = false
  @ViewChild('dummyInput') dummyInput!: ElementRef
  vendorCode = ''
  addedItem: any = []

  itemAlreadySubmitted: any = ''
  itemNewlySubmitted = 0
  showSubmittedDetails = false

  //// End of old  code ///////

  constructor(
    private getData: HttpRequestsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    private token: TokenStorageService,
    private currencyPipe: CurrencyPipe,
  ) {
    this.getAllVendors()
    this.route.params.subscribe((params) => {
      this.vendorId = params['vendorId']
      this.searchatlasId = params['atlasId']
      if (this.searchatlasId == 'vendor') {
        this.searchatlasId = undefined
      }
      console.log('testing waters', this.vendorId, this.searchatlasId)
      if (this.vendorId) {
        console.log('got in', this.vendorId, this.searchatlasId)
        this.searchVendorId(this.vendorId!)
        this.selectVendor = this.vendorId
      }
    })
    this.getCart()
    this.userData = this.token.getUser()
  }
  @ViewChild(MatSort)
  sort!: MatSort

  ngOnInit(): void {}
  ngAfterViewInit() {}
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`)
    } else {
      this._liveAnnouncer.announce('Sorting cleared')
    }
  }

  ///////// Old code ///////////

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.incomingVendorData.vendor_name = filterValue.trim().toLowerCase()
    this.allVendors = this.filterArray('*' + filterValue)
  }

  filterArray(expression: string) {
    var regex = this.convertWildcardStringToRegExp(expression)
    return this.incomingVendorData.filter(function (item: any) {
      return regex.test(item.vendor_name)
    })
  }

  escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  convertWildcardStringToRegExp(expression: string) {
    var terms = expression.split('*')

    var trailingWildcard = false

    var expr = ''
    for (var i = 0; i < terms.length; i++) {
      if (terms[i]) {
        if (i > 0 && terms[i - 1]) {
          expr += '.*'
        }
        trailingWildcard = false
        expr += this.escapeRegExp(terms[i])
      } else {
        trailingWildcard = true
        expr += '.*'
      }
    }

    if (!trailingWildcard) {
      expr += '.*'
    }

    return new RegExp('^' + expr + '$', 'i')
  }

  toggleVendors() {
    if (this.showDropdown) {
      this.showDropdown = false
    } else {
      this.showDropdown = true
    }
  }

  getAllSelectedDealerUsers(data: any) {
    if (this.showDropdown) {
      this.showDropdown = false
    } else {
      this.showDropdown = true
    }

    this.dummyInput.nativeElement.value = data.vendor_name
    this.vendorCode = data.vendor_code
  }

  getProductByVendorId() {
    this.loader = true
    this.tableView = false
    this.canOrder = false
    this.isMod = false
    /// let id = this.vendor.nativeElement.value
    this.showSubmittedDetails = false

    this.getData
      .httpGetRequest('/dealer/get-vendor-products/' + this.vendorCode)
      .then((result: any) => {
        console.log(result, 'promotion')
        this.loader = false
        this.tableView = true

        if (result.status) {
          this.productData = result.data

          this.tableData = result.data
          if (result.data.length !== 0) {
            this.canOrder = true
          }
          this.orderTable = []
          this.getTotal()

          this.dataSrc = new MatTableDataSource<PeriodicElement>(result.data)
          this.dataSrc.sort = this.sort
          this.dataSrc.paginator = this.paginator
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error')
      })
  }

  oneAddBtn() {
    let allProCount = this.productData.length
    let addedState = false
    let inCart = false
    let postItem = []
    this.cartLoader = true

    for (let h = 0; h < allProCount; h++) {
      let curQty = $('#cur-' + h).val()
      if (curQty != '' && curQty != undefined) {
        let data = this.productData[h]
        let rawUnit = document.getElementById('u-price-' + h)?.innerText
        let unit = rawUnit?.replace(',', '.')

        let rawPrice = document.getElementById('amt-hidd-' + h)?.innerHTML
        // let realPrice = rawPrice?.replace('$', '')
        let newPrice = rawPrice?.replace(',', '.')

        let cartData = {
          uid: this.userData.id,
          dealer: this.userData.account_id,
          vendor_id: data.vendor,
          atlas_id: data.atlas_id,
          product_id: data.id,
          qty: curQty,
          price: newPrice,
          unit_price: unit,
          groupings: data.grouping,
          type: 'null',
        }

        postItem.push(cartData)
      }
    }

    let postData = {
      uid: this.userData.id,
      dealer: this.userData.account_id,
      product_array: JSON.stringify(postItem),
    }

    this.getData
      .httpPostRequest('/dealer/save-item-to-cart', postData)
      .then((res: any) => {
        console.log(res)
        if (res.status) {
          this.showSubmittedDetails = true
          this.cartLoader = false
          this.itemAlreadySubmitted = res.data.item_details
          this.itemNewlySubmitted = res.data.item_added
          this.toastr.success(` item(s) has been submitted`, 'Success')
          /// this.orderTable = []
          /// this.getTotal()
          /// this.getCart()
          // if (this.searchatlasId) {
          //   this.searchVendorId(this.vendorId!)
          // } else {
          //   this.getProductByVendorId()
          // }
        } else {
          this.cartLoader = false
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.cartLoader = false
        if (err.message.response.dealer || err.message.response.dealer) {
          this.toastr.info(`Please logout and login again`, 'Session Expired')
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })

    console.log(postItem)
  }

  checkAvaDiscount(index: number, qty: any) {
    if (qty !== '') {
      let arr = this.extendField.toArray()[index]
      let specialAmt = 0
      let specialCond = 0
      let specData = this.productData[index].spec_data
      this.normalPrice = this.productData[index].booking
      for (let i = 0; i < specData.length; i++) {
        let curAmt = specData[i].special
        let cond = specData[i].cond
        let type = specData[i].type

        let benchCheck = parseInt(cond) - qty
        if (this.benchMarkQty <= benchCheck && benchCheck > 0) {
          let formattedAmt = this.currencyPipe.transform(curAmt, '$')

          if (type == 'assorted') {
            // this.toastr.info(
            //   `Add ${benchCheck} of this product to get the special price at ${formattedAmt}`,
            //   'Assorted Discount Alert'
            // );
          } else {
            this.toastr.info(
              `Add ${benchCheck} of this product to get the special price at ${formattedAmt}`,
              'Quantity Break Alert',
            )
          }
        }
      }
    }
  }

  valCheck(val: any) {
    let orderstat = JSON.parse(window.localStorage.getItem('dealer')!)
    console.log(orderstat.order_status, 'order')
    if (val != 0) {
      if (orderstat.order_status == 1) {
        console.log(orderstat.order_status, 'order')

        //return (this.isDirty = false);
      } else {
        // return (this.isDirty = true);
      }
    } else {
      //return (this.isDirty = false);
    }
  }

  runTotalCalculation(index: number) {
    let currentProduct = this.productData[index]
    let curQty = $('#cur-' + index).val()
    let rawPrice = document.getElementById('amt-hidd-' + index)?.innerHTML
    // let realPrice = rawPrice?.replace('$', '')
    let newPrice = rawPrice?.replace(',', '')

    let data = {
      atlasId: currentProduct.atlas_id,
      price: newPrice,
      grouping: currentProduct.grouping,
      index: index,
    }

    if (this.addedItem.length == 0) {
      this.addedItem.push(data)
    } else {
      let presentItem = false
      for (let i = 0; i < this.addedItem.length; i++) {
        const item = this.addedItem[i]
        if (item.atlasId == currentProduct.atlas_id) {
          item.price = newPrice
          presentItem = true
        } else {
        }
      }

      if (!presentItem) {
        for (let g = 0; g < this.addedItem.length; g++) {
          const t = this.addedItem[g]
          if (t.grouping == currentProduct.grouping) {
            let rawPrice = document.getElementById('amt-hidd-' + t.index)
              ?.innerHTML
            // let realPrice = rawPrice?.replace('$', '')
            let newPrice = rawPrice?.replace(',', '')
            t.price = newPrice
          } else {
            for (let i = 0; i < this.addedItem.length; i++) {
              // let rawPrice = document.getElementById('amt-hidd-' + t.index)
              //   ?.innerHTML
              const item = this.addedItem[i]
              if (item.atlasId == currentProduct.atlasId) {
                item.price = newPrice
                console.log('found de atlas id', currentProduct.atlasId)
              } else {
              }
            }
          }
          //groupings
        }
        this.addedItem.push(data)
      } else {
        // for (let i = 0; i < this.addedItem.length; i++) {
        //   const item = this.addedItem[i]
        //   if (item.atlasId == currentProduct.atlasId) {
        //     item.price = newPrice
        //     console.log('found de atlas id', currentProduct.atlasId)
        //   } else {
        //   }
        // }
      }
    }

    this.overTotal = 0
    for (let j = 0; j < this.addedItem.length; j++) {
      const h = this.addedItem[j]
      this.overTotal += parseFloat(h.price)
      // console.log(this.overTotal)
    }
  }

  runCalculation(index: number, qty: any, event: any) {
    if (event.key != 'Tab') {
      if (qty !== '') {
        let curr = this.productData[index]
        let atlasId = curr.atlas_id
        let spec = curr.spec_data

        if (!this.allAddedItemAtlasID.includes(atlasId)) {
          this.allAddedItemAtlasID.push(atlasId)
        }

        if (spec !== null) {
          if (spec.length > 0) {
            for (let j = 0; j < spec.length; j++) {
              const f = spec[j]
              if (f.type == 'assorted') {
                curr.quantity = qty
                curr.pos = index
                this.assortFilter.push(curr)
                for (let y = 0; y < this.assortFilter.length; y++) {
                  const t = this.assortFilter[y]
                  if (t.id == curr.id) {
                  } else {
                    this.assortFilter.push(curr)
                  }

                  this.newArrayFilter = this.assortFilter.filter(
                    (x: any, y: any) => this.assortFilter.indexOf(x) == y,
                  )

                  let secondPhase: any = []
                  let anotherFilter: any = []
                  let letsContinue = false

                  for (let h = 0; h < this.newArrayFilter.length; h++) {
                    const e = this.newArrayFilter[h]
                    if (e.grouping == curr.grouping) {
                      if (e.spec_data.length > 0) {
                        letsContinue = true
                        //console.log(e.spec_data);
                        // e.spec_data[h].quantity = e.quantity;
                        // e.spec_data[h].pos = e.pos;
                        // e.spec_data[0].arrIndex = e.spec_data.length - 1;
                        // secondPhase.push(e.spec_data[0]);

                        e.spec_data.pos = e.pos
                        e.spec_data.quantity = e.quantity
                        e.spec_data.atlas_id = e.atlas_id
                        e.spec_data.group = e.grouping

                        for (let t = 0; t < e.spec_data.length; t++) {
                          let ele = e.spec_data[t]
                          ele.quantity = e.quantity
                          ele.pos = e.pos
                          ele.atlas_id = e.atlas_id
                          ele.arrIndex = t
                          secondPhase.push(ele)
                        }
                        this.anotherLinePhase.push(e.spec_data)
                      } else {
                        let price = parseFloat(e.booking)
                        let quantity = parseInt(e.quantity)
                        let newPrice = price * quantity
                        let formattedAmt = this.currencyPipe.transform(
                          newPrice,
                          '$',
                        )

                        $('#u-price-' + e.pos).html(price)
                        $('#amt-' + e.pos).html(formattedAmt)
                        $('#amt-hidd-' + e.pos).html(newPrice)
                      }
                    } else {
                    }
                  }

                  this.anotherLinePhaseFilter = this.anotherLinePhase.filter(
                    (v: any, i: any, a: any) =>
                      a.findIndex((t: any) => t.atlas_id === v.atlas_id) === i,
                  )

                  let newTotalAss = 0

                  this.anotherLinePhaseFilter.map((val: any, index: any) => {
                    if (curr.grouping == val.group) {
                      console.log(curr.grouping)
                      newTotalAss += parseInt(val.quantity)
                    }
                  })

                  /// console.log(newTotalAss, 'Total');

                  if (letsContinue) {
                    let status = false
                    for (
                      let h = 0;
                      h < this.anotherLinePhaseFilter.length;
                      h++
                    ) {
                      const k = this.anotherLinePhaseFilter[h]
                      if (newTotalAss >= parseInt(k[0].cond)) {
                        status = true

                        $('.normal-booking-' + k.pos).css('display', 'none')
                      } else {
                        for (let hj = 0; hj < k.length; hj++) {
                          const eleK = k[hj]
                          $(
                            '.special-booking-' +
                              eleK.pos +
                              '-' +
                              eleK.arrIndex,
                          ).css('display', 'none')

                          // console.log('testing price', eleK);

                          let booking = parseFloat(eleK.booking)
                          let newPrice = parseInt(eleK.quantity) * booking
                          let formattedAmt = this.currencyPipe.transform(
                            newPrice,
                            '$',
                          )

                          $('#u-price-' + eleK.pos).html(booking)
                          $('#amt-' + eleK.pos).html(formattedAmt)
                          $('#amt-hidd-' + eleK.pos).html(newPrice)
                        }

                        let price = parseFloat(k.booking)
                        $('.normal-booking-' + k.pos).css(
                          'display',
                          'inline-block',
                        )
                      }
                    }

                    if (status) {
                      let tickArrToBeRemoved = []
                      //// If total Assorted is greater than condition /////
                      for (
                        let i = 0;
                        i < this.anotherLinePhaseFilter.length;
                        i++
                      ) {
                        const jk = this.anotherLinePhaseFilter[i]
                        let currArrLength = jk.length

                        for (let j = 0; j < jk.length; j++) {
                          --currArrLength
                          const backWard = jk[currArrLength]
                          const frontWard = jk[j]

                          if (
                            newTotalAss < backWard.cond &&
                            newTotalAss >= frontWard.cond
                          ) {
                            let nxt = frontWard.arrIndex + 1
                            let preData = jk[nxt]
                            let activeData = frontWard

                            $('.normal-booking-' + activeData.pos).css(
                              'display',
                              'none',
                            )

                            $(
                              '.special-booking-' +
                                activeData.pos +
                                '-' +
                                activeData.arrIndex,
                            ).css('display', 'inline-block')

                            $(
                              '.special-booking-' +
                                preData.pos +
                                '-' +
                                preData.arrIndex,
                            ).css('display', 'none')
                            let special = parseFloat(activeData.special)
                            let newPrice =
                              parseInt(activeData.quantity) * special
                            let formattedAmt = this.currencyPipe.transform(
                              newPrice,
                              '$',
                            )

                            $('#u-price-' + activeData.pos).html(special)
                            $('#amt-' + activeData.pos).html(formattedAmt)
                            $('#amt-hidd-' + activeData.pos).html(newPrice)
                          } else {
                            let pre = backWard.arrIndex - 1
                            let preData = jk[pre]
                            let activeData = backWard
                            let chNxt = pre + 1
                            let chpp = jk[chNxt]

                            // console.log('dropped', activeData);
                            let pp = jk[j]

                            if (newTotalAss >= pp.cond) {
                              let special = parseFloat(pp.special)
                              let newPrice = parseInt(pp.quantity) * special
                              let formattedAmt = this.currencyPipe.transform(
                                newPrice,
                                '$',
                              )

                              $('#u-price-' + pp.pos).html(special)
                              $('#amt-' + pp.pos).html(formattedAmt)
                              $('#amt-hidd-' + pp.pos).html(newPrice)
                            }

                            $(
                              '.special-booking-' +
                                activeData.pos +
                                '-' +
                                activeData.arrIndex,
                            ).css('display', 'inline-block')

                            if (preData != undefined) {
                              tickArrToBeRemoved.push(preData)
                            }
                            for (
                              let hi = 0;
                              hi < tickArrToBeRemoved.length;
                              hi++
                            ) {
                              const kk = tickArrToBeRemoved[hi]
                              $(
                                '.special-booking-' +
                                  kk.pos +
                                  '-' +
                                  kk.arrIndex,
                              ).css('display', 'none')
                            }

                            // console.log(tickArrToBeRemoved);
                          }
                        }
                      }
                    } else {
                      /// if total Assorted is not greater than condition /////
                    }
                  }
                }
              } else {
                ///////// Speacial Price ////////
                let arr = this.extendField.toArray()[index]
                let specialAmt = 0
                let specialCond = 0
                let specData = this.productData[index].spec_data
                this.normalPrice = parseFloat(this.productData[index].booking)
                for (let i = 0; i < specData.length; i++) {
                  let curAmt = parseFloat(specData[i].special)
                  let cond = parseInt(specData[i].cond)
                  let orignialAmt = parseFloat(specData[i].booking)
                  specData[i].arrIndex = i
                  let nextArr = i + 1
                  let len = specData.length

                  if (qty >= cond) {
                    this.normalPrice = curAmt
                    $('.normal-booking-' + index).css('display', 'none')

                    $(
                      '.special-booking-' + index + '-' + specData[i].arrIndex,
                    ).css('display', 'inline-block')

                    let g = i - 1
                    let nxt = i + 1

                    if (specData[nxt]) {
                      $('.special-booking-' + index + '-' + nxt).css(
                        'display',
                        'none',
                      )
                    } else {
                    }

                    $('.special-booking-' + index + '-' + g).css(
                      'display',
                      'none',
                    )
                  } else {
                    this.normalPrice = this.normalPrice
                    $('.special-booking-' + index + '-' + i).css(
                      'display',
                      'none',
                    )
                    let nxt = i + 1
                    let pre = i - 1

                    if (specData[nxt]) {
                      let cond = specData[nxt].cond
                      if (qty < cond) {
                        $('.normal-booking-' + index).css(
                          'display',
                          'inline-block',
                        )
                      } else {
                        $('.normal-booking-' + index).css('display', 'none')
                      }
                      $('.normal-booking-' + index).css('display', 'none')
                    } else {
                      // console.log(specData[pre]);
                      let preData = specData[pre]
                      if (preData) {
                        let preCond = parseInt(preData.cond)
                        // console.log(`${preCond} and ${qty}`);
                        if (qty >= preCond) {
                          $('.normal-booking-' + index).css('display', 'none')
                        } else {
                        }
                      } else {
                        $('.normal-booking-' + index).css(
                          'display',
                          'inline-block',
                        )
                      }

                      if (qty >= cond) {
                        $('.normal-booking-' + index).css('display', 'none')
                      } else {
                      }
                    }
                  }

                  if (qty >= cond) {
                    this.normalPrice = curAmt
                  } else {
                    this.normalPrice = this.normalPrice
                  }
                }

                let calAmt = qty * this.normalPrice
                this.currentProductAmt = calAmt
                $('#u-price-' + index).html(this.normalPrice)
                let formattedAmt = this.currencyPipe.transform(calAmt, '$')
                arr.nativeElement.innerHTML = formattedAmt
                $('#amt-' + index).html(formattedAmt)
                $('#amt-hidd-' + index).html(calAmt)
              }
            }
          } else {
            let quantity = parseInt(qty)
            let price = parseFloat(curr.booking)

            let calAmt = quantity * price
            this.currentProductAmt = calAmt

            ///console.log(price, 'unit Price');
            $('#u-price-' + index).html(price)

            $('.normal-booking-' + index).css('display', 'inline-block')

            let formattedAmt = this.currencyPipe.transform(calAmt, '$')
            $('#amt-' + index).html(formattedAmt)
            $('#amt-hidd-' + index).html(calAmt)
          }
        } else {
          console.log('trying to find it')
          let quantity = parseInt(qty)
          let price = parseFloat(curr.booking)

          let calAmt = quantity * price
          this.currentProductAmt = calAmt

          ///console.log(price, 'unit Price');
          $('#u-price-' + index).html(price)

          $('#amt-hidd-' + index).html(calAmt)

          $('.normal-booking-' + index).css('display', 'inline-block')

          let formattedAmt = this.currencyPipe.transform(calAmt, '$')
          $('#amt-' + index).html(formattedAmt)
        }
      } else {
        if (qty == '' || qty == 0) {
          for (let h = 0; h < this.assortFilter.length; h++) {
            let ele = this.assortFilter[h]
            let curr = this.productData[index]

            if (curr.atlas_id == ele.atlas_id) {
              const index = this.assortFilter.indexOf(ele)
              if (index >= 0) {
                this.assortFilter.splice(index, 1)
              }
            }
          }

          for (let h = 0; h < this.newArrayFilter.length; h++) {
            let ele = this.newArrayFilter[h]
            let curr = this.productData[index]

            if (curr.atlas_id == ele.atlas_id) {
              const index = this.newArrayFilter.indexOf(ele)
              if (index >= 0) {
                this.newArrayFilter.splice(index, 1)
              }
              this.assortFilter = this.newArrayFilter
            }
          }

          // console.log(this.anotherLinePhaseFilter, 'tersting another line')

          for (let hy = 0; hy < this.anotherLinePhaseFilter.length; hy++) {
            let he = this.anotherLinePhaseFilter[hy]
            let curr = this.productData[index]
            if (curr.atlas_id == he.atlas_id) {
              const ind = this.anotherLinePhaseFilter.indexOf(he)
              if (ind >= 0) {
                this.anotherLinePhaseFilter.splice(ind, 1)
              }
              this.anotherLinePhase = []
              this.anotherLinePhase = this.anotherLinePhaseFilter
            }
          }

          // console.log(this.anotherLinePhase, 'tersting another line')

          let checkTotalAss = 0
          let curr = this.productData[index]

          this.anotherLinePhase.map((val: any, index: any) => {
            if (curr.grouping == val.group) {
              checkTotalAss += parseInt(val.quantity)
            }
          })

          // console.log(checkTotalAss)

          for (let tk = 0; tk < this.anotherLinePhase.length; tk++) {
            let jk = this.anotherLinePhase[tk]
            let tickArrToBeRemoved = []
            // const jk = this.anotherLinePhaseFilter[i];
            let currArrLength = jk.length

            if (curr.grouping == jk.group) {
              if (jk.length > 1) {
                for (let kl = 0; kl < jk.length; kl++) {
                  const kelly = jk[kl]
                  --currArrLength
                  const backWard = jk[currArrLength]
                  const frontWard = jk[kl]

                  if (
                    checkTotalAss < backWard.cond &&
                    checkTotalAss >= frontWard.cond
                  ) {
                    let nxt = frontWard.arrIndex + 1
                    let preData = jk[nxt]
                    let activeData = frontWard

                    $('.normal-booking-' + activeData.pos).css(
                      'display',
                      'none',
                    )

                    $(
                      '.special-booking-' +
                        activeData.pos +
                        '-' +
                        activeData.arrIndex,
                    ).css('display', 'inline-block')

                    $(
                      '.special-booking-' +
                        preData.pos +
                        '-' +
                        preData.arrIndex,
                    ).css('display', 'none')

                    let special = activeData.special
                    let newPrice = parseInt(activeData.quantity) * special
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$',
                    )

                    $('#u-price-' + activeData.pos).html(special)
                    $('#amt-' + activeData.pos).html(formattedAmt)
                    $('#amt-hidd-' + activeData.pos).html(newPrice)
                  } else {
                    let pre = backWard.arrIndex - 1
                    let preData = jk[pre]
                    let activeData = backWard

                    $(
                      '.special-booking-' +
                        activeData.pos +
                        '-' +
                        activeData.arrIndex,
                    ).css('display', 'inline-block')

                    let special = activeData.special
                    let newPrice = parseInt(activeData.quantity) * special
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$',
                    )

                    $('#u-price-' + activeData.pos).html(special)
                    $('#amt-' + activeData.pos).html(formattedAmt)
                    $('#amt-hidd-' + activeData.pos).html(newPrice)

                    console.log(activeData, 'we testing it here, innsed')

                    if (checkTotalAss >= activeData.cond) {
                    } else {
                      if (preData != undefined) {
                        tickArrToBeRemoved.push(activeData)
                      }
                      $('.normal-booking-' + activeData.pos).css(
                        'display',
                        'inline-block',
                      )

                      let booking = activeData.booking
                      let newPrice = parseInt(activeData.quantity) * booking
                      let formattedAmt = this.currencyPipe.transform(
                        newPrice,
                        '$',
                      )

                      $('#u-price-' + activeData.pos).html(booking)
                      $('#amt-' + activeData.pos).html(formattedAmt)
                      $('#amt-hidd-' + activeData.pos).html(newPrice)
                    }

                    if (preData != undefined) {
                      tickArrToBeRemoved.push(preData)
                    }
                    for (let hi = 0; hi < tickArrToBeRemoved.length; hi++) {
                      const kk = tickArrToBeRemoved[hi]
                      $('.special-booking-' + kk.pos + '-' + kk.arrIndex).css(
                        'display',
                        'none',
                      )
                    }
                  }
                }
              } else {
                for (let ag = 0; ag < jk.length; ag++) {
                  const agaa = jk[ag]

                  if (checkTotalAss >= agaa.cond) {
                    $('.normal-booking-' + agaa.pos).css('display', 'none')

                    $('.special-booking-' + agaa.pos + '-' + agaa.arrIndex).css(
                      'display',
                      'inline-block',
                    )
                    let special = agaa.special
                    let newPrice = parseInt(agaa.quantity) * special
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$',
                    )

                    $('#u-price-' + agaa.pos).html(special)
                    $('#amt-' + agaa.pos).html(formattedAmt)
                    $('#amt-hidd-' + agaa.pos).html(newPrice)
                  } else {
                    $('.special-booking-' + agaa.pos + '-' + agaa.arrIndex).css(
                      'display',
                      'none',
                    )
                    let special = agaa.special
                    let newPrice = parseInt(agaa.quantity) * special
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$',
                    )

                    $('#u-price-' + agaa.pos).html(special)
                    $('#amt-' + agaa.pos).html(formattedAmt)
                    $('#amt-hidd-' + agaa.pos).html(newPrice)
                  }
                }
              }
            }
          }
        }

        /// qty = 0;
        let curr = this.productData[index]
        let spec = curr.spec_data

        $('.normal-booking-' + index).css('display', 'none')
        if (spec != null) {
          for (let h = 0; h < spec.length; h++) {
            $('.special-booking-' + index + '-' + h).css('display', 'none')
          }
        }

        let formattedAmt = this.currencyPipe.transform(0, '$')
        $('#amt-' + index).html(formattedAmt)
        $('#amt-hidd-' + index).html(0)
      }
    }

    this.runTotalCalculation(index)
  }

  ///////////////// End of old code /////////////

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

  getAllVendors() {
    this.orderSuccess = false

    this.getData
      .httpGetRequest('/dealer/get-vendors')
      .then((result: any) => {
        if (result.status) {
          this.allVendors = result.data
          this.incomingVendorData = result.data
          this.selectVendor = this.vendorId
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error')
      })
  }

  filterTop(array: any) {
    let prodigal = array.filter((item: any) => {
      return item.atlas_id == this.searchatlasId!
    })
    let newArray = array.filter((item: any) => {
      return item.atlas_id !== this.searchatlasId!
    })

    newArray.unshift(prodigal[0])

    return newArray
  }
  getCart() {
    let id = this.token.getUser().account_id
    this.getData
      .httpGetRequest('/cart/dealer/' + id)
      .then((result: any) => {
        if (result.status) {
          this.cartHistory = result?.data
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error')
      })
  }
  searchVendorId(id: any) {
    this.canOrder = false
    this.getData
      .httpGetRequest('/get-vendor-products/' + id)
      .then((result: any) => {
        if (result.status) {
          this.isMod = true

          this.tableData = result.data
          this.productData = result.data

          if (this.searchatlasId) {
            this.dataSrc = new MatTableDataSource<PeriodicElement>(
              this.filterTop(result.data),
            )
          } else {
            this.dataSrc = new MatTableDataSource<PeriodicElement>(result.data)
          }
          this.canOrder = true
          this.dataSrc.sort = this.sort
          ///  this.dataSrc.paginator = this.paginator
          $('table-ctn').addClass('highlight')
        } else {
          // this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        // this.toastr.info(`Something went wrong`, 'Error');
      })
  }

  submitOrder() {
    this.cartLoader = true
    this.orderSuccess = false

    let uid = this.token.getUser().id.toString()
    let accntId = this.token.getUser().account_id
    this.orderLen = this.orderTable.length
    if (this.orderTable.length > 0) {
      for (let i = 0; i < this.orderTable.length; i++) {
        let pbj: any = this.orderTable[i]
        delete pbj?.loc
      }
      let formdata = {
        uid: uid,
        dealer: accntId,
        product_array: JSON.stringify(this.orderTable),
      }
      this.getData
        .httpPostRequest('/add-item-to-cart', formdata)
        .then((result: any) => {
          if (result.status) {
            this.cartLoader = false
            this.orderSuccess = true
            this.toastr.success(
              `${this.orderLen}  item(s) have been added to cart`,
              'Success',
            )
            this.orderTable = []
            this.getTotal()
            this.getCart()
            if (this.searchatlasId) {
              this.searchVendorId(this.vendorId!)
            } else {
              this.getProductByVendorId()
            }
          } else {
            this.cartLoader = false
            this.toastr.info(`Something went wrong`, 'Error')
          }
        })
        .catch((err) => {
          this.cartLoader = false
          if (err.message.response.dealer || err.message.response.dealer) {
            this.toastr.info(`Please logout and login again`, 'Session Expired')
          } else {
            this.toastr.info(`Something went wrong`, 'Error')
          }
        })
    } else {
      this.cartLoader = false
      this.toastr.info(`No item quantity has been set`, 'Error')
    }
  }

  async confirmBox() {
    return await Swal.fire({
      title: 'You Are About To Remove This Item From Cart',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ok',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.value) {
        return true
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false
      } else {
        return false
      }
    })
  }

  async emptyCartConfirmBox() {
    return await Swal.fire({
      title: 'Are You Sure You Want To Empty Your Cart ?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        return true
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false
      } else {
        return false
      }
    })
  }
}
