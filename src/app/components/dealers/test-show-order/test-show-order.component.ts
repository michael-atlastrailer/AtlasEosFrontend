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
import {
  NavigationStart,
  NavigationEnd,
  NavigationError,
  RouterEvent,
  Event,
} from '@angular/router'
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
import { OrderCheckService } from 'src/app/core/services/order-check.service'
import { ComponentCanDeactivate } from 'src/app/core/model/can-deactivate'
import { ChatService } from 'src/app/core/services/chat.service'

export interface PeriodicElement {
  position: number
  atlas_id: any
  vendor: string
  description: string
  booking: number
  special: number
  extended: number
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    position: 0,
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
export class TestShowOrderComponent implements ComponentCanDeactivate {
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
  @ViewChild(MatPaginator) paginator!: MatPaginator
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
  vendorBuckData: any
  vendorBuckImage: any

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
  incomingData: any

  //// End of old  code ///////
  alreadyOrder = false
  routChange = false
  viewFlyer = false
  viewPromoFlyer = false
  viewBuckFlyer = false
  // @ViewChild(MatSort)
  // sort!: MatSort
  sortDir = false;
  sortedData!: PeriodicElement[];
  highlightIndex = null;
  setVendor = false;
  currentData: any;
  constructor(
    private getData: HttpRequestsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    private token: TokenStorageService,
    private currencyPipe: CurrencyPipe,
    private chatServer: ChatService,
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
        this.setVendor = true
        this.selectVendor = this.vendorId
      }
    })

    this.getCart()
    this.userData = this.token.getUser()
    // this.userId = userData.id
    if (this.userData) {
      this.chatServer.openChatConnection(
        this.userData.id + this.userData.first_name,
      )
    }
  }

  ngOnInit(): void {}
  ngAfterViewInit() {}

  announceSortChange(sortState: Sort) {
    console.log(sortState, 'testing')
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`)
    } else {
      this._liveAnnouncer.announce('Sorting cleared')
    }
  }

  sortData(sort: Sort) {
    const data = this.productData.slice()
    if (!sort.active || sort.direction === '') {
      this.dataSrc = data
      return
    }

    this.dataSrc = data.sort((a: any, b: any) => {

      const isAsc = sort.direction === 'asc'

      switch (sort.active) {
        case 'atlas_id':
          return compare(a.atlas_id, b.atlas_id, isAsc)
        case 'vendor':
          return compare(a.vendor_product_code, b.vendor_product_code, isAsc)

        case 'vendor':
          return compare(a.vendor_product_code, b.vendor_product_code, isAsc)

        default:
          return 0
      }
    })
  }
  sortDataAlt() {
    const data = this.dataSrc.data.slice();

    this.sortDir = !this.sortDir;

    this.dataSrc.data = data.sort((a: any, b: any) => {
      let item = 'vendor_product_code';
      switch (item) {
        case 'index':
          return compare(a.index, b.index, this.sortDir);
        case 'vendor_product_code':
          return compare(a.vendor_product_code, b.vendor_product_code, this.sortDir);

        default:
          return 0;
      }
    });
  }
  ///////// Old code ///////////

  emptyTableQty() {
    let allProCount = this.productData.length
    for (let h = 0; h < allProCount; h++) {
      $('#cur-' + h).val('')
    }
    this.overTotal = 0
  }
  viewProduct(data: any) {
    console.log(data)
    this.currentData = data

    // this.viewSet = true;
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

  applyFilter(event: any) {
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
    if (this.vendorCode == '') {
      this.toastr.warning(`Select a vendor to search`, 'Info')
    } else {
      this.alreadyOrder = false
      this.loader = true
      this.tableView = false
      this.canOrder = false
      this.isMod = false
      this.getVendorBuck(this.vendorCode)
      /// let id = this.vendor.nativeElement.value
      this.showSubmittedDetails = false

      this.getData
        .httpGetRequest('/dealer/get-vendor-products/' + this.vendorCode)
        .then((result: any) => {
          console.log(result, 'promotion')
          this.loader = false
          this.tableView = true

          if (result.status) {
            let productRes = result.data
            this.incomingData = result.data

            for (let h = 0; h < result.data.length; h++) {
              const each = result.data[h]
              each.price = '$0.00'
              each.position = h
              each.forCal = 0
              each.unitPrice = 0
              each.qty = ''
            }

            this.productData = productRes

            this.tableData = productRes
            if (result.data.length !== 0) {
              this.canOrder = true
            }

            this.orderTable = []
            this.getTotal()
            this.dataSrc = new MatTableDataSource<PeriodicElement>(result.data)
            this.dataSrc.paginator = this.paginator
            // this.dataSrc.sort = this.sort;
          } else {
            this.toastr.info(`Something went wrong`, 'Error')
          }
        })
        .catch((err) => {
          this.toastr.info(`Something went wrong`, 'Error')
        })
    }
  }
  getVendorBuck(id: any) {
    this.viewFlyer = false
    this.viewBuckFlyer = false
    this.viewPromoFlyer = false
    this.getData
      .httpGetRequest('/fetch_show_buck_promotional_flier/' + id)
      .then((result: any) => {
        console.log(result, 'promotion')

        if (result.status) {
          this.vendorBuckData = result.data
          this.viewFlyer = true

          if (this.setVendor) {
            this.dummyInput.nativeElement.value = result.data.vendor_name
          }
          if (result.data.promotional_fliers[0]?.pdf_url!) {
            this.viewPromoFlyer = true
          }
          if (result.data.bucks[0]?.pdf_url!) {
            this.viewBuckFlyer = true
          }
          this.setVendor = false
          console.log(
            'vendor buck',
            result.data.promotional_fliers[0]?.pdf_url!,
            result.data.bucks[0]?.pdf_url!,
            this.viewPromoFlyer,
            this.viewBuckFlyer,
            this.viewFlyer,
          )
        } else {
          this.viewFlyer = false
          this.viewBuckFlyer = false
          this.viewPromoFlyer = false
          // this.toastr.info(`Something went wrong fetching buck data`, 'Error');
        }
      })
      .catch((err) => {
        this.viewFlyer = false
        console.log('entered catch buck', err)
        this.toastr.info(`Something went wrong fetching buck data`, 'Error')
      })
  }

  oneAddBtn() {
    let allProCount = this.productData.length
    let addedState = false
    let inCart = false
    let postItem = []
    this.cartLoader = true

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
      .httpPostRequest('/dealer/save-item-to-cart', postData)
      .then((res: any) => {
        console.log(res)
        if (res.status) {
          this.showSubmittedDetails = true;
          this.alreadyOrder = true;
          console.log('already order eri', this.alreadyOrder);
          this.cartLoader = false;
          this.itemAlreadySubmitted = res.data.item_details;
          this.itemNewlySubmitted = res.data.item_added;
          this.emptyTableQty();
          if (res.data.item_added > 0) {
            this.toastr.success(`item(s) has been submitted`, 'Success');
          }

          /// this.orderTable = []
          /// this.getTotal()
          /// this.getCart()
          // if (this.searchatlasId) {
          //   this.searchVendorId(this.vendorId!)
          // } else {
          //   this.getProductByVendorId()
          // }

          if (res.data.submitted_status) {
            if (res.data.chat_data.length > 0) {
              this.chatServer.sendOrderNotification(res.data.chat_data)
            }
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

  runnnerTotal() {
    this.overTotal = 0
    for (let index = 0; index < this.productData.length; index++) {
      const element = this.productData[index]
      this.overTotal += parseFloat(element.forCal)
    }
  }

  runTotalCalculation(index: number) {
    let currentProduct = this.productData[index]

    for (let index = 0; index < this.productData.length; index++) {
      const element = this.productData[index]
      this.overTotal += parseFloat(element.forCal)
    }

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
            if (t.grouping != null && currentProduct.grouping != null) {
              t.forCal = currentProduct.forCal
            }
          } else {
            for (let i = 0; i < this.addedItem.length; i++) {
              const item = this.addedItem[i]
              if (item.atlasId == currentProduct.atlas_id) {
                // item.price = newPrice
                item.forCal = currentProduct.forCal

                console.log('found de atlas id', currentProduct.atlasId)
              } else {
              }
            }
          }
          //groupings
        }
        console.log(data, 'entery level')
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
      this.overTotal += parseFloat(h.forCal)
    }

    console.log(this.addedItem)
  }

  /**
   * Updates the Product with the specified index.
   *
   * @param {number} index The index number position of the product.
   * @param {number} amount The amount calculated as quantity * price.
   * @param {number} price The selected price for product calculation (normal, special, assorted).
   * @param {string|null} spec The is the index point to specify what offer was uses from the spec_data eg: (`0` meaning normal price used) or (`0-1` meaning the 2nd price was used from the spec_data) .
   * @return {any} returns the new value after being assigned.
   */
  assignSalesValue = (
    index: number,
    quantity: number | string,
    amount: number,
    price: number,
    spec: string | null,
  ) => {
    // update each unique element
    this.productData[index].qty = quantity != 0 ? quantity : ''
    this.productData[index].selected_spec = spec
    this.productData[index].forCal = amount
    this.productData[index].calPrice = amount
    this.productData[index].unitPrice = price
    this.productData[index].price = this.currencyPipe.transform(amount, '$')

    this.currentProductAmt = amount

    console.log(this.productData[index])
    return this.productData[index]
  }

  /**
   * Updates the Product with the specified index.
   *
   * @param {any} current The current product.
   * @return {void}.
   */
  updateOtherAssorted = (current: any) => {
    let totalQuantity = this.getTotalAssortedQuantity(current)
    this.assortFilter = this.assortFilter.map((ass: any) => {
      console.log(ass, 'checking asses')
      // if (ass.qty != '' || ass.qty > 0) {
      let update_ass = ass
      let price = parseFloat(ass.booking)
      let calAmt = parseInt(ass.qty) * price
      let selected_spec = `${ass.position}`

      ass.spec_data.map((sp: any, af_index: number) => {
        let curAmt = parseFloat(sp.special)
        if (totalQuantity >= parseInt(sp.cond)) {
          price = curAmt
          calAmt = parseInt(ass.qty) * price
          selected_spec = `${ass.position}-${af_index}`
        }
      })

      let curQty = ass.qty == 0 ? '' : ass.qty

      if (curQty != '') {
        update_ass = this.assignSalesValue(
          ass.position,
          curQty,
          calAmt,
          price,
          selected_spec,
        )
      }

      // update record in assortFilter
      // }
      return update_ass
    })
  }

  /**
   * Updates the Product with the specified index.
   *
   * @param {any} current The current product.
   * @return {number} returns total assorted quantity.
   */
  getTotalAssortedQuantity = (current: any) => {
    let totalQuantity = this.assortFilter.reduce(
      (accumulate: number, af: any) => {
        // const newQuantity = (current.grouping === af.grouping) ? parseInt(af.qty) : 0;
        const newQuantity = current.grouping ? parseInt(af.qty) : 0

        return accumulate + newQuantity
      },
      0,
    )

    return totalQuantity
  }

  /**
   * Updates the Product with the specified index.
   *
   * @param {any} prc The current product.
   * @return {boolean} returns true/false if section price has been selected.
   */
  checkSpecials(prc: any, curIndex?: number) {
    // console.log(prc);
    let check = false
    if (prc?.selected_spec) {
      // console.log(prc?.selected_spec);
      if (Number.isInteger(curIndex)) {
        check = `${prc.position}-${curIndex}` === prc?.selected_spec
      } else {
        check = `${prc.position}` === prc?.selected_spec
      }
    }

    return check
  }

  runCalculation(index: number, quantity: string, event: any, atlas: any) {
    if (event.key != 'Tab') {
      const qty = quantity.length ? parseInt(quantity) : 0
      let curr = this.productData[index]
      let atlasId = curr.atlas_id
      let spec = curr.spec_data
      curr.qty = qty ?? ''

      if (qty) {
        // calculate default prices
        let price = parseFloat(curr.booking)
        let calAmt = qty * price
        let selected_spec = `${index}`

        if (!this.allAddedItemAtlasID.includes(atlasId))
          this.allAddedItemAtlasID.push(atlasId)

        // console.log(curr);
        if (spec && spec.length) {
          // search through offers
          spec.map((sp: any, af_index: number) => {
            let curAmt = parseFloat(sp.special)
            let cond = parseInt(sp.cond)

            if (sp.type === 'assorted') {
              // add curr product as assorted if has assorted specials
              const assortIds = this.assortFilter.map(
                (ass: any) => ass.atlas_id,
              )
              if (!assortIds.includes(curr.atlas_id))
                this.assortFilter.push(curr)
              // get total quantity of assorted

              let totalQuantity = this.getTotalAssortedQuantity(curr)
              // console.log(totalQuantity, this.assortFilter);
              if (totalQuantity >= cond) {
                price = curAmt
                calAmt = qty * price
                selected_spec = `${index}-${af_index}`

                // run update on all assorted product sale value
                this.updateOtherAssorted(curr)
              }
            } else if (sp.type === 'special') {
              ///////// Special Price ////////
              if (qty >= cond) {
                price = curAmt
                calAmt = qty * price
                selected_spec = `${index}-${af_index}`
              }
            }
            // update product sale value
            curr = this.assignSalesValue(
              index,
              qty,
              calAmt,
              price,
              selected_spec,
            )
          })
        } else {
          // update product sale value
          curr = this.assignSalesValue(index, qty, calAmt, price, selected_spec)
        }
      } else {
        // update product sale value
        curr = this.assignSalesValue(index, 0, 0, 0, null)
        // remove current data from assorted products
        const assortIds = this.assortFilter.map((ass: any) => ass.atlas_id)
        // run update on all assorted product sale value
        if (assortIds.includes(curr.atlas_id)) this.updateOtherAssorted(curr)
      }
    }

    this.runnnerTotal()

    //// this.runTotalCalculation(index);

    //// console.log(this.productData)
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
      .httpGetRequest('/dealer/get-vendors-with-orders')
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
    let newArray = []

    if (this.searchatlasId == '###') {
      newArray = array
    } else {
      this.isMod = true
      setTimeout(() => {
       document.getElementById('formtable')
          ?.querySelector('.highlighted')
          ?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'start',
          });
      }, 1000);
      this.highlightIndex = array.findIndex((item: any) => {
        return item.atlas_id == this.searchatlasId!
      })
    }
    return array
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
      .httpGetRequest('/dealer/get-vendor-products/' + id)
      .then((result: any) => {
        if (result.status) {
          this.getVendorBuck(id)

          if (this.searchatlasId) {
            let productRes = this.filterTop(result.data)
            this.incomingData = result.data

            for (let h = 0; h < productRes.length; h++) {
              const each = productRes[h]
              each.price = '$0.00'
              each.position = h
              each.forCal = 0
              each.unitPrice = 0
              each.qty = ''
            }

            this.dataSrc = new MatTableDataSource<PeriodicElement>(productRes)
            this.tableData = this.filterTop(productRes)
            this.productData = this.filterTop(productRes)
            /// this.dataSrc.sort = this.sort
            this.dataSrc.paginator = this.paginator
            this.sortedData = this.productData.slice()
          } else {
            let productRes = result.data

            for (let h = 0; h < productRes.length; h++) {
              const each = productRes[h]
              each.price = '$0.00'
              each.position = h
              each.forCal = 0
              each.unitPrice = 0
            }
            this.dataSrc = new MatTableDataSource<PeriodicElement>(productRes)
            // this.dataSrc.sort = this.sort
            this.dataSrc.paginator = this.paginator

            this.tableData = productRes
            this.productData = productRes
          }

          this.canOrder = true

          $('table-ctn').addClass('highlight')
          this.canOrder = true
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
              'Success'
            );

            this.orderTable = [];
            this.getTotal();
            this.getCart();
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
    if (this.overTotal > 0) {
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

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1)
}
