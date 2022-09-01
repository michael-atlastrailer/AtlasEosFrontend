import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  OnInit,
  ViewChildren,
  QueryList,
} from '@angular/core'
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
import { CommonModule, CurrencyPipe, Location } from '@angular/common'
import Swal from 'sweetalert2'
import { ComponentCanDeactivate } from 'src/app/core/model/can-deactivate'
import { ProductTableHandlerService } from 'src/app/core/services/product-table-handler/product-table-handler.service'

declare var $: any

export interface PeriodicElement {
  atlas_id: any
  vendor: string
  description: string
  booking: number
  special: number
  extended: number
}

class AddEditProduct {
  qty: number | undefined
  atlasId: number | undefined
  vendor: number | undefined
  description: string | undefined
  regular: number | undefined
  special: number | undefined
  extended: string | undefined
  action: string | undefined
}

@Component({
  selector: 'app-edit-order-vendor-page',
  templateUrl: './edit-order-vendor-page.component.html',
  styleUrls: ['./edit-order-vendor-page.component.scss'],
})
export class EditOrderVendorPageComponent implements ComponentCanDeactivate {
  tableData: PeriodicElement[] = []
  displayedColumns: string[] = [
    'qty',
    'atlas_id',
    'vendor',
    'description',
    'booking',
    'special',
    'extended',
    'actions',
  ]
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
  allCategoryData: any
  cartLoader = false
  vendorId: any
  loader = true

  modalTableCol: string[] = [
    'qty',
    'atlas_id',
    'vendor',
    'description',
    'booking',
    'special',
    'extended',
  ]

  ///////// Import for calculation ///////////

  assortedItems: [] | any = []
  currentState: [] | any = []
  assortFilter: [] | any = []
  noQtyAssortFilter: [] | any = []
  assortSecondFilter: [] | any = []
  newTotalArray: [] | any = []
  newArrayFilter: [] | any = []
  anotherLinePhase: any | [] = []
  anotherLinePhaseFilter: any | [] = []
  groupsArray: any | [] = []
  cartData: any | [] = []

  assortedIds: [] | any = []

  assortedItemsM: [] | any = []
  currentStateM: [] | any = []
  assortFilterM: [] | any = []
  noQtyAssortFilterM: [] | any = []
  assortSecondFilterM: [] | any = []
  newTotalArrayM: [] | any = []
  newArrayFilterM: [] | any = []
  anotherLinePhaseM: any | [] = []
  anotherLinePhaseFilterM: any | [] = []
  groupsArrayM: any | [] = []
  cartDataM: any | [] = []

  @ViewChild('closeModalBtn')
  closeModalBtn!: ElementRef

  @ViewChild('atlas')
  atlas!: ElementRef

  @ViewChildren('extend')
  extendField!: QueryList<ElementRef>

  @ViewChildren('Modalextend')
  ModalextendField!: QueryList<ElementRef>

  @ViewChildren('trRow')
  tableRow!: QueryList<ElementRef>

  normalPrice = 0
  currentProductAmt = 0
  overTotal = 0

  ModalnormalPrice = 0
  ModalcurrentProductAmt = 0

  addedItem: [] | any = []
  userData: any

  saveBtnLoader = false
  modalTableloader = false
  modalTableView = true
  modalTableData: any
  modalDummyAmt = 0
  modalTableBtn = false

  assortedType = false
  typingLoader = false
  assigned = false
  tableViewDisplay: any
  eachSelectedItem: any
  assortedTableItem: any
  currentVendorName = ''
  editedInput = false
  assortedCheckerArray: any | []
  itemNotFound = false

  incomingData: any
  /////// end of importation //////////

  constructor(
    private getData: HttpRequestsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    private token: TokenStorageService,
    private currencyPipe: CurrencyPipe,
    private location: Location,
    public productTableService: ProductTableHandlerService,
  ) {
    this.route.params.subscribe((params) => {
      this.vendorId = params['vendorId']

      if (this.vendorId) {
        // console.log('got in', this.vendorId)
        this.getCartByVendorId(this.vendorId)
        this.getVendorData()
      }
    })
    this.userData = this.token.getUser()
  }
  @ViewChild(MatSort)
  sort!: MatSort

  ngOnInit(): void { }
  ngAfterViewInit() { }
  parser(data: any) {
    return JSON.parse(data)
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`)
    } else {
      this._liveAnnouncer.announce('Sorting cleared')
    }
  }

  omitSpecialChar(e: any) {
    var k
    document.all ? (k = e.keyCode) : (k = e.which)
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    )
  }

  atlasIdFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value
    if (this.incomingData) {
      this.incomingData.atlas_id = filterValue.trim().toLowerCase()
      this.dataSrc = this.atlasFilterValue('*' + filterValue)
    }
  }

  atlasFilterValue(expression: string) {
    var regex = this.convertWildcardStringToRegExp(expression)
    return this.incomingData.filter(function (item: any) {
      return regex.test(item.atlas_id)
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

  goBack() {
    this.location.back()
  }

  addAssortedItem() {
    this.tableViewDisplay = this.assortedTableItem
    this.assigned = true
  }

  closeModal() {
    this.assigned = false
    this.assortedType = false
    this.tableViewDisplay = []
    this.atlas.nativeElement.value = ''
    $('#input-edit').val('')

    this.assortedItemsM = []
    this.currentStateM = []
    this.assortFilterM = []
    this.noQtyAssortFilterM = []
    this.assortSecondFilterM = []
    this.newTotalArrayM = []
    this.newArrayFilterM = []
    this.anotherLinePhaseM = []
    this.anotherLinePhaseFilterM = []
    this.groupsArrayM = []
    this.cartDataM = []
  }

  allOverTotal() {
    let total = 0
    this.overTotal = 0
    for (let index = 0; index < this.cartData.length; index++) {
      const element = this.cartData[index]

      // let price = document.getElementById('amt-hidd-' + index)?.innerText

      ///  let price = $('#amt-hidd-' + index).html()
      if (element.price != undefined) {
        /// console.log(element.price, 'we test price')
        total += parseFloat(element.price)
      }
    }

    let formattedAmt = this.currencyPipe.transform(total, '$')

    $('.order-total').html(formattedAmt)
    // console.log(total, 'our total')
    /// this.overTotal = total
  }

  getVendorData() {
    this.getData
      .httpGetRequest('/dealer/get-vendor-data/' + this.vendorId)
      .then((result: any) => {
        if (result.status) {
          this.currentVendorName = result.data.vendor_name
        } else {
        }
      })
      .catch((err) => { })
  }

  getItemVendorItem(atlas: any) {
    this.typingLoader = true

    this.getData
      .httpGetRequest('/dealer/get-vendor-item/' + this.vendorId + '/' + atlas)
      .then((result: any) => {
        this.typingLoader = false
        this.tableViewDisplay = []

        if (result.status) {
          this.tableData = result.data
          this.cartData = result.data
          this.itemNotFound = result.data.item.length > 0 ? false : true
          if (result.data.assorted_state) {
            this.assortedType = true
            this.assortedTableItem = result.data.assorted_data
          } else {
            this.assortedType = false

            this.tableViewDisplay = result.data.item
          }
          ///this.dataSrc = new MatTableDataSource<PeriodicElement>(result.data)
        } else {
          //this.toastr.error('Something went wrong', 'Try again')
        }
      })
      .catch((err) => {
        ////this.toastr.error('Something went wrong', 'Try again')
      })
  }

  addOrderToQuickTable() {
    let allProCount = this.tableViewDisplay.length
    let addedState = false
    let inCart = false
    let postItem = []
    this.modalTableBtn = true

    for (let h = 0; h < allProCount; h++) {
      let curQty = $('#cur-m-' + h).val()
      if (curQty != '' && curQty != undefined) {
        let data = this.tableViewDisplay[h]
        let rawUnit = document.getElementById('u-price-m-' + h)?.innerText
        let unit = rawUnit?.replace(',', '.')

        let rawPrice = document.getElementById('amt-hidd-m-' + h)?.innerHTML
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
      type: 'edit',
      product_array: JSON.stringify(postItem),
    }

    this.getData
      .httpPostRequest('/dealer/save-item-to-cart', postData)
      .then((res: any) => {
        this.modalTableBtn = false
        this.closeModalBtn.nativeElement.click()
        this.tableViewDisplay = []
        $('#closeModal').click()

        // console.log(res)

        if (res.status) {
          if (res.data.item_added > 0) {
            this.getCartByVendorId(this.vendorId)
          }

          //  this.newlyAdded = res.data.newly_added
          //  this.existingInQuickOrder = res.data.existing_already_in_quick_order
          //  this.existingInOrder = res.data.existing_already_in_order

          if (res.data.item_added > 0) {
            this.toastr.success(`item(s) has been submitted`, 'Success')
          } else {
            this.toastr.error(`item(s) already in order`, 'Item Update')
          }

          //  this.closeModalBtn.nativeElement.click()
          ///  this.fetchQuickOrderCart()
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        //  this.showAlert = false
        this.modalTableBtn = false

        // if (err.message.response.dealer || err.message.response.dealer) {
        //   this.toastr.info(`Please logout and login again`, 'Session Expired')
        // } else {
        //   this.toastr.info(`Something went wrong`, 'Error')
        // }
      })
  }

  runModalTableCalculation(index: number, qty: any, event: any) {
    if (event.key != 'Tab') {
      if (qty !== '') {
        let curr = this.tableViewDisplay[index]

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
                this.assortFilterM.push(curr)
                for (let y = 0; y < this.assortFilterM.length; y++) {
                  const t = this.assortFilterM[y]
                  if (t.id == curr.id) {
                  } else {
                    this.assortFilterM.push(curr)
                  }

                  this.newArrayFilterM = this.assortFilterM.filter(
                    (x: any, y: any) => this.assortFilterM.indexOf(x) == y,
                  )

                  let secondPhase: any = []
                  let anotherFilter: any = []
                  let letsContinue = false

                  for (let h = 0; h < this.newArrayFilterM.length; h++) {
                    const e = this.newArrayFilterM[h]
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
                        this.anotherLinePhaseM.push(e.spec_data)
                        // console.log(this.anotherLinePhaseM)
                      } else {
                        let price = parseFloat(e.booking)
                        let quantity = parseInt(e.quantity)
                        let newPrice = price * quantity
                        let formattedAmt = this.currencyPipe.transform(
                          newPrice,
                          '$',
                        )

                        $('#u-price-m-' + e.pos).html(price)
                        $('#amt-m-' + e.pos).html(formattedAmt)
                        $('#amt-hidd-m-' + e.pos).html(newPrice)
                      }
                    } else {
                    }
                  }

                  this.anotherLinePhaseFilterM = this.anotherLinePhaseM.filter(
                    (v: any, i: any, a: any) =>
                      a.findIndex((t: any) => t.atlas_id === v.atlas_id) === i,
                  )

                  let newTotalAss = 0

                  this.anotherLinePhaseFilterM.map((val: any, index: any) => {
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
                      h < this.anotherLinePhaseFilterM.length;
                      h++
                    ) {
                      const k = this.anotherLinePhaseFilterM[h]
                      if (newTotalAss >= parseInt(k[0].cond)) {
                        status = true

                        $('.normal-booking-m-' + k.pos).css('display', 'none')
                      } else {
                        for (let hj = 0; hj < k.length; hj++) {
                          const eleK = k[hj]
                          $(
                            '.special-booking-m-' +
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

                          $('#u-price-m-' + eleK.pos).html(booking)
                          $('#amt-m-' + eleK.pos).html(formattedAmt)
                          $('#amt-hidd-m-' + eleK.pos).html(newPrice)
                        }

                        let price = parseFloat(k.booking)
                        $('.normal-booking-m-' + k.pos).css(
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
                        i < this.anotherLinePhaseFilterM.length;
                        i++
                      ) {
                        const jk = this.anotherLinePhaseFilterM[i]
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

                            $('.normal-booking-m-' + activeData.pos).css(
                              'display',
                              'none',
                            )

                            $(
                              '.special-booking-m-' +
                              activeData.pos +
                              '-' +
                              activeData.arrIndex,
                            ).css('display', 'inline-block')

                            $(
                              '.special-booking-m-' +
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

                            $('#u-price-m-' + activeData.pos).html(special)
                            $('#amt-m-' + activeData.pos).html(formattedAmt)
                            $('#amt-hidd-m-' + activeData.pos).html(newPrice)
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

                              $('#u-price-m-' + pp.pos).html(special)
                              $('#amt-m-' + pp.pos).html(formattedAmt)
                              $('#amt-hidd-m-' + pp.pos).html(newPrice)
                            }

                            $(
                              '.special-booking-m-' +
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
                                '.special-booking-m-' +
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
                let specData = this.tableViewDisplay[index].spec_data
                this.ModalnormalPrice = parseFloat(
                  this.tableViewDisplay[index].booking,
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
                    $('.normal-booking-m-' + index).css('display', 'none')

                    $(
                      '.special-booking-m-' +
                      index +
                      '-' +
                      specData[i].arrIndex,
                    ).css('display', 'inline-block')

                    let g = i - 1
                    let nxt = i + 1

                    if (specData[nxt]) {
                      $('.special-booking-m-' + index + '-' + nxt).css(
                        'display',
                        'none',
                      )
                    } else {
                    }

                    $('.special-booking-m-' + index + '-' + g).css(
                      'display',
                      'none',
                    )
                  } else {
                    this.ModalnormalPrice = this.ModalnormalPrice
                    $('.special-booking-m-' + index + '-' + i).css(
                      'display',
                      'none',
                    )
                    let nxt = i + 1
                    let pre = i - 1

                    if (specData[nxt]) {
                      let cond = specData[nxt].cond
                      if (qty < cond) {
                        $('.normal-booking-m-' + index).css(
                          'display',
                          'inline-block',
                        )
                      } else {
                        $('.normal-booking-m-' + index).css('display', 'none')
                      }
                      $('.normal-booking-m-' + index).css('display', 'none')
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
                        $('.normal-booking-m-' + index).css(
                          'display',
                          'inline-block',
                        )
                      }

                      if (qty >= cond) {
                        $('.normal-booking-m-' + index).css('display', 'none')
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
                $('#u-price-m-' + index).html(this.ModalnormalPrice)
                let formattedAmt = this.currencyPipe.transform(calAmt, '$')
                arr.nativeElement.innerHTML = formattedAmt
                $('#amt-m-' + index).html(formattedAmt)
                $('#amt-hidd-m-' + index).html(calAmt)
              }
            }
          } else {
            let quantity = parseInt(qty)
            let price = parseFloat(curr.booking)

            let calAmt = quantity * price
            this.ModalcurrentProductAmt = calAmt

            ///console.log(price, 'unit Price');
            $('#u-price-m-' + index).html(price)

            $('.normal-booking-m-' + index).css('display', 'inline-block')

            let formattedAmt = this.currencyPipe.transform(calAmt, '$')
            $('#amt-m-' + index).html(formattedAmt)
            $('#amt-hidd-m-' + index).html(calAmt)
          }
        } else {
          // console.log('trying to find it')
          let quantity = parseInt(qty)
          let price = parseFloat(curr.booking)

          let calAmt = quantity * price
          this.ModalcurrentProductAmt = calAmt

          ///console.log(price, 'unit Price');
          $('#u-price-m-' + index).html(price)

          $('#amt-hidd-m-' + index).html(calAmt)

          $('.normal-booking-m-' + index).css('display', 'inline-block')

          let formattedAmt = this.currencyPipe.transform(calAmt, '$')
          $('#amt-m-' + index).html(formattedAmt)
        }
      } else {
        if (qty == '' || qty == 0) {
          for (let h = 0; h < this.assortFilterM.length; h++) {
            let ele = this.assortFilterM[h]
            let curr = this.tableViewDisplay[index]

            if (curr.atlas_id == ele.atlas_id) {
              const index = this.assortFilterM.indexOf(ele)
              if (index >= 0) {
                this.assortFilterM.splice(index, 1)
              }
            }
          }

          for (let h = 0; h < this.newArrayFilterM.length; h++) {
            let ele = this.newArrayFilterM[h]
            let curr = this.tableViewDisplay[index]

            if (curr.atlas_id == ele.atlas_id) {
              const index = this.newArrayFilterM.indexOf(ele)
              if (index >= 0) {
                this.newArrayFilterM.splice(index, 1)
              }
              this.assortFilterM = this.newArrayFilterM
            }
          }

          for (let hy = 0; hy < this.anotherLinePhaseFilterM.length; hy++) {
            let he = this.anotherLinePhaseFilterM[hy]
            let curr = this.tableViewDisplay[index]
            if (curr.atlas_id == he.atlas_id) {
              const ind = this.anotherLinePhaseFilterM.indexOf(he)
              if (ind >= 0) {
                this.anotherLinePhaseFilterM.splice(ind, 1)
              }
              this.anotherLinePhaseM = []
              this.anotherLinePhaseM = this.anotherLinePhaseFilterM
            }
          }

          let checkTotalAss = 0
          let curr = this.tableViewDisplay[index]

          this.anotherLinePhaseM.map((val: any, index: any) => {
            ///console.log(val.group);
            if (curr.grouping == val.group) {
              checkTotalAss += parseInt(val.quantity)
            }
          })

          for (let tk = 0; tk < this.anotherLinePhaseM.length; tk++) {
            let jk = this.anotherLinePhaseM[tk]
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

                    $('.normal-booking-m-' + activeData.pos).css(
                      'display',
                      'none',
                    )

                    $(
                      '.special-booking-m-' +
                      activeData.pos +
                      '-' +
                      activeData.arrIndex,
                    ).css('display', 'inline-block')

                    $(
                      '.special-booking-m-' +
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

                    $('#u-price-m-' + activeData.pos).html(special)
                    $('#amt-m-' + activeData.pos).html(formattedAmt)
                    $('#amt-hidd-m-' + activeData.pos).html(newPrice)
                  } else {
                    let pre = backWard.arrIndex - 1
                    let preData = jk[pre]
                    let activeData = backWard

                    $(
                      '.special-booking-m-' +
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

                    $('#u-price-m-' + activeData.pos).html(special)
                    $('#amt-m-' + activeData.pos).html(formattedAmt)
                    $('#amt-hidd-m-' + activeData.pos).html(newPrice)

                    if (checkTotalAss >= activeData.cond) {
                    } else {
                      if (preData != undefined) {
                        tickArrToBeRemoved.push(activeData)
                      }
                      $('.normal-booking-m-' + activeData.pos).css(
                        'display',
                        'inline-block',
                      )

                      let booking = activeData.booking
                      let newPrice = parseInt(activeData.quantity) * booking
                      let formattedAmt = this.currencyPipe.transform(
                        newPrice,
                        '$',
                      )

                      $('#u-price-m-' + activeData.pos).html(booking)
                      $('#amt-m-' + activeData.pos).html(formattedAmt)
                      $('#amt-hidd-m-' + activeData.pos).html(newPrice)
                    }

                    if (preData != undefined) {
                      tickArrToBeRemoved.push(preData)
                    }
                    for (let hi = 0; hi < tickArrToBeRemoved.length; hi++) {
                      const kk = tickArrToBeRemoved[hi]
                      $('.special-booking-m-' + kk.pos + '-' + kk.arrIndex).css(
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
                    $('.normal-booking-m-' + agaa.pos).css('display', 'none')

                    $(
                      '.special-booking-m-' + agaa.pos + '-' + agaa.arrIndex,
                    ).css('display', 'inline-block')
                    let special = agaa.special
                    let newPrice = parseInt(agaa.quantity) * special
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$',
                    )

                    $('#u-price-m-' + agaa.pos).html(special)
                    $('#amt-m-' + agaa.pos).html(formattedAmt)
                    $('#amt-hidd-m-' + agaa.pos).html(newPrice)
                  } else {
                    // $('.normal-booking-' + agaa.pos).css(
                    //   'display',
                    //   'inline-block'
                    // );

                    $(
                      '.special-booking-m-' + agaa.pos + '-' + agaa.arrIndex,
                    ).css('display', 'none')
                    let special = agaa.special
                    let newPrice = parseInt(agaa.quantity) * special
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$',
                    )

                    $('#u-price-m-' + agaa.pos).html(special)
                    $('#amt-m-' + agaa.pos).html(formattedAmt)
                    $('#amt-hidd-m-' + agaa.pos).html(newPrice)
                  }
                }
              }
            }
          }

          // console.log(this.anotherLinePhaseFilter);
        }

        /// qty = 0;
        let curr = this.tableViewDisplay[index]
        let spec = curr.spec_data

        $('.normal-booking-m-' + index).css('display', 'none')
        if (spec != null) {
          for (let h = 0; h < spec.length; h++) {
            $('.special-booking-m-' + index + '-' + h).css('display', 'none')
          }
        }

        let formattedAmt = this.currencyPipe.transform(0, '$')
        $('#amt-m-' + index).html(formattedAmt)
      }
    }
  }

  addMoreRow() {
    this.cartData.push(new AddEditProduct())
  }

  saveEditedData() {
    let allProCount = this.cartData.length
    let postItem = []
    this.saveBtnLoader = true
    this.editedInput = false

    for (let h = 0; h < allProCount; h++) {
      let curQty = $('#cur-' + h).val()
      if (curQty != '' && curQty != undefined) {
        let data = this.cartData[h]
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
      vendor: this.vendorId,
      uid: this.userData.id,
      dealer: this.userData.account_id,
      product_array: JSON.stringify(postItem),
    }

    this.getData
      .httpPostRequest('/dealer/save-edited-user-order', postData)
      .then((result: any) => {
        this.saveBtnLoader = false
        if (result.status) {
          this.tableData = result.data
          this.cartData = result.data
          this.dataSrc = new MatTableDataSource<PeriodicElement>(result.data)
          for (let d = 0; d < result.data.length; d++) {
            const element = result.data[d]

            let data = {
              atlasId: element.atlas_id,
              price: element.price,
              grouping: element.grouping,
              index: result.data.indexOf(element),
            }

            this.addedItem.push(data)
          }
          this.toastr.success('Item saved successfully', 'Success')
        } else {
          this.toastr.error('Something went wrong', 'Try again')
        }
      })
      .catch((err) => {
        this.saveBtnLoader = false

        this.toastr.error('Something went wrong', 'Try again')
      })
  }

  async deleteConfirmBox() {
    return await Swal.fire({
      title: 'You Are About To Remove This Item From Your Order',
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

  async deleteQuickOrderItem(atlsId: any, index: any, tableIndex: number) {
    let confirmStatus = await this.deleteConfirmBox()

    // console.log(tableIndex)

    if (confirmStatus) {
      let uid = this.token.getUser().id.toString()
      this.runCalculation(tableIndex)

      $('#remove-icon-' + index).css('display', 'none')
      $('#remove-loader-' + index).css('display', 'inline-block')

      let allProCount = this.cartData.length
      let postItem = []

      for (let h = 0; h < allProCount; h++) {
        let curQty = $('#cur-' + h).val()
        if (curQty != '' && curQty != undefined) {
          let data = this.cartData[h]
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

          if (atlsId != data.atlas_id) {
            postItem.push(cartData)
          }
        }
      }

      let postData = {
        vendor: this.vendorId,
        uid: this.userData.id,
        dealer: this.userData.account_id,
        atlasId: atlsId,
        product_array: JSON.stringify(postItem),
      }

      this.getData
        .httpPostRequest('/dealer/remove-dealer-order-item', postData)
        .then((result: any) => {
          $('#remove-icon-' + index).css('display', 'inline-block')
          $('#remove-loader-' + index).css('display', 'none')

          if (result.status) {
            this.tableData = result.data
            this.cartData = result.data
            this.dataSrc = new MatTableDataSource<PeriodicElement>(result.data)

            //// this.getTotal()
            /// this.runTotalCalculation(index)
            for (let d = 0; d < result.data.length; d++) {
              const element = result.data[d]

              let data = {
                atlasId: element.atlas_id,
                price: element.price,
                grouping: element.grouping,
                index: result.data.indexOf(element),
              }

              this.addedItem.push(data)
            }
          } else {
            this.toastr.error('Something went wrong', 'Try again')
          }
        })
        .catch((err) => {
          this.toastr.error('Something went wrong', 'Try again')
        })

      this.allOverTotal()
    }
  }

  runTotalCalculation(index: number) {
    let currentProduct = this.cartData[index]
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
              const item = this.addedItem[i]
              if (item.atlasId == currentProduct.atlasId) {
                item.price = newPrice
                // console.log('found de atlas id', currentProduct.atlasId)
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
        // console.log('found de atlas id', currentProduct.atlasId)
        //   } else {
        //   }
        // }
      }
    }

    this.orderTotal = 0
    for (let j = 0; j < this.addedItem.length; j++) {
      const h = this.addedItem[j]
      this.orderTotal += parseFloat(h.price)
      // console.log(this.overTotal)
    }
  }

  runAssortedCalculation(totalQty: number) {
    for (let index = 0; index < this.assortedCheckerArray.length; index++) {
      const pis = this.assortedCheckerArray[index]
      for (let jIndex = 0; jIndex < pis.length; jIndex++) {
        const parker = pis[jIndex]
        let qty = pis.qty
        let booking = parker.booking
        let price = parseInt(qty) * parseFloat(booking)
        this.cartData[pis.assIndex].price = price
        this.cartData[pis.assIndex].qty = qty

        if (totalQty >= parseInt(parker.cond)) {
          let qty = pis.qty
          let special = parker.special
          let price = parseInt(qty) * parseFloat(special)
          this.cartData[pis.assIndex].price = price
          this.cartData[pis.assIndex].qty = qty
        } else {
        }
      }
    }

    this.assortedCheckerArray = []
  }

  calculationChecker(index: number, qty: any) {
    this.editedInput = true
    let curr = this.cartData[index]
    this.cartData[index].qty = qty
    let spec = curr.spec_data
    let curAtlasId = curr.atlas_id
    let grouping = curr.grouping
    if (qty != '') {
      if (spec != null && spec.length > 0) {
        let itemType = spec[0].type
        if (itemType == 'assorted') {
          let totalQty = 0
          for (let index = 0; index < this.cartData.length; index++) {
            const ele = this.cartData[index]
            if (grouping == ele.grouping) {
              totalQty += parseInt(ele.qty)
              ele.spec_data.position = ele.position
              ele.spec_data.qty = ele.qty
              ele.spec_data.price = ele.price
              ele.spec_data.assIndex = index
              this.assortedCheckerArray.push(ele.spec_data)
            }
          }

          this.runAssortedCalculation(totalQty)
        }

        if (itemType == 'special') {
          // console.log('we are on special')
        }
      } else {
        let currItem = this.cartData[index]
        let bookingPrice = parseFloat(currItem.booking)
        let price = parseInt(qty) * bookingPrice
        currItem.price = price
      }
    } else {
      if (spec != null && spec.length > 0) {
        let itemType = spec[0].type
        if (itemType == 'assorted') {
          let totalQty = 0
          for (let index = 0; index < this.cartData.length; index++) {
            const ele = this.cartData[index]
            if (grouping == ele.grouping) {
              totalQty += ele.qty != '' ? parseInt(ele.qty) : 0
              ele.spec_data.position = ele.position
              ele.spec_data.qty = ele.qty
              ele.spec_data.price = ele.qty != '' ? ele.price : 0
              ele.spec_data.assIndex = index
              // console.log(ele.spec_data, 'our own hellow worls')
              this.assortedCheckerArray.push(ele.spec_data)
            }
          }

          // this.runAssortedCalculation(totalQty)
        }
      } else {
        let currItem = this.cartData[index]
        let bookingPrice = parseFloat(currItem.booking)
        let price = 0 * bookingPrice
        currItem.price = price
      }
    }

    //// this.allOverTotal()
  }

  runCalculation(index: number, qty: string = '0') {
    let curr = this.dataSrc.data[index]

    this.productTableService
      .initCalculationData(
        this.tableData,
        this.assortFilter,
        this.addedItem,
        this.assortedIds,
        this.orderTotal
      )
      .then((status) => {
        if (status) {
          this.orderTotal = 0;
          this.productTableService
            .runSingleCalculations(curr, index, parseInt(qty.length ? qty : '0'))
            .then((data) => {
              console.log(data)
              if (data.status) {
                this.tableData = data.products;
                this.dataSrc.data = data.products;
                this.orderTotal += data.productTotal;
                this.assortFilter = data.assorted;
                this.assortedIds = data.allAddedItemsID
              }
            })
        }
      })
  }

  runCalculation2(index: number, qty: any) {
    this.editedInput = true
    if (qty !== '') {
      let curr = this.cartData[index]
      let spec = curr.spec_data
      let curAtlasId = curr.atlas_id

      if (spec != null) {
        if (spec.length > 0) {
          for (let j = 0; j < spec.length; j++) {
            const f = spec[j]
            if (f.type == 'assorted') {
              let incomingQty = qty
              curr.quantity = qty
              curr.pos = index

              this.assortFilter.push(curr)
              for (let h = 0; h < this.cartData.length; h++) {
                let checkQty = $('#cur-' + h).val()
                if (checkQty != '') {
                  let r = this.cartData[h]
                  r.pos = h
                  r.qty = checkQty
                  this.assortFilter.push(r)
                }
              }

              for (let y = 0; y < this.assortFilter.length; y++) {
                const t = this.assortFilter[y]
                if (t.id == curr.id) {
                  //console.log('correct');
                } else {
                  this.assortFilter.push(curr)
                }

                var newarr = this.assortFilter.filter(
                  (x: any, y: any) => this.assortFilter.indexOf(x) == y,
                )

                let secondPhase = []
                let secPhase = []
                let letsContinue = false
                let testData = []

                for (let h = 0; h < newarr.length; h++) {
                  const e = newarr[h]
                  if (e.grouping == curr.grouping) {
                    // console.log(e);
                    secondPhase.push(e.spec_data)
                    if (e.spec_data.length > 0) {
                      letsContinue = true

                      e.spec_data.pos = e.pos
                      e.spec_data.quantity =
                        curAtlasId == e.atlas_id ? qty : e.qty
                      e.spec_data.atlas_id = e.atlas_id
                      e.spec_data.group = e.grouping
                      e.spec_data.incomingQty = incomingQty

                      for (let t = 0; t < e.spec_data.length; t++) {
                        let ele = e.spec_data[t]
                        ele.quantity = e.qty
                        ele.pos = e.pos
                        ele.atlas_id = e.atlas_id
                        ele.arrIndex = t
                      }
                    } else {
                      let price = parseFloat(e.booking)
                      let quantity = parseInt(e.quantity)
                      let newPrice = price * quantity
                      let formattedAmt = this.currencyPipe.transform(
                        newPrice,
                        '$',
                      )

                      /********** OUTLET ************/
                      $('#unit-price-hidden-' + e.pos).html(price)
                      $('#price-hidden-' + e.pos).html(newPrice)
                      let curPrice = this.currencyPipe.transform(price, '$')

                      //  this.updateCartItem(qty, newPrice, price, index);

                      $('#u-price-' + e.pos).html(curPrice)
                      $('#amt-' + e.pos).html(formattedAmt)
                      $('#amt-hidd-' + e.pos).html(newPrice)
                    }
                  }
                }

                //// console.log(secondPhase, 'first filter')

                if (letsContinue) {
                  let newTotalAss = 0
                  let status = false
                  for (let h = 0; h < secondPhase.length; h++) {
                    const k = secondPhase[h]
                    newTotalAss += parseInt(k.quantity)
                    //// console.log(k[h], 'inner test')

                    if (k[h] != undefined) {
                      if (newTotalAss >= parseInt(k[h].cond)) {
                        status = true
                        ////console.log(k, newTotalAss);
                      } else {
                        for (let hy = 0; hy < secondPhase.length; hy++) {
                          const elj = secondPhase[hy]
                          //// console.log(elj.atlas_id, elj.quantity)

                          let booking = parseFloat(elj[0].booking)
                          let newPrice = parseInt(elj.quantity) * booking
                          let formattedAmt = this.currencyPipe.transform(
                            newPrice,
                            '$',
                          )

                          $('#unit-price-hidden-' + elj.pos).html(booking)
                          $('#price-hidden-' + elj.pos).html(newPrice)
                          $('#u-price-' + elj.pos).html(booking)
                          $('#amt-' + elj.pos).html(formattedAmt)
                          $('#amt-hidd-' + elj.pos).html(newPrice)
                        }

                        // console.log(newTotalAss, 'tesy');

                        for (let h = 0; h < k.length; h++) {
                          const el = k[h]
                          let prev = h - 1
                          let next = h + 1
                          let totalLength = k.length
                          /// console.log(totalLength, 'length test')
                          ///if(k[1])

                          // console.log(k[1], 'k one')

                          ///let checkNex

                          // if (k[1] !== undefined) {
                          let checkNext =
                            k[1] !== undefined ? k[1].cond : k[0].cond
                          // } else {
                          //   console.log(k[0], 'k one')

                          //   let checkNext = k[0].cond
                          // }

                          if (
                            newTotalAss >= el.cond &&
                            newTotalAss < checkNext
                          ) {
                            for (let ji = 0; ji < secondPhase.length; ji++) {
                              const elt = secondPhase[ji]

                              let special = parseFloat(elt[0].special)
                              let newPrice = parseInt(elt.quantity) * special
                              let formattedAmt = this.currencyPipe.transform(
                                newPrice,
                                '$',
                              )

                              ////  console.log('100 up we are here')
                              $('#unit-price-hidden-' + elt.pos).html(special)
                              $('#price-hidden-' + elt.pos).html(newPrice)
                              $('#u-price-' + elt.pos).html(special)
                              $('#amt-' + elt.pos).html(formattedAmt)
                              $('#amt-hidd-' + elt.pos).html(newPrice)
                            }
                          } else {
                          }
                        }
                      }
                    }
                  }

                  ////  console.log(newTotalAss)

                  if (status) {
                    //// If total Assorted is greater than condition /////
                    for (let i = 0; i < secondPhase.length; i++) {
                      const jk = secondPhase[i]
                      let currArrLength = jk.length
                      for (let j = 0; j < jk.length; j++) {
                        --currArrLength
                        const backWard = jk[currArrLength]
                        const frontWard = jk[j]
                        if (
                          newTotalAss < backWard.cond &&
                          newTotalAss >= frontWard.cond
                        ) {
                          /// console.log(jk[j], 'we are here')
                          let special = parseFloat(jk[j].special)
                          let newPrice = parseInt(jk.quantity) * special
                          let formattedAmt = this.currencyPipe.transform(
                            newPrice,
                            '$',
                          )
                          //console.log(jk, 'test here')

                          $('#unit-price-hidden-' + jk[j].pos).html(special)
                          $('#price-hidden-' + jk[j].pos).html(newPrice)

                          $('#u-price-' + jk[j].pos).html(special)
                          $('#amt-' + jk[j].pos).html(formattedAmt)
                          $('#amt-hidd-' + jk[j].pos).html(newPrice)
                        } else {
                          if (newTotalAss < jk[j].cond) {
                          } else {
                            /// console.log(jk[j], '300 up we are here')

                            let special = parseFloat(jk[j].special)
                            let newPrice = parseInt(jk.quantity) * special
                            let formattedAmt = this.currencyPipe.transform(
                              newPrice,
                              '$',
                            )
                            ////console.log(jk, 'test here')

                            $('#unit-price-hidden-' + jk[j].pos).html(special)
                            $('#price-hidden-' + jk[j].pos).html(newPrice)

                            $('#u-price-' + jk[j].pos).html(special)
                            $('#amt-' + jk[j].pos).html(formattedAmt)
                            $('#amt-hidd-' + jk[j].pos).html(newPrice)
                          }
                        }
                      }
                    }
                  } else {
                    /// console.log(secondPhase);
                    /// if total Assorted is not greater than condition /////
                  }
                }
              }
            } else {
              let arr = this.extendField.toArray()[index]
              let specialAmt = 0
              let specialCond = 0
              let specData = this.cartData[index].spec_data
              this.normalPrice = parseFloat(this.cartData[index].booking)
              for (let i = 0; i < specData.length; i++) {
                let curAmt = parseFloat(specData[i].special)
                let cond = parseInt(specData[i].cond)
                let orignialAmt = parseFloat(specData[i].booking)

                if (qty >= cond) {
                  this.normalPrice = curAmt
                } else {
                  this.normalPrice = this.normalPrice
                }
              }

              let curPrice = this.currencyPipe.transform(this.normalPrice, '$')
              $('#u-price-' + index).html(curPrice)

              let calAmt = qty * this.normalPrice
              this.currentProductAmt = calAmt

              this.cartData[index].price = calAmt
              this.cartData[index].quantity = qty
              this.cartData[index].uPrice = this.normalPrice

              let formattedAmt = this.currencyPipe.transform(calAmt, '$')
              //arr.nativeElement.innerHTML = formattedAmt;

              /********** OUTLET ************/
              $('#unit-price-hidden-' + index).html(this.normalPrice)
              $('#price-hidden-' + index).html(calAmt)

              ///  this.updateCartItem(qty, calAmt, this.normalPrice, index);

              $('#amt-' + index).html(formattedAmt)
              $('#amt-hidd-' + index).html(calAmt)
              this.newTotalArray.push(calAmt)
              // this.runTotalCal();
            }
          }
        } else {
          let quantity = parseInt(qty)
          let price = parseFloat(curr.booking)

          let calAmt = quantity * price
          this.currentProductAmt = calAmt

          this.cartData[index].price = calAmt
          this.cartData[index].quantity = qty
          this.cartData[index].uPrice = price

          let curPrice = this.currencyPipe.transform(price, '$')
          $('#u-price-' + index).html(curPrice)

          let formattedAmt = this.currencyPipe.transform(calAmt, '$')
          //arr.nativeElement.innerHTML = formattedAmt;
          /********** OUTLET ************/

          /// this.updateCartItem(qty, calAmt, price, index);

          $('#unit-price-hidden-' + index).html(price)
          $('#price-hidden-' + index).html(calAmt)

          $('#amt-' + index).html(formattedAmt)
          $('#amt-hidd-' + index).html(calAmt)
          this.newTotalArray.push(calAmt)
          // this.runTotalCal();
        }
      } else {
        let quantity = parseInt(qty)
        let price = parseFloat(curr.booking)

        let calAmt = quantity * price
        this.currentProductAmt = calAmt

        this.cartData[index].price = calAmt
        this.cartData[index].quantity = qty
        this.cartData[index].uPrice = price

        let curPrice = this.currencyPipe.transform(price, '$')
        $('#u-price-' + index).html(curPrice)

        let formattedAmt = this.currencyPipe.transform(calAmt, '$')
        //arr.nativeElement.innerHTML = formattedAmt;
        /********** OUTLET ************/

        /// this.updateCartItem(qty, calAmt, price, index);

        $('#unit-price-hidden-' + index).html(price)
        $('#price-hidden-' + index).html(calAmt)

        $('#amt-' + index).html(formattedAmt)
        $('#amt-hidd-' + index).html(calAmt)
        this.newTotalArray.push(calAmt)
        // this.runTotalCal();
      }
    } else {
      //// this.noQtyAssortFilter = this.
      if (qty == '' || qty == 0) {
        ///  this.assortFilter = this.cartData
        let currentData = this.cartData[index]
        let incomingQty = qty
        currentData.quantity = qty
        currentData.pos = index

        for (let g = 0; g < this.cartData.length; g++) {
          const eachData = this.cartData[g]
          qty = $('#cur-' + g).val()
          if (qty != '') {
            eachData.quantity = eachData.qty
            eachData.pos = this.cartData.indexOf(eachData)
            this.assortFilter.push(eachData)
          }
        }

        ///console.log(this.assortFilter, 'first filter')

        // for (let h = 0; h < this.cartData.length; h++) {
        //   let r = this.cartData[h]
        //   r.pos = h
        //   this.assortFilter.push(r)
        // }

        for (let h = 0; h < this.assortFilter.length; h++) {
          let ele = this.assortFilter[h]
          let curr = this.cartData[index]

          if (curr.atlas_id == ele.atlas_id) {
            const index = this.assortFilter.indexOf(ele)
            if (index >= 0) {
              this.assortFilter.splice(index, 1)
            }
          }
        }

        //  console.log(this.assortFilter, 'second filter')

        for (let h = 0; h < this.newArrayFilter.length; h++) {
          let ele = this.newArrayFilter[h]
          let curr = this.cartData[index]

          if (curr.atlas_id == ele.atlas_id) {
            const index = this.newArrayFilter.indexOf(ele)
            if (index >= 0) {
              this.newArrayFilter.splice(index, 1)
            }
            this.assortFilter = this.newArrayFilter
          }
        }

        let secondPhase: any = []
        let anotherFilter: any = []
        let letsContinue = false

        for (let h = 0; h < this.assortFilter.length; h++) {
          const e = this.assortFilter[h]
          if (e.grouping == currentData.grouping) {
            if (e.spec_data != null) {
              if (e.spec_data.length > 0) {
                letsContinue = true

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
                // let price = parseFloat(e.booking)
                // let quantity = parseInt(e.quantity)
                // let newPrice = price * quantity
                // let formattedAmt = this.currencyPipe.transform(newPrice, '$')
                // $('#u-price-' + e.pos).html(price)
                // $('#amt-' + e.pos).html(formattedAmt)
                // $('#amt-hidd-' + e.pos).html(newPrice)
              }
            } else {
              let price = parseFloat(e.booking)
              let quantity = parseInt(e.quantity)
              let newPrice = price * quantity
              let formattedAmt = this.currencyPipe.transform(newPrice, '$')

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

        // console.log(this.anotherLinePhaseFilter, 'phase tester')

        // console.log(this.assortFilter)

        for (let hy = 0; hy < this.anotherLinePhaseFilter.length; hy++) {
          let he = this.anotherLinePhaseFilter[hy]
          let curr = this.cartData[index]
          if (curr.atlas_id == he.atlas_id) {
            const ind = this.anotherLinePhaseFilter.indexOf(he)
            if (ind >= 0) {
              this.anotherLinePhaseFilter.splice(ind, 1)
            }
            this.anotherLinePhase = []
            this.anotherLinePhase = this.anotherLinePhaseFilter
          }
        }

        ///console.log(this.anotherLinePhase, 'phase tester')

        // for (let hy = 0; hy < this.assortFilter.length; hy++) {
        //   let he = this.assortFilter[hy]
        //   let curr = this.cartData[index]
        //   if (curr.atlas_id == he.atlas_id) {
        //     const ind = this.assortFilter.indexOf(he)
        //     if (ind >= 0) {
        //       this.assortFilter.splice(ind, 1)
        //     }
        //     this.anotherLinePhase = []
        //     this.anotherLinePhase = this.assortFilter
        //   }
        // }

        /// console.log(this.anotherLinePhase)

        let checkTotalAss = 0
        let curr = this.cartData[index]

        this.anotherLinePhase.map((val: any, index: any) => {
          if (curr.grouping == val.group) {
            checkTotalAss += parseInt(val.quantity)
          }
        })

        ///////// Lod Loop //////

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

                  // console.log(activeData, 'we testing it here, innsed')

                  /// $('.normal-booking-' + activeData.pos).css('display', 'none')

                  // $(
                  //   '.special-booking-' +
                  //     activeData.pos +
                  //     '-' +
                  //     activeData.arrIndex,
                  // ).css('display', 'inline-block')

                  // $(
                  //   '.special-booking-' + preData.pos + '-' + preData.arrIndex,
                  // ).css('display', 'none')

                  let special = activeData.special
                  let newPrice = parseInt(activeData.quantity) * special
                  let formattedAmt = this.currencyPipe.transform(newPrice, '$')

                  $('#u-price-' + activeData.pos).html(special)
                  $('#amt-' + activeData.pos).html(formattedAmt)
                  $('#amt-hidd-' + activeData.pos).html(newPrice)
                } else {
                  let pre = backWard.arrIndex - 1
                  let preData = jk[pre]
                  let activeData = backWard

                  // console.log(activeData, 'we testing it here, innsed')

                  // $(
                  //   '.special-booking-' +
                  //     activeData.pos +
                  //     '-' +
                  //     activeData.arrIndex,
                  // ).css('display', 'inline-block')

                  let special = activeData.special
                  let newPrice = parseInt(activeData.quantity) * special
                  let formattedAmt = this.currencyPipe.transform(newPrice, '$')

                  $('#u-price-' + activeData.pos).html(special)
                  $('#amt-' + activeData.pos).html(formattedAmt)
                  $('#amt-hidd-' + activeData.pos).html(newPrice)

                  // console.log(activeData, 'we testing it here, innsed')

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

                  // if (checkTotalAss >= activeData.cond) {
                  // } else {
                  //   if (preData != undefined) {
                  //     tickArrToBeRemoved.push(activeData)
                  //   }
                  //   $('.normal-booking-' + activeData.pos).css(
                  //     'display',
                  //     'inline-block',
                  //   )

                  //   let booking = activeData.booking
                  //   let newPrice = parseInt(activeData.quantity) * booking
                  //   let formattedAmt = this.currencyPipe.transform(
                  //     newPrice,
                  //     '$',
                  //   )

                  //   $('#u-price-' + activeData.pos).html(booking)
                  //   $('#amt-' + activeData.pos).html(formattedAmt)
                  //   $('#amt-hidd-' + activeData.pos).html(newPrice)
                  // }

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
                  ///$('.normal-booking-' + agaa.pos).css('display', 'none')

                  // $('.special-booking-' + agaa.pos + '-' + agaa.arrIndex).css(
                  //   'display',
                  //   'inline-block',
                  // )
                  let special = agaa.special
                  let newPrice = parseInt(agaa.quantity) * special
                  let formattedAmt = this.currencyPipe.transform(newPrice, '$')

                  $('#u-price-' + agaa.pos).html(special)
                  $('#amt-' + agaa.pos).html(formattedAmt)
                  $('#amt-hidd-' + agaa.pos).html(newPrice)
                } else {
                  // $('.special-booking-' + agaa.pos + '-' + agaa.arrIndex).css(
                  //   'display',
                  //   'none',
                  // )
                  let special = agaa.special
                  let newPrice = parseInt(agaa.quantity) * special
                  let formattedAmt = this.currencyPipe.transform(newPrice, '$')

                  $('#u-price-' + agaa.pos).html(special)
                  $('#amt-' + agaa.pos).html(formattedAmt)
                  $('#amt-hidd-' + agaa.pos).html(newPrice)
                }
              }
            }
          }
        }

        //// End of old loop //////
      }

      /// qty = 0;
      let curr = this.cartData[index]
      let spec = curr.spec_data

      //$('.normal-booking-' + index).css('display', 'none')
      if (spec != null) {
        for (let h = 0; h < spec.length; h++) {
          /// $('.special-booking-' + index + '-' + h).css('display', 'none')
        }
      }

      let formattedAmt = this.currencyPipe.transform(0, '$')
      $('#amt-' + index).html(formattedAmt)
      $('#amt-hidd-' + index).html(0)
    }

    this.allOverTotal()
    //// this.runTotalCalculation(index)
  }

  getTotal() {
    let total = 0
    if (this.tableData.length > 0) {
      for (var i = 0; i < this.tableData.length; i++) {
        let Obj: any = this.tableData[i]!
        total = total + parseFloat(Obj.price!)
      }
      return (this.orderTotal = total)
    } else {
      return (this.orderTotal = 0)
    }
  }

  goBackToEditPage() {
    this.router.navigate(['/dealers/edit-order'])
  }

  getCartByVendorId(vendorId: any) {
    this.canOrder = false
    this.isMod = false
    let dealer = this.token.getUser().account_id
    this.loader = true

    this.getData
      .httpGetRequest(
        '/dealer/get-dealer-vendor-orders/' + dealer + '/' + vendorId,
      )
      .then((result: any) => {
        this.loader = false
        if (result.status) {
          let inComingData = result.data.map((item: any, index: number) => ({ ...item, position: index }))

          this.incomingData = inComingData
          this.tableData = inComingData
          this.cartData = inComingData
          this.dataSrc = new MatTableDataSource<PeriodicElement>(inComingData)
          this.canOrder = (inComingData.length !== 0)
          this.orderTable = []

          // first step init all calculation data required so as to be passed to the service and default
          // then call the ru singular calculation whihc will perform all required operations both assorted and specials
          // and return the updated calculation data back to this component as an object of
          // return {
          //   status: codeStatus,
          //   products: this.productData,
          //   assorted: this.assortFilter,
          //   addedItems: this.addedItem,
          //   allAddedItemsID: this.allAddedItemAtlasID,
          //   currentProductAmount: this.currentProductAmt,
          //   productTotal: this.overTotal
          // }

          // use status to detect if the code ran into an error during implementation each service function is rapped in a try catch method so status
          // is the only defined variable to track error and your console log

          // PEACE BE UNTO YOU
          this.productTableService
            .initCalculationData(
              this.tableData,
              this.assortFilter,
              this.addedItem,
              this.assortedIds,
              this.orderTotal,
            )
            .then((status) => {
              if (status) {
                this.productTableService
                  .runGeneralCalculations(this.dataSrc.data)
                  .then((data) => {
                    // console.log(data)
                    if (data.status) {
                      this.tableData = data.products;
                      this.dataSrc.data = data.products;
                      this.orderTotal = data.productTotal;
                      this.assortFilter = data.assorted;
                      this.assortedIds = data.allAddedItemsID
                    }
                  })
              }
            })

          this.addedItem = result.data.map((element: any) => ({
            atlasId: element.atlas_id,
            price: element.price,
            grouping: element.grouping,
            index: result.data.indexOf(element),
          }));

          // this.dataSrc.sort = this.sort
          /// this.dataSrc.paginator = this.paginator
        } else {
          this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error')
      })
  }

  async confirmBox() {
    // console.log('heheh')
    if (this.editedInput == true) {
      return await Swal.fire({
        title: 'You are about to leave this page',
        text: 'Any items not added to your cart will be lost',
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
    } else {
      return true
    }
  }
}
