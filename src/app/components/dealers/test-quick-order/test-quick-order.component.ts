import { LiveAnnouncer } from '@angular/cdk/a11y'
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort, Sort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { ToastrService } from 'ngx-toastr'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { CommonModule, CurrencyPipe } from '@angular/common'
import Swal from 'sweetalert2'

export interface PeriodicElement {
  qty: any
  atlas_id: any
  vendor: string
  description: string
  booking: number
  special: number
  extended: number
}

declare var $: any

@Component({
  selector: 'app-test-quick-order',
  templateUrl: './test-quick-order.component.html',
  styleUrls: ['./test-quick-order.component.scss'],
})
export class TestQuickOrderComponent implements OnInit {
  searchId = ''
  searchLoader = true
  searchStatus = false
  noData = false
  allCategoryData: any
  searchResultData: any
  disabled = true
  disabledBtn = true
  addLoader = false
  addToQuickLoader = false

  addSuccess = false
  orderTotal: any
  @ViewChild('vendorInput') vendorInput!: ElementRef
  @ViewChild('qtyInput') qtyInput!: ElementRef
  @ViewChild('searchid') atlasInput!: ElementRef

  orderTable: object[] = []
  cartHistory: object[] = []
  orderLen = 0
  tableData: PeriodicElement[] = []
  displayedColumns: string[] = [
    'qty',
    'atlas_id',
    'vendor',
    'vendor_name',
    'description',
    'booking',
    'special',
    'extended',
    'actions',
  ]
  sortTable: any
  dataSrc = new MatTableDataSource<PeriodicElement>()
  @ViewChild(MatPaginator)
  paginator!: MatPaginator
  canOrder = false
  isMod = false
  cartLoader = false
  orderSuccess = false

  //////// Achawayne ///////

  quickOrderData: any
  loaderInput = false
  assortedType = false
  addItemTable: any = []
  noItemFound = false
  normalPrice = 0
  currentProductAmt = 0

  dummyAmt = 0
  userData: any
  TotalAmount = 0

  @ViewChildren('extend')
  extendField!: QueryList<ElementRef>
  currentQty = ''
  tableView = false
  loader = true
  currentGrouping = ''
  productData: any
  modalTableloader = true
  modalTableView = false
  modalTableData: any

  modalTableCol: string[] = [
    'qty',
    'atlas_id',
    'vendor',
    'description',
    'booking',
    'special',
    'extended',
  ]

  assortedItems: [] | any = []
  currentState: [] | any = []
  assortFilter: [] | any = []
  assortSecondFilter: [] | any = []
  newArrayFilter: [] | any = []

  benchMarkQty = 4

  ModalnormalPrice = 0
  ModalcurrentProductAmt = 0
  overTotal: any = 0

  anotherLinePhase: any | [] = []
  anotherLinePhaseFilter: any | [] = []
  groupsArray: any | [] = []

  allAddedItemAtlasID: any | [] = []

  @ViewChildren('Modalextend')
  ModalextendField!: QueryList<ElementRef>

  modalDummyAmt = 0
  incomingVendorData: any
  allVendors: any
  showDropdown = false
  @ViewChild('dummyInput') dummyInput!: ElementRef
  vendorCode = ''
  addedItem: any = []

  @ViewChild('closeModalBtn') closeModalBtn!: ElementRef

  ClearBtnText = true
  ClearOrderBtnLoader = false
  modalTableBtn = false

  newlyAdded = 0
  existingInQuickOrder = ''
  existingInOrder = ''
  showAlert = false
  vendorDisplay: any
  addBtn = true
  currentVendor = ''
  notAllowed = true
  saveChangesLoaders = false
  editedInput = false
  goodToSubmit = true

  //////// Achawayne stopped /////////

  constructor(
    private getData: HttpRequestsService,
    private toastr: ToastrService,
    private token: TokenStorageService,
    private _liveAnnouncer: LiveAnnouncer,
    private currencyPipe: CurrencyPipe,
  ) {
    // this.searchResultData.vendor_name = '';
    //  this.fetchProductById()
    // this.getCart()
    ///this.fetchQuickOrderCart()
  }
  @ViewChild(MatSort)
  sort!: MatSort
  ngOnInit(): void {
    this.userData = this.token.getUser()
    this.fetchQuickOrderCart()
  }

  //////////// Achawayne /////////////////////

  removeShowAlert() {
    this.showAlert = false
  }

  addOrderToQuickTable() {
    let allProCount = this.productData.length
    let addedState = false
    let inCart = false
    let postItem = []
    this.modalTableBtn = true

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
          vendor_no: data.vendor_product_code,
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
      .httpPostRequest('/dealer/submit-assorted-quick-order', postData)
      .then((res: any) => {
        this.modalTableBtn = false
        if (res.status) {
          this.newlyAdded = res.data.newly_added
          this.existingInQuickOrder = res.data.existing_already_in_quick_order
          this.existingInOrder = res.data.existing_already_in_order
          this.currentVendor = res.data.current_vendor

          if (res.data.existing_status == true) {
            this.showAlert = true
          }

          if (res.data.submitted_status) {
            this.toastr.success(`item(s) has been submitted`, 'Success')
          }

          if (!res.data.submitted_status) {
            this.toastr.error(`item(s) already in cart`, 'Cart Update')
          }

          this.closeModalBtn.nativeElement.click()
          this.fetchQuickOrderCart()
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.showAlert = false

        if (err.message.response.dealer || err.message.response.dealer) {
          this.toastr.info(`Please logout and login again`, 'Session Expired')
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
  }

  runModalTableCalculation(index: number, qty: any, event: any) {
    if (event.key != 'Tab') {
      if (qty !== '') {
        let curr = this.productData[index]
        let atlasId = curr.atlas_id
        let spec = curr.spec_data

        // if (!this.allAddedItemAtlasID.includes(atlasId)) {
        //   this.allAddedItemAtlasID.push(atlasId)
        // }

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
                        console.log(this.anotherLinePhase)
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
                let arr = this.ModalextendField.toArray()[index]
                let specialAmt = 0
                let specialCond = 0
                let specData = this.productData[index].spec_data
                this.ModalnormalPrice = parseFloat(
                  this.productData[index].booking,
                )
                for (let i = 0; i < specData.length; i++) {
                  let curAmt = parseFloat(specData[i].special)
                  let cond = parseInt(specData[i].cond)
                  let orignialAmt = parseFloat(specData[i].booking)
                  specData[i].arrIndex = i
                  let nextArr = i + 1
                  let len = specData.length

                  if (qty >= cond) {
                    this.ModalnormalPrice = curAmt
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
                    this.ModalnormalPrice = this.ModalnormalPrice
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
                    this.ModalnormalPrice = curAmt
                  } else {
                    this.ModalnormalPrice = this.ModalnormalPrice
                  }
                }

                let calAmt = qty * this.ModalnormalPrice
                this.ModalcurrentProductAmt = calAmt
                $('#u-price-' + index).html(this.ModalnormalPrice)
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
            this.ModalcurrentProductAmt = calAmt

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
          this.ModalcurrentProductAmt = calAmt

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

          let checkTotalAss = 0
          let curr = this.productData[index]

          this.anotherLinePhase.map((val: any, index: any) => {
            ///console.log(val.group);
            if (curr.grouping == val.group) {
              checkTotalAss += parseInt(val.quantity)
            }
          })

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
                    // $('.normal-booking-' + agaa.pos).css(
                    //   'display',
                    //   'inline-block'
                    // );

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

          // console.log(this.anotherLinePhaseFilter);
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
      }
    }
  }

  getcurrentGroupings() {
    this.canOrder = false
    this.isMod = false

    this.modalTableloader = true
    this.modalTableView = false
    /// let id = this.vendor.nativeElement.value
    // this.showSubmittedDetails = false

    this.getData
      .httpGetRequest('/dealer/get-item-group/' + this.currentGrouping)
      .then((result: any) => {
        this.modalTableloader = false
        this.modalTableView = true

        if (result.status) {
          this.productData = result.data

          this.tableData = result.data
          if (result.data.length !== 0) {
            this.canOrder = true
          }
          this.orderTable = []

          this.modalTableData = new MatTableDataSource<PeriodicElement>(
            result.data,
          )
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error')
      })
  }

  oneAddBtn() {
    // let allProCount = this.productData.length
    this.showAlert = false

    let addedState = false
    let inCart = false
    let postItem = []

    if (this.currentQty != '') {
      this.addToQuickLoader = true
      this.addSuccess = false

      let rawUnit = document.getElementById('u-price-' + 0)?.innerText
      let unit = rawUnit?.replace(',', '.')

      let rawPrice = document.getElementById('amt-hidd-' + 0)?.innerHTML
      // let realPrice = rawPrice?.replace('$', '')
      let newPrice = rawPrice?.replace(',', '.')

      let cartData = {
        uid: this.userData.id,
        dealer: this.userData.account_id,
        vendor_id: this.quickOrderData[0].vendor,
        atlas_id: this.quickOrderData[0].atlas_id,
        product_id: this.quickOrderData[0].id,
        qty: this.currentQty,
        price: newPrice,
        unit_price: unit,
        groupings: this.quickOrderData[0].grouping,
        type: 'null',
        vendor_no: this.quickOrderData[0].vendor_product_code,
      }

      postItem.push(cartData)

      let postData = {
        uid: this.userData.id,
        dealer: this.userData.account_id,
        product_array: JSON.stringify(postItem),
      }

      this.getData
        .httpPostRequest('/dealer/submit-quick-order', postData)
        .then((res: any) => {
          if (res.status) {
            this.fetchQuickOrderCart()
            this.cartLoader = false
            this.addToQuickLoader = false
            this.addSuccess = true

            this.newlyAdded = res.data.newly_added
            this.existingInQuickOrder = res.data.existing_already_in_quick_order
            this.existingInOrder = res.data.existing_already_in_order
            this.currentVendor = res.data.current_vendor

            if (res.data.existing_status == true) {
              this.showAlert = true
            }

            if (res.data.existing_quick_order_status) {
              this.toastr.error(
                `item(s) already in order list`,
                'Status Update',
              )
            }

            if (res.data.submitted_status) {
              this.toastr.success(`item has been added to cart`, 'Success')
            }

            this.orderTable = []
            this.atlasInput.nativeElement.value = null
            this.vendorInput.nativeElement.value = null
            this.qtyInput.nativeElement.value = null
            this.searchStatus = false
            // this.fetchQuickOrderCart()
          } else {
            this.addToQuickLoader = false
            this.toastr.info(`Something went wrong`, 'Error')
          }
        })
        .catch((err) => {
          this.showAlert = false

          // this.cartLoader = false
          if (err.message.response.dealer || err.message.response.dealer) {
            this.toastr.info(`Please logout and login again`, 'Session Expired')
          } else {
            this.toastr.info(`Something went wrong`, 'Error')
          }
        })

      console.log(postItem)
    }
  }

  runCalculation(qty: any, index: number) {
    if (qty != '') {
      this.currentQty = qty
      let curr = this.quickOrderData[index]
      let atlasId = curr.atlas_id
      let spec = curr.spec_data

      if (spec != null) {
        if (spec.length > 0) {
          let arr = this.extendField.toArray()[index]
          let specialAmt = 0
          let specialCond = 0
          let specData = this.quickOrderData[index].spec_data
          this.normalPrice = parseFloat(this.quickOrderData[index].booking)
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
              $('.special-booking-' + index + '-' + specData[i].arrIndex).css(
                'display',
                'inline-block',
              )
              let g = i - 1
              let nxt = i + 1
              if (specData[nxt]) {
                $('.special-booking-' + index + '-' + nxt).css(
                  'display',
                  'none',
                )
              } else {
              }
              $('.special-booking-' + index + '-' + g).css('display', 'none')
            } else {
              this.normalPrice = this.normalPrice
              $('.special-booking-' + index + '-' + i).css('display', 'none')
              let nxt = i + 1
              let pre = i - 1
              if (specData[nxt]) {
                let cond = specData[nxt].cond
                if (qty < cond) {
                  $('.normal-booking-' + index).css('display', 'inline-block')
                } else {
                  $('.normal-booking-' + index).css('display', 'none')
                }
                $('.normal-booking-' + index).css('display', 'none')
              } else {
                let preData = specData[pre]
                if (preData) {
                  let preCond = parseInt(preData.cond)
                  if (qty >= preCond) {
                    $('.normal-booking-' + index).css('display', 'none')
                  } else {
                  }
                } else {
                  $('.normal-booking-' + index).css('display', 'inline-block')
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

            console.log(this.normalPrice, 'tesrs')
          }
          let calAmt = qty * this.normalPrice
          this.currentProductAmt = calAmt
          $('#u-price-' + index).html(this.normalPrice)
          let formattedAmt = this.currencyPipe.transform(calAmt, '$')
          arr.nativeElement.innerHTML = formattedAmt
          $('#amt-' + index).html(formattedAmt)
          $('#amt-hidd-' + index).html(calAmt)
        } else {
          let quantity = parseInt(qty)
          let price = parseFloat(curr.booking)

          let calAmt = quantity * price
          this.currentProductAmt = calAmt

          console.log(price, 'unit Price')
          $('#u-price-' + index).html(price)
          $('.normal-booking-' + index).css('display', 'inline-block')

          let formattedAmt = this.currencyPipe.transform(calAmt, '$')
          $('#amt-' + index).html(formattedAmt)
          $('#amt-hidd-' + index).html(calAmt)
        }
      } else {
        let quantity = parseInt(qty)
        let price = parseFloat(curr.booking)

        let calAmt = quantity * price
        this.currentProductAmt = calAmt

        console.log(price, 'unit Price')
        $('#u-price-' + index).html(price)
        $('.normal-booking-' + index).css('display', 'inline-block')

        let formattedAmt = this.currencyPipe.transform(calAmt, '$')
        $('#amt-' + index).html(formattedAmt)
        $('#amt-hidd-' + index).html(calAmt)
      }
    } else {
      let curr = this.quickOrderData[index]
      let spec = curr.spec_data
      $('.normal-booking-' + index).css('display', 'none')
      if (spec != null) {
        for (let h = 0; h < spec.length; h++) {
          $('.special-booking-' + index + '-' + h).css('display', 'none')
        }
      }

      let formattedAmt = this.currencyPipe.transform(0, '$')
      $('#amt-' + index).html(formattedAmt)
    }
  }

  runQuickTableCalculation(index: number, qty: any, event: any, atlas: any) {
    this.editedInput = true
    this.goodToSubmit = false
    if (event.key != 'Tab') {
      if (qty !== '') {
        let curr = this.productData[index]
        let atlasId = curr.atlas_id
        let spec = curr.spec_data
        curr.qty = qty

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

                        // for (let t = 0; t < this.productData.length; t++) {
                        //   const tt = this.productData[t]
                        //   if (tt.atlas_id == atlas) {
                        //     tt.price = formattedAmt
                        //     tt.qty = qty
                        //   }
                        // }

                        // for (let a = 0; a < this.productData.length; a++) {
                        //   const element = this.productData[a];
                        //   if(element.atlas_id == ele.atlas_id){
                        //     element.price = newPrice
                        //   }

                        // }

                        this.productData[e.pos].price = newPrice
                        this.productData[e.pos].calPrice = newPrice
                        this.productData[e.pos].qty = quantity
                        this.productData[e.pos].forCal = newPrice
                        this.productData[e.pos].unitPrice = e.booking

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
                      // console.log(curr.grouping)
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

                          let booking = parseFloat(eleK.booking)
                          let newPrice = parseInt(eleK.quantity) * booking
                          let formattedAmt = this.currencyPipe.transform(
                            newPrice,
                            '$',
                          )

                          this.productData[eleK.pos].price = formattedAmt
                          this.productData[eleK.pos].calPrice = newPrice
                          this.productData[eleK.pos].qty = eleK.quantity
                          this.productData[eleK.pos].forCal = newPrice
                          this.productData[eleK.pos].unitPrice = eleK.booking

                          // for (let t = 0; t < this.productData.length; t++) {
                          //   const tt = this.productData[t]
                          //   if (tt.atlas_id == atlas) {
                          //     tt.price = formattedAmt
                          //     tt.qty = qty

                          //   }
                          // }

                          ///this.productData[eleK.pos].calPrice = newPrice
                          ///this.productData[eleK.pos].price = formattedAmt

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

                            // this.productData[
                            //   activeData.pos
                            // ].price = formattedAmt

                            // this.productData[activeData.pos].calPrice = newPrice

                            // for (let t = 0; t < this.productData.length; t++) {
                            //   const tt = this.productData[t]
                            //   if (tt.atlas_id == atlas) {
                            //     tt.price = formattedAmt
                            //     tt.qty = qty
                            //   }
                            // }

                            this.productData[
                              activeData.pos
                            ].price = formattedAmt
                            this.productData[activeData.pos].calPrice = newPrice
                            this.productData[activeData.pos].qty =
                              activeData.quantity
                            this.productData[activeData.pos].forCal = newPrice
                            this.productData[activeData.pos].unitPrice = special

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

                              for (
                                let t = 0;
                                t < this.productData.length;
                                t++
                              ) {
                                const tt = this.productData[t]
                                if (tt.atlas_id == atlas) {
                                  tt.price = formattedAmt
                                }
                              }

                              // this.productData[pp.pos].calPrice = newPrice
                              // this.productData[pp.pos].price = formattedAmt

                              this.productData[pp.pos].price = formattedAmt
                              this.productData[pp.pos].calPrice = newPrice
                              this.productData[pp.pos].qty = activeData.quantity
                              this.productData[pp.pos].forCal = newPrice
                              this.productData[pp.pos].unitPrice = special

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
                ///arr.nativeElement.innerHTML = formattedAmt

                // this.productData[index].price = formattedAmt
                // this.productData[index].calPrice = calAmt

                // for (let t = 0; t < this.productData.length; t++) {
                //   const tt = this.productData[t]
                //   if (tt.atlas_id == atlas) {
                //     tt.price = formattedAmt
                //   }
                // }

                this.productData[index].price = formattedAmt
                this.productData[index].calPrice = calAmt
                this.productData[index].qty = qty
                this.productData[index].forCal = calAmt
                this.productData[index].unitPrice = this.normalPrice

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

            // this.productData[index].price = formattedAmt
            // this.productData[index].calPrice = calAmt

            // for (let t = 0; t < this.productData.length; t++) {
            //   const tt = this.productData[t]
            //   if (tt.atlas_id == atlas) {
            //     tt.price = formattedAmt
            //   }
            // }

            this.productData[index].price = formattedAmt
            this.productData[index].calPrice = calAmt
            this.productData[index].qty = qty
            this.productData[index].forCal = calAmt
            this.productData[index].unitPrice = price

            $('#amt-' + index).html(formattedAmt)
            $('#amt-hidd-' + index).html(calAmt)
          }
        } else {
          console.log('trying to find it')
          let quantity = parseInt(qty)
          let price = parseFloat(curr.booking)

          let calAmt = quantity * price
          this.currentProductAmt = calAmt

          $('#u-price-' + index).html(price)
          $('#amt-hidd-' + index).html(calAmt)
          $('.normal-booking-' + index).css('display', 'inline-block')
          let formattedAmt = this.currencyPipe.transform(calAmt, '$')

          // this.productData[index].price = formattedAmt
          // this.productData[index].calPrice = calAmt

          // for (let t = 0; t < this.productData.length; t++) {
          //   const tt = this.productData[t]
          //   if (tt.atlas_id == atlas) {
          //     tt.price = formattedAmt
          //   }
          // }

          this.productData[index].price = formattedAmt
          this.productData[index].calPrice = calAmt
          this.productData[index].qty = qty
          this.productData[index].forCal = calAmt
          this.productData[index].unitPrice = price

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

                    // this.productData[activeData.pos].price = formattedAmt
                    // this.productData[activeData.pos].calPrice = newPrice

                    // for (let t = 0; t < this.productData.length; t++) {
                    //   const tt = this.productData[t]
                    //   if (tt.atlas_id == atlas) {
                    //     tt.price = formattedAmt
                    //   }
                    // }

                    this.productData[activeData.pos].price = formattedAmt
                    this.productData[activeData.pos].calPrice = newPrice
                    this.productData[activeData.pos].qty = activeData.quantity
                    this.productData[activeData.pos].forCal = newPrice
                    this.productData[activeData.pos].unitPrice = special

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

                    // this.productData[activeData.pos].price = formattedAmt
                    // this.productData[activeData.pos].calPrice = newPrice

                    // for (let t = 0; t < this.productData.length; t++) {
                    //   const tt = this.productData[t]
                    //   if (tt.atlas_id == atlas) {
                    //     tt.price = formattedAmt
                    //   }
                    // }

                    this.productData[activeData.pos].price = formattedAmt
                    this.productData[activeData.pos].calPrice = newPrice
                    this.productData[activeData.pos].qty = activeData.quantity
                    this.productData[activeData.pos].forCal = newPrice
                    this.productData[activeData.pos].unitPrice = special

                    $('#u-price-' + activeData.pos).html(special)
                    $('#amt-' + activeData.pos).html(formattedAmt)
                    $('#amt-hidd-' + activeData.pos).html(newPrice)

                    /// console.log(activeData, 'we testing it here, innsed')

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

                      // for (let t = 0; t < this.productData.length; t++) {
                      //   const tt = this.productData[t]
                      //   if (tt.atlas_id == atlas) {
                      //     tt.price = formattedAmt
                      //   }
                      // }

                      // this.productData[activeData.pos].price = formattedAmt
                      // this.productData[activeData.pos].calPrice = newPrice

                      this.productData[activeData.pos].price = formattedAmt
                      this.productData[activeData.pos].calPrice = newPrice
                      this.productData[activeData.pos].qty = activeData.quantity
                      this.productData[activeData.pos].forCal = newPrice

                      this.productData[activeData.pos].unitPrice = booking

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

                    // for (let t = 0; t < this.productData.length; t++) {
                    //   const tt = this.productData[t]
                    //   if (tt.atlas_id == atlas) {
                    //     tt.price = formattedAmt
                    //   }
                    // }

                    // this.productData[agaa.pos].price = formattedAmt
                    // this.productData[agaa.pos].calPrice = newPrice

                    this.productData[agaa.pos].price = formattedAmt
                    this.productData[agaa.pos].calPrice = newPrice
                    this.productData[agaa.pos].qty = agaa.quantity
                    this.productData[agaa.pos].forCal = newPrice
                    this.productData[agaa.pos].unitPrice = special

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

                    // for (let t = 0; t < this.productData.length; t++) {
                    //   const tt = this.productData[t]
                    //   if (tt.atlas_id == atlas) {
                    //     tt.price = formattedAmt
                    //   }
                    // }

                    // this.productData[agaa.pos].price = formattedAmt
                    // this.productData[agaa.pos].calPrice = newPrice

                    this.productData[agaa.pos].price = formattedAmt
                    this.productData[agaa.pos].calPrice = newPrice
                    this.productData[agaa.pos].qty = agaa.quantity
                    this.productData[agaa.pos].forCal = newPrice
                    this.productData[agaa.pos].unitPrice = special

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

        // this.productData[index].price = '$0.00'
        // this.productData[index].calPrice = 0

        // for (let t = 0; t < this.productData.length; t++) {
        //   const tt = this.productData[t]
        //   if (tt.atlas_id == atlas) {
        //     tt.price = '$0.00'
        //   }
        // }

        let formattedAmt = this.currencyPipe.transform(0, '$')

        this.productData[index].price = formattedAmt
        this.productData[index].calPrice = 0
        this.productData[index].qty = ''
        this.productData[index].forCal = 0
        this.productData[index].unitPrice = 0

        $('#amt-' + index).html(formattedAmt)
        $('#amt-hidd-' + index).html(0)
      }
    }

    this.runQuickTableTotalCalculation(index)

    ///console.log(this.productData)
  }

  runQuickTableTotalCalculation(index: number) {
    let currentProduct = this.productData[index]

    let curQty = $('#cur-' + index).val()
    let rawPrice = document.getElementById('amt-hidd-' + index)?.innerHTML
    // let realPrice = rawPrice?.replace('$', '')
    let newPrice = rawPrice?.replace(',', '')

    let data = {
      atlasId: currentProduct.atlas_id,
      forCal: currentProduct.forCal,
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
          item.forCal = currentProduct.forCal
          presentItem = true
        } else {
        }
      }

      if (!presentItem) {
        for (let g = 0; g < this.addedItem.length; g++) {
          const t = this.addedItem[g]
          if (t.grouping == currentProduct.grouping) {
            t.forCal = currentProduct.forCal
          } else {
            for (let i = 0; i < this.addedItem.length; i++) {
              const item = this.addedItem[i]
              if (item.atlasId == currentProduct.atlasId) {
                item.forCal = currentProduct.forCal
                console.log('found de atlas id', currentProduct.atlasId)
              } else {
              }
            }
          }
          //groupings
        }
        this.addedItem.push(data)
      } else {
      }
    }

    this.TotalAmount = 0
    for (let j = 0; j < this.addedItem.length; j++) {
      const h = this.addedItem[j]
      console.log(h)
      this.TotalAmount += parseFloat(h.forCal)
    }
  }

  fetchProductById() {
    let atlasId = this.searchId
    this.noData = false
    this.disabled = true
    this.loaderInput = true

    console.log('search id', atlasId)
    if (atlasId !== '') {
      this.searchStatus = false
      this.searchLoader = true
      this.getData
        .httpGetRequest('/dealer/get-item-by-atlas-vendor-code/' + atlasId)
        .then((res: any) => {
          this.loaderInput = false

          if (res.status) {
            this.searchStatus = true
            this.searchLoader = false
            this.noItemFound = res.data.filtered_data.length > 0 ? false : true
            this.notAllowed = res.data.filtered_data.length > 0 ? false : true

            if (res.data.filtered_data.length > 0) {
              this.currentGrouping =
                res.data.filtered_data[0].grouping != null
                  ? res.data.filtered_data[0].grouping
                  : ''

              this.notAllowed =
                res.data.filtered_data[0].grouping != null ? true : false

              console.log(res.data.filtered_data)
              console.log(this.currentGrouping, 'we rae')
            }

            this.searchResultData = res.data
            this.quickOrderData = res.data.filtered_data
            this.vendorDisplay = res.data.filtered_data[0]
            this.assortedType = res.data.assorted
            if (this.assortedType) {
              //// this.addToQuickLoader = false
              this.disabled = true
              this.addBtn = false
            } else {
              /// this.addToQuickLoader = true
              this.disabled = false
              this.addBtn = true
            }
            this.noData = false
            // this.disabled = false
          } else {
            this.searchStatus = false
            this.searchLoader = false
            this.noData = true
            this.disabled = true
          }
        })
        .catch((err: any) => {
          this.loaderInput = false

          this.searchStatus = false
          this.searchLoader = false
          this.noData = true
          this.disabled = true
          console.log(err)
          this.toastr.error('Something went wrong, try again', ' Error')
        })
    } else {
    }
  }

  fetchQuickOrderCart() {
    this.canOrder = false
    this.isMod = false
    let id = this.token.getUser()?.id
    this.getData
      .httpGetRequest(
        '/dealer/get-dealer-quick-orders/' +
          this.userData.account_id +
          '/' +
          this.userData.id,
      )
      .then((result: any) => {
        this.tableView = true
        this.loader = false

        if (result.status) {
          this.productData = result.data
          this.TotalAmount = 0

          for (let h = 0; h < result.data.length; h++) {
            const element = result.data[h]
            this.productData[h].position = h
            this.productData[h].qty = element.qty
            this.productData[h].unitPrice = element.unit_price
            this.productData[h].calPrice = element.price
            this.productData[h].forCal = element.price
            this.productData[h].price = this.currencyPipe.transform(
              element.price,
              '$',
            )

            this.TotalAmount += parseFloat(this.productData[h].forCal)

            let data = {
              atlasId: this.productData[h].atlas_id,
              forCal: this.productData[h].forCal,
              grouping: this.productData[h].grouping,
              index: h,
            }

            this.addedItem.push(data)
          }

          this.tableData = this.productData
          this.dataSrc = new MatTableDataSource<PeriodicElement>(
            this.productData,
          )
          // this.dataSrc.sort = this.sort
          this.dataSrc.paginator = this.paginator
        } else {
          // this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error')
      })
  }

  async confirmBox() {
    return await Swal.fire({
      title: 'Are you sure you want to clear the data in quick order',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
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

  async deleteQuickOrderItem(atlsId: any, index: any) {
    let confirmStatus = await this.confirmBox()

    if (confirmStatus) {
      let uid = this.token.getUser().id.toString()

      $('#remove-icon-' + index).css('display', 'none')
      $('#remove-loader-' + index).css('display', 'inline-block')

      this.getData
        .httpGetRequest('/dealer/delete-quick-order-item/' + uid + '/' + atlsId)
        .then((result: any) => {
          $('#remove-icon-' + index).css('display', 'inline-block')
          $('#remove-loader-' + index).css('display', 'none')

          if (result.status) {
            this.toastr.success(
              'Successful',
              'all item has been successfully removed from the cart',
            )
            this.fetchQuickOrderCart()
          } else {
            this.toastr.error('Something went wrong', 'Try again')
          }
        })
        .catch((err) => {
          this.toastr.error('Something went wrong', 'Try again')
        })
    }
  }

  async clearQuickOrderConfirmBox() {
    return await Swal.fire({
      title: 'You Are About To Clear Your Quick Order',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
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

  async clearCart() {
    if (this.tableData.length > 0) {
      let confirmBox = await this.clearQuickOrderConfirmBox()
      if (confirmBox) {
        this.ClearBtnText = false
        this.ClearOrderBtnLoader = true
        let uid = this.token.getUser().id.toString()
        this.getData
          .httpGetRequest('/dealer/remove-all-user-order/' + uid)
          .then((result: any) => {
            this.ClearBtnText = true
            this.ClearOrderBtnLoader = false
            if (result.status) {
              this.toastr.success(
                `All Item has been successfully removed from the cart`,
                'Success',
              )

              this.fetchQuickOrderCart()
            } else {
              this.cartLoader = false

              this.toastr.info(`${result.message}`, 'Error')
            }
          })
          .catch((err) => {
            this.ClearBtnText = true
            this.ClearOrderBtnLoader = false
            if (err.message.response.dealer || err.message.response.dealer) {
              this.toastr.info(
                `Please logout and login again`,
                'Session Expired',
              )
            } else {
              this.toastr.info(`Something went wrong`, 'Error')
            }
          })
      }
    }
  }

  saveQuickOrderChanges() {
    this.goodToSubmit = true
    this.saveChangesLoaders = true
    let allProCount = this.productData.length
    let addedState = false
    let inCart = false
    let postItem = []

    for (let h = 0; h < this.productData.length; h++) {
      let curQty = this.productData[h].qty
      //// console.log(this.productData)

      if (curQty != '0' && curQty != undefined && curQty != '') {
        let data = this.productData[h]

        let cartData = {
          uid: this.userData.id,
          dealer: this.userData.account_id,
          vendor_id: data.vendor,
          atlas_id: data.atlas_id,
          product_id: data.id,
          qty: curQty,
          price: data.forCal,
          unit_price: data.unitPrice,
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
      .httpPostRequest('/dealer/save-quick-order-changes', postData)
      .then((res: any) => {
        console.log(res)
        this.saveChangesLoaders = false
        this.editedInput = false

        if (res.status) {
          this.toastr.success(` changes has been saved`, 'Success')
        } else {
          this.saveChangesLoaders = false
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.saveChangesLoaders = false
        if (err.message.response.dealer || err.message.response.dealer) {
          this.toastr.info(`Please logout and login again`, 'Session Expired')
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
  }

  /////////// Achawayne Stopped ///////////////////

  addToQuickOrder() {
    this.addLoader = true
    this.addSuccess = false

    let uid = this.token.getUser().id.toString()
    let accntId = this.token.getUser().account_id
    this.orderLen = this.orderTable.length
    if (this.orderTable.length > 0) {
      let formdata = {
        uid: uid,
        dealer: accntId,
        product_array: JSON.stringify(this.orderTable),
      }
      this.getData
        .httpPostRequest('/dealer/submit-quick-order', formdata)
        .then((result: any) => {
          if (result.status) {
            this.addLoader = false
            this.addSuccess = true
            this.toastr.success(
              `${this.orderLen}  item have been added to order`,
              'Success',
            )
            this.orderTable = []
            this.atlasInput.nativeElement.value = null
            this.vendorInput.nativeElement.value = null
            this.qtyInput.nativeElement.value = null
            this.searchStatus = false
            ///   this.fetchQuickOrderCart()
          } else {
            this.addLoader = false

            this.toastr.info(`Something went wrong`, 'Error')
          }
        })
        .catch((err) => {
          this.addLoader = false
          if (err.message.response.dealer || err.message.response.dealer) {
            this.toastr.info(`Please logout and login again`, 'Session Expired')
          } else {
            this.toastr.info(`Something went wrong`, 'Error')
          }
        })
    } else {
      this.addLoader = false

      this.toastr.info(`No item quantity has been set`, 'Error')
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`)
    } else {
      this._liveAnnouncer.announce('Sorting cleared')
    }
  }

  parser(data: any) {
    return JSON.parse(data)
  }

  getCart() {
    let id = this.token.getUser().account_id
    this.getData
      .httpGetRequest('/cart/dealer/' + id)
      .then((result: any) => {
        if (result.status) {
          console.log('dealer id', result?.data)
          this.cartHistory = result?.data
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error')
      })
  }

  submitOrder() {
    this.cartLoader = true
    this.orderSuccess = false

    let uid = this.token.getUser().id.toString()
    let accntId = this.token.getUser().account_id
    this.orderLen = this.orderTable.length
    if (this.dataSrc.data.length > 0) {
      let formdata = {
        uid: uid,
        dealer: accntId,
      }
      this.getData
        .httpPostRequest('/dealer/move-dealer-quick-order', formdata)
        .then((result: any) => {
          if (result.status) {
            this.cartLoader = false
            this.orderSuccess = true
            this.toastr.success(
              `Item(s) have been successfully Submitted`,
              'Success',
            )
            this.fetchQuickOrderCart()
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
}
