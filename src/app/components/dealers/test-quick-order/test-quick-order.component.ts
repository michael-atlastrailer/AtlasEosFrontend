import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';

export interface PeriodicElement {
  qty: any;
  atlas_id: any;
  vendor: string;
  description: string;
  booking: number;
  special: number;
  extended: number;
}

declare var $: any;

@Component({
  selector: 'app-test-quick-order',
  templateUrl: './test-quick-order.component.html',
  styleUrls: ['./test-quick-order.component.scss'],
})
export class TestQuickOrderComponent implements OnInit {
  searchId = '';
  searchLoader = true;
  searchStatus = false;
  noData = false;
  allCategoryData: any;
  searchResultData: any;
  disabled = true;
  disabledBtn = true;
  addLoader = false;
  addToQuickLoader = false;

  addSuccess = false;
  orderTotal: any;
  @ViewChild('vendorInput') vendorInput!: ElementRef;
  @ViewChild('qtyInput') qtyInput!: ElementRef;
  @ViewChild('searchid') atlasInput!: ElementRef;

  orderTable: object[] = [];
  cartHistory: object[] = [];
  orderLen = 0;
  tableData: PeriodicElement[] = [];
  displayedColumns: string[] = [
    'qty',
    'atlas_id',
    'vendor',
    'description',
    'booking',
    'special',
    'extended',
    'actions',
  ];
  sortTable: any;
  dataSrc = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  canOrder = false;
  isMod = false;
  cartLoader = false;
  orderSuccess = false;

  //////// Achawayne ///////

  quickOrderData: any;
  loaderInput = false;
  assortedType = false;
  addItemTable: any = [];
  noItemFound = false;
  normalPrice = 0;
  currentProductAmt = 0;

  dummyAmt = 0;
  userData: any;

  @ViewChildren('extend')
  extendField!: QueryList<ElementRef>;
  currentQty = '';
  tableView = false;
  loader = true;
  currentGrouping = '';
  productData: any;
  modalTableloader = true;
  modalTableView = false;
  modalTableData: any;

  modalTableCol: string[] = [
    'qty',
    'atlas_id',
    'vendor',
    'description',
    'booking',
    'special',
    'extended',
  ];

  assortedItems: [] | any = [];
  currentState: [] | any = [];
  assortFilter: [] | any = [];
  assortSecondFilter: [] | any = [];
  newArrayFilter: [] | any = [];

  benchMarkQty = 4;

  ModalnormalPrice = 0;
  ModalcurrentProductAmt = 0;
  overTotal: any = 0;

  anotherLinePhase: any | [] = [];
  anotherLinePhaseFilter: any | [] = [];
  groupsArray: any | [] = [];

  allAddedItemAtlasID: any | [] = [];

  @ViewChildren('Modalextend')
  ModalextendField!: QueryList<ElementRef>;

  modalDummyAmt = 0;
  incomingVendorData: any;
  allVendors: any;
  showDropdown = false;
  @ViewChild('dummyInput') dummyInput!: ElementRef;
  vendorCode = '';
  addedItem: any = [];

  @ViewChild('closeModalBtn') closeModalBtn!: ElementRef;

  ClearBtnText = true;
  ClearOrderBtnLoader = false;
  modalTableBtn = false;

  newlyAdded = 0;
  existingInQuickOrder = '';
  existingInOrder = '';
  showAlert = false;
  vendorDisplay: any;
  addBtn = true;
  currentVendor = '';

  //////// Achawayne stopped /////////

  constructor(
    private getData: HttpRequestsService,
    private toastr: ToastrService,
    private token: TokenStorageService,
    private _liveAnnouncer: LiveAnnouncer,
    private currencyPipe: CurrencyPipe
  ) {
    // this.searchResultData.vendor_name = '';
    //  this.fetchProductById()
    // this.getCart()
    ///this.fetchQuickOrderCart()
  }
  @ViewChild(MatSort)
  sort!: MatSort;
  ngOnInit(): void {
    this.userData = this.token.getUser();
    this.fetchQuickOrderCart();
  }

  //////////// Achawayne /////////////////////

  removeShowAlert() {
    this.showAlert = false;
  }

  addOrderToQuickTable() {
    let allProCount = this.productData.length;
    let addedState = false;
    let inCart = false;
    let postItem = [];
    this.modalTableBtn = true;

    for (let h = 0; h < allProCount; h++) {
      let curQty = $('#cur-' + h).val();
      if (curQty != '' && curQty != undefined) {
        let data = this.productData[h];
        let rawUnit = document.getElementById('u-price-' + h)?.innerText;
        let unit = rawUnit?.replace(',', '.');

        let rawPrice = document.getElementById('amt-hidd-' + h)?.innerHTML;
        // let realPrice = rawPrice?.replace('$', '')
        let newPrice = rawPrice?.replace(',', '.');

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
        };

        postItem.push(cartData);
      }
    }

    let postData = {
      uid: this.userData.id,
      dealer: this.userData.account_id,
      product_array: JSON.stringify(postItem),
    };

    this.getData
      .httpPostRequest('/dealer/submit-assorted-quick-order', postData)
      .then((res: any) => {
        this.modalTableBtn = false;
        this.showAlert = true;
        if (res.status) {
          this.newlyAdded = res.data.newly_added;
          this.existingInQuickOrder = res.data.existing_already_in_quick_order;
          this.existingInOrder = res.data.existing_already_in_order;
          this.currentVendor = res.data.current_vendor;

          if (res.data.submitted_status) {
            this.toastr.success(`item(s) has been submitted`, 'Success');
          }

          this.closeModalBtn.nativeElement.click();
          this.fetchQuickOrderCart();
        } else {
          this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        this.showAlert = false;

        if (err.message.response.dealer || err.message.response.dealer) {
          this.toastr.info(`Please logout and login again`, 'Session Expired');
        } else {
          this.toastr.info(`Something went wrong`, 'Error');
        }
      });
  }

  runModalTableCalculation(index: number, qty: any, event: any) {
    if (event.key != 'Tab') {
      if (qty !== '') {
        let curr = this.productData[index];
        let atlasId = curr.atlas_id;
        let spec = curr.spec_data;

        // if (!this.allAddedItemAtlasID.includes(atlasId)) {
        //   this.allAddedItemAtlasID.push(atlasId)
        // }

        if (spec !== null) {
          if (spec.length > 0) {
            for (let j = 0; j < spec.length; j++) {
              const f = spec[j];
              if (f.type == 'assorted') {
                curr.quantity = qty;
                curr.pos = index;
                this.assortFilter.push(curr);
                for (let y = 0; y < this.assortFilter.length; y++) {
                  const t = this.assortFilter[y];
                  if (t.id == curr.id) {
                  } else {
                    this.assortFilter.push(curr);
                  }

                  this.newArrayFilter = this.assortFilter.filter(
                    (x: any, y: any) => this.assortFilter.indexOf(x) == y
                  );

                  let secondPhase: any = [];
                  let anotherFilter: any = [];
                  let letsContinue = false;

                  for (let h = 0; h < this.newArrayFilter.length; h++) {
                    const e = this.newArrayFilter[h];
                    if (e.grouping == curr.grouping) {
                      if (e.spec_data.length > 0) {
                        letsContinue = true;
                        //console.log(e.spec_data);
                        // e.spec_data[h].quantity = e.quantity;
                        // e.spec_data[h].pos = e.pos;
                        // e.spec_data[0].arrIndex = e.spec_data.length - 1;
                        // secondPhase.push(e.spec_data[0]);

                        e.spec_data.pos = e.pos;
                        e.spec_data.quantity = e.quantity;
                        e.spec_data.atlas_id = e.atlas_id;
                        e.spec_data.group = e.grouping;

                        for (let t = 0; t < e.spec_data.length; t++) {
                          let ele = e.spec_data[t];
                          ele.quantity = e.quantity;
                          ele.pos = e.pos;
                          ele.atlas_id = e.atlas_id;
                          ele.arrIndex = t;
                          secondPhase.push(ele);
                        }
                        this.anotherLinePhase.push(e.spec_data);
                        console.log(this.anotherLinePhase);
                      } else {
                        let price = parseFloat(e.booking);
                        let quantity = parseInt(e.quantity);
                        let newPrice = price * quantity;
                        let formattedAmt = this.currencyPipe.transform(
                          newPrice,
                          '$'
                        );

                        $('#u-price-' + e.pos).html(price);
                        $('#amt-' + e.pos).html(formattedAmt);
                        $('#amt-hidd-' + e.pos).html(newPrice);
                      }
                    } else {
                    }
                  }

                  this.anotherLinePhaseFilter = this.anotherLinePhase.filter(
                    (v: any, i: any, a: any) =>
                      a.findIndex((t: any) => t.atlas_id === v.atlas_id) === i
                  );

                  let newTotalAss = 0;

                  this.anotherLinePhaseFilter.map((val: any, index: any) => {
                    if (curr.grouping == val.group) {
                      console.log(curr.grouping);
                      newTotalAss += parseInt(val.quantity);
                    }
                  });

                  /// console.log(newTotalAss, 'Total');

                  if (letsContinue) {
                    let status = false;
                    for (
                      let h = 0;
                      h < this.anotherLinePhaseFilter.length;
                      h++
                    ) {
                      const k = this.anotherLinePhaseFilter[h];
                      if (newTotalAss >= parseInt(k[0].cond)) {
                        status = true;

                        $('.normal-booking-' + k.pos).css('display', 'none');
                      } else {
                        for (let hj = 0; hj < k.length; hj++) {
                          const eleK = k[hj];
                          $(
                            '.special-booking-' + eleK.pos + '-' + eleK.arrIndex
                          ).css('display', 'none');

                          // console.log('testing price', eleK);

                          let booking = parseFloat(eleK.booking);
                          let newPrice = parseInt(eleK.quantity) * booking;
                          let formattedAmt = this.currencyPipe.transform(
                            newPrice,
                            '$'
                          );

                          $('#u-price-' + eleK.pos).html(booking);
                          $('#amt-' + eleK.pos).html(formattedAmt);
                          $('#amt-hidd-' + eleK.pos).html(newPrice);
                        }

                        let price = parseFloat(k.booking);
                        $('.normal-booking-' + k.pos).css(
                          'display',
                          'inline-block'
                        );
                      }
                    }

                    if (status) {
                      let tickArrToBeRemoved = [];
                      //// If total Assorted is greater than condition /////
                      for (
                        let i = 0;
                        i < this.anotherLinePhaseFilter.length;
                        i++
                      ) {
                        const jk = this.anotherLinePhaseFilter[i];
                        let currArrLength = jk.length;

                        for (let j = 0; j < jk.length; j++) {
                          --currArrLength;
                          const backWard = jk[currArrLength];
                          const frontWard = jk[j];

                          if (
                            newTotalAss < backWard.cond &&
                            newTotalAss >= frontWard.cond
                          ) {
                            let nxt = frontWard.arrIndex + 1;
                            let preData = jk[nxt];
                            let activeData = frontWard;

                            $('.normal-booking-' + activeData.pos).css(
                              'display',
                              'none'
                            );

                            $(
                              '.special-booking-' +
                                activeData.pos +
                                '-' +
                                activeData.arrIndex
                            ).css('display', 'inline-block');

                            $(
                              '.special-booking-' +
                                preData.pos +
                                '-' +
                                preData.arrIndex
                            ).css('display', 'none');
                            let special = parseFloat(activeData.special);
                            let newPrice =
                              parseInt(activeData.quantity) * special;
                            let formattedAmt = this.currencyPipe.transform(
                              newPrice,
                              '$'
                            );

                            $('#u-price-' + activeData.pos).html(special);
                            $('#amt-' + activeData.pos).html(formattedAmt);
                            $('#amt-hidd-' + activeData.pos).html(newPrice);
                          } else {
                            let pre = backWard.arrIndex - 1;
                            let preData = jk[pre];
                            let activeData = backWard;
                            let chNxt = pre + 1;
                            let chpp = jk[chNxt];

                            // console.log('dropped', activeData);
                            let pp = jk[j];

                            if (newTotalAss >= pp.cond) {
                              let special = parseFloat(pp.special);
                              let newPrice = parseInt(pp.quantity) * special;
                              let formattedAmt = this.currencyPipe.transform(
                                newPrice,
                                '$'
                              );

                              $('#u-price-' + pp.pos).html(special);
                              $('#amt-' + pp.pos).html(formattedAmt);
                              $('#amt-hidd-' + pp.pos).html(newPrice);
                            }

                            $(
                              '.special-booking-' +
                                activeData.pos +
                                '-' +
                                activeData.arrIndex
                            ).css('display', 'inline-block');

                            if (preData != undefined) {
                              tickArrToBeRemoved.push(preData);
                            }
                            for (
                              let hi = 0;
                              hi < tickArrToBeRemoved.length;
                              hi++
                            ) {
                              const kk = tickArrToBeRemoved[hi];
                              $(
                                '.special-booking-' + kk.pos + '-' + kk.arrIndex
                              ).css('display', 'none');
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
                let arr = this.ModalextendField.toArray()[index];
                let specialAmt = 0;
                let specialCond = 0;
                let specData = this.productData[index].spec_data;
                this.ModalnormalPrice = parseFloat(
                  this.productData[index].booking
                );
                for (let i = 0; i < specData.length; i++) {
                  let curAmt = parseFloat(specData[i].special);
                  let cond = parseInt(specData[i].cond);
                  let orignialAmt = parseFloat(specData[i].booking);
                  specData[i].arrIndex = i;
                  let nextArr = i + 1;
                  let len = specData.length;

                  if (qty >= cond) {
                    this.ModalnormalPrice = curAmt;
                    $('.normal-booking-' + index).css('display', 'none');

                    $(
                      '.special-booking-' + index + '-' + specData[i].arrIndex
                    ).css('display', 'inline-block');

                    let g = i - 1;
                    let nxt = i + 1;

                    if (specData[nxt]) {
                      $('.special-booking-' + index + '-' + nxt).css(
                        'display',
                        'none'
                      );
                    } else {
                    }

                    $('.special-booking-' + index + '-' + g).css(
                      'display',
                      'none'
                    );
                  } else {
                    this.ModalnormalPrice = this.ModalnormalPrice;
                    $('.special-booking-' + index + '-' + i).css(
                      'display',
                      'none'
                    );
                    let nxt = i + 1;
                    let pre = i - 1;

                    if (specData[nxt]) {
                      let cond = specData[nxt].cond;
                      if (qty < cond) {
                        $('.normal-booking-' + index).css(
                          'display',
                          'inline-block'
                        );
                      } else {
                        $('.normal-booking-' + index).css('display', 'none');
                      }
                      $('.normal-booking-' + index).css('display', 'none');
                    } else {
                      // console.log(specData[pre]);
                      let preData = specData[pre];
                      if (preData) {
                        let preCond = parseInt(preData.cond);
                        // console.log(`${preCond} and ${qty}`);
                        if (qty >= preCond) {
                          $('.normal-booking-' + index).css('display', 'none');
                        } else {
                        }
                      } else {
                        $('.normal-booking-' + index).css(
                          'display',
                          'inline-block'
                        );
                      }

                      if (qty >= cond) {
                        $('.normal-booking-' + index).css('display', 'none');
                      } else {
                      }
                    }
                  }

                  if (qty >= cond) {
                    this.ModalnormalPrice = curAmt;
                  } else {
                    this.ModalnormalPrice = this.ModalnormalPrice;
                  }
                }

                let calAmt = qty * this.ModalnormalPrice;
                this.ModalcurrentProductAmt = calAmt;
                $('#u-price-' + index).html(this.ModalnormalPrice);
                let formattedAmt = this.currencyPipe.transform(calAmt, '$');
                arr.nativeElement.innerHTML = formattedAmt;
                $('#amt-' + index).html(formattedAmt);
                $('#amt-hidd-' + index).html(calAmt);
              }
            }
          } else {
            let quantity = parseInt(qty);
            let price = parseFloat(curr.booking);

            let calAmt = quantity * price;
            this.ModalcurrentProductAmt = calAmt;

            ///console.log(price, 'unit Price');
            $('#u-price-' + index).html(price);

            $('.normal-booking-' + index).css('display', 'inline-block');

            let formattedAmt = this.currencyPipe.transform(calAmt, '$');
            $('#amt-' + index).html(formattedAmt);
            $('#amt-hidd-' + index).html(calAmt);
          }
        } else {
          console.log('trying to find it');
          let quantity = parseInt(qty);
          let price = parseFloat(curr.booking);

          let calAmt = quantity * price;
          this.ModalcurrentProductAmt = calAmt;

          ///console.log(price, 'unit Price');
          $('#u-price-' + index).html(price);

          $('#amt-hidd-' + index).html(calAmt);

          $('.normal-booking-' + index).css('display', 'inline-block');

          let formattedAmt = this.currencyPipe.transform(calAmt, '$');
          $('#amt-' + index).html(formattedAmt);
        }
      } else {
        if (qty == '' || qty == 0) {
          for (let h = 0; h < this.assortFilter.length; h++) {
            let ele = this.assortFilter[h];
            let curr = this.productData[index];

            if (curr.atlas_id == ele.atlas_id) {
              const index = this.assortFilter.indexOf(ele);
              if (index >= 0) {
                this.assortFilter.splice(index, 1);
              }
            }
          }

          for (let h = 0; h < this.newArrayFilter.length; h++) {
            let ele = this.newArrayFilter[h];
            let curr = this.productData[index];

            if (curr.atlas_id == ele.atlas_id) {
              const index = this.newArrayFilter.indexOf(ele);
              if (index >= 0) {
                this.newArrayFilter.splice(index, 1);
              }
              this.assortFilter = this.newArrayFilter;
            }
          }

          for (let hy = 0; hy < this.anotherLinePhaseFilter.length; hy++) {
            let he = this.anotherLinePhaseFilter[hy];
            let curr = this.productData[index];
            if (curr.atlas_id == he.atlas_id) {
              const ind = this.anotherLinePhaseFilter.indexOf(he);
              if (ind >= 0) {
                this.anotherLinePhaseFilter.splice(ind, 1);
              }
              this.anotherLinePhase = [];
              this.anotherLinePhase = this.anotherLinePhaseFilter;
            }
          }

          let checkTotalAss = 0;
          let curr = this.productData[index];

          this.anotherLinePhase.map((val: any, index: any) => {
            ///console.log(val.group);
            if (curr.grouping == val.group) {
              checkTotalAss += parseInt(val.quantity);
            }
          });

          for (let tk = 0; tk < this.anotherLinePhase.length; tk++) {
            let jk = this.anotherLinePhase[tk];
            let tickArrToBeRemoved = [];
            // const jk = this.anotherLinePhaseFilter[i];
            let currArrLength = jk.length;

            if (curr.grouping == jk.group) {
              if (jk.length > 1) {
                for (let kl = 0; kl < jk.length; kl++) {
                  const kelly = jk[kl];
                  --currArrLength;
                  const backWard = jk[currArrLength];
                  const frontWard = jk[kl];

                  if (
                    checkTotalAss < backWard.cond &&
                    checkTotalAss >= frontWard.cond
                  ) {
                    let nxt = frontWard.arrIndex + 1;
                    let preData = jk[nxt];
                    let activeData = frontWard;

                    $('.normal-booking-' + activeData.pos).css(
                      'display',
                      'none'
                    );

                    $(
                      '.special-booking-' +
                        activeData.pos +
                        '-' +
                        activeData.arrIndex
                    ).css('display', 'inline-block');

                    $(
                      '.special-booking-' + preData.pos + '-' + preData.arrIndex
                    ).css('display', 'none');

                    let special = activeData.special;
                    let newPrice = parseInt(activeData.quantity) * special;
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$'
                    );

                    $('#u-price-' + activeData.pos).html(special);
                    $('#amt-' + activeData.pos).html(formattedAmt);
                    $('#amt-hidd-' + activeData.pos).html(newPrice);
                  } else {
                    let pre = backWard.arrIndex - 1;
                    let preData = jk[pre];
                    let activeData = backWard;

                    $(
                      '.special-booking-' +
                        activeData.pos +
                        '-' +
                        activeData.arrIndex
                    ).css('display', 'inline-block');

                    let special = activeData.special;
                    let newPrice = parseInt(activeData.quantity) * special;
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$'
                    );

                    $('#u-price-' + activeData.pos).html(special);
                    $('#amt-' + activeData.pos).html(formattedAmt);
                    $('#amt-hidd-' + activeData.pos).html(newPrice);

                    if (checkTotalAss >= activeData.cond) {
                    } else {
                      if (preData != undefined) {
                        tickArrToBeRemoved.push(activeData);
                      }
                      $('.normal-booking-' + activeData.pos).css(
                        'display',
                        'inline-block'
                      );

                      let booking = activeData.booking;
                      let newPrice = parseInt(activeData.quantity) * booking;
                      let formattedAmt = this.currencyPipe.transform(
                        newPrice,
                        '$'
                      );

                      $('#u-price-' + activeData.pos).html(booking);
                      $('#amt-' + activeData.pos).html(formattedAmt);
                      $('#amt-hidd-' + activeData.pos).html(newPrice);
                    }

                    if (preData != undefined) {
                      tickArrToBeRemoved.push(preData);
                    }
                    for (let hi = 0; hi < tickArrToBeRemoved.length; hi++) {
                      const kk = tickArrToBeRemoved[hi];
                      $('.special-booking-' + kk.pos + '-' + kk.arrIndex).css(
                        'display',
                        'none'
                      );
                    }
                  }
                }
              } else {
                for (let ag = 0; ag < jk.length; ag++) {
                  const agaa = jk[ag];

                  if (checkTotalAss >= agaa.cond) {
                    $('.normal-booking-' + agaa.pos).css('display', 'none');

                    $('.special-booking-' + agaa.pos + '-' + agaa.arrIndex).css(
                      'display',
                      'inline-block'
                    );
                    let special = agaa.special;
                    let newPrice = parseInt(agaa.quantity) * special;
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$'
                    );

                    $('#u-price-' + agaa.pos).html(special);
                    $('#amt-' + agaa.pos).html(formattedAmt);
                    $('#amt-hidd-' + agaa.pos).html(newPrice);
                  } else {
                    // $('.normal-booking-' + agaa.pos).css(
                    //   'display',
                    //   'inline-block'
                    // );

                    $('.special-booking-' + agaa.pos + '-' + agaa.arrIndex).css(
                      'display',
                      'none'
                    );
                    let special = agaa.special;
                    let newPrice = parseInt(agaa.quantity) * special;
                    let formattedAmt = this.currencyPipe.transform(
                      newPrice,
                      '$'
                    );

                    $('#u-price-' + agaa.pos).html(special);
                    $('#amt-' + agaa.pos).html(formattedAmt);
                    $('#amt-hidd-' + agaa.pos).html(newPrice);
                  }
                }
              }
            }
          }

          // console.log(this.anotherLinePhaseFilter);
        }

        /// qty = 0;
        let curr = this.productData[index];
        let spec = curr.spec_data;

        $('.normal-booking-' + index).css('display', 'none');
        if (spec != null) {
          for (let h = 0; h < spec.length; h++) {
            $('.special-booking-' + index + '-' + h).css('display', 'none');
          }
        }

        let formattedAmt = this.currencyPipe.transform(0, '$');
        $('#amt-' + index).html(formattedAmt);
      }
    }
  }

  getcurrentGroupings() {
    this.canOrder = false;
    this.isMod = false;

    this.modalTableloader = true;
    this.modalTableView = false;
    /// let id = this.vendor.nativeElement.value
    // this.showSubmittedDetails = false

    this.getData
      .httpGetRequest('/dealer/get-item-group/' + this.currentGrouping)
      .then((result: any) => {
        this.modalTableloader = false;
        this.modalTableView = true;

        if (result.status) {
          this.productData = result.data;

          this.tableData = result.data;
          if (result.data.length !== 0) {
            this.canOrder = true;
          }
          this.orderTable = [];

          this.modalTableData = new MatTableDataSource<PeriodicElement>(
            result.data
          );
        } else {
          this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error');
      });
  }

  oneAddBtn() {
    // let allProCount = this.productData.length
    let addedState = false;
    let inCart = false;
    let postItem = [];

    if (this.currentQty != '') {
      this.addToQuickLoader = true;
      this.addSuccess = false;

      let rawUnit = document.getElementById('u-price-' + 0)?.innerText;
      let unit = rawUnit?.replace(',', '.');

      let rawPrice = document.getElementById('amt-hidd-' + 0)?.innerHTML;
      // let realPrice = rawPrice?.replace('$', '')
      let newPrice = rawPrice?.replace(',', '.');

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
      };

      postItem.push(cartData);

      let postData = {
        uid: this.userData.id,
        dealer: this.userData.account_id,
        product_array: JSON.stringify(postItem),
      };

      this.getData
        .httpPostRequest('/dealer/submit-quick-order', postData)
        .then((res: any) => {
          this.showAlert = true;
          if (res.status) {
            this.fetchQuickOrderCart();
            this.cartLoader = false;
            this.addToQuickLoader = false;
            this.addSuccess = true;

            this.newlyAdded = res.data.newly_added;
            this.existingInQuickOrder =
              res.data.existing_already_in_quick_order;
            this.existingInOrder = res.data.existing_already_in_order;
            this.currentVendor = res.data.current_vendor;

            if (res.data.submitted_status) {
              this.toastr.success(`item(s) has been submitted`, 'Success');
            }

            this.orderTable = [];
            this.atlasInput.nativeElement.value = null;
            this.vendorInput.nativeElement.value = null;
            this.qtyInput.nativeElement.value = null;
            this.searchStatus = false;
            // this.fetchQuickOrderCart()
          } else {
            this.addToQuickLoader = false;
            this.toastr.info(`Something went wrong`, 'Error');
          }
        })
        .catch((err) => {
          this.showAlert = false;

          // this.cartLoader = false
          if (err.message.response.dealer || err.message.response.dealer) {
            this.toastr.info(
              `Please logout and login again`,
              'Session Expired'
            );
          } else {
            this.toastr.info(`Something went wrong`, 'Error');
          }
        });

      console.log(postItem);
    }
  }

  runCalculation(qty: any, index: number) {
    if (qty != '') {
      this.currentQty = qty;
      let curr = this.quickOrderData[index];
      let atlasId = curr.atlas_id;
      let spec = curr.spec_data;

      if (spec != null) {
        if (spec.length > 0) {
          let arr = this.extendField.toArray()[index];
          let specialAmt = 0;
          let specialCond = 0;
          let specData = this.quickOrderData[index].spec_data;
          this.normalPrice = parseFloat(this.quickOrderData[index].booking);
          for (let i = 0; i < specData.length; i++) {
            let curAmt = parseFloat(specData[i].special);
            let cond = parseInt(specData[i].cond);
            let orignialAmt = parseFloat(specData[i].booking);
            specData[i].arrIndex = i;
            let nextArr = i + 1;
            let len = specData.length;
            if (qty >= cond) {
              this.normalPrice = curAmt;
              $('.normal-booking-' + index).css('display', 'none');
              $('.special-booking-' + index + '-' + specData[i].arrIndex).css(
                'display',
                'inline-block'
              );
              let g = i - 1;
              let nxt = i + 1;
              if (specData[nxt]) {
                $('.special-booking-' + index + '-' + nxt).css(
                  'display',
                  'none'
                );
              } else {
              }
              $('.special-booking-' + index + '-' + g).css('display', 'none');
            } else {
              this.normalPrice = this.normalPrice;
              $('.special-booking-' + index + '-' + i).css('display', 'none');
              let nxt = i + 1;
              let pre = i - 1;
              if (specData[nxt]) {
                let cond = specData[nxt].cond;
                if (qty < cond) {
                  $('.normal-booking-' + index).css('display', 'inline-block');
                } else {
                  $('.normal-booking-' + index).css('display', 'none');
                }
                $('.normal-booking-' + index).css('display', 'none');
              } else {
                let preData = specData[pre];
                if (preData) {
                  let preCond = parseInt(preData.cond);
                  if (qty >= preCond) {
                    $('.normal-booking-' + index).css('display', 'none');
                  } else {
                  }
                } else {
                  $('.normal-booking-' + index).css('display', 'inline-block');
                }
                if (qty >= cond) {
                  $('.normal-booking-' + index).css('display', 'none');
                } else {
                }
              }
            }
            if (qty >= cond) {
              this.normalPrice = curAmt;
            } else {
              this.normalPrice = this.normalPrice;
            }

            console.log(this.normalPrice, 'tesrs');
          }
          let calAmt = qty * this.normalPrice;
          this.currentProductAmt = calAmt;
          $('#u-price-' + index).html(this.normalPrice);
          let formattedAmt = this.currencyPipe.transform(calAmt, '$');
          arr.nativeElement.innerHTML = formattedAmt;
          $('#amt-' + index).html(formattedAmt);
          $('#amt-hidd-' + index).html(calAmt);
        } else {
          let quantity = parseInt(qty);
          let price = parseFloat(curr.booking);

          let calAmt = quantity * price;
          this.currentProductAmt = calAmt;

          console.log(price, 'unit Price');
          $('#u-price-' + index).html(price);
          $('.normal-booking-' + index).css('display', 'inline-block');

          let formattedAmt = this.currencyPipe.transform(calAmt, '$');
          $('#amt-' + index).html(formattedAmt);
          $('#amt-hidd-' + index).html(calAmt);
        }
      } else {
        let quantity = parseInt(qty);
        let price = parseFloat(curr.booking);

        let calAmt = quantity * price;
        this.currentProductAmt = calAmt;

        console.log(price, 'unit Price');
        $('#u-price-' + index).html(price);
        $('.normal-booking-' + index).css('display', 'inline-block');

        let formattedAmt = this.currencyPipe.transform(calAmt, '$');
        $('#amt-' + index).html(formattedAmt);
        $('#amt-hidd-' + index).html(calAmt);
      }
    } else {
      let curr = this.quickOrderData[index];
      let spec = curr.spec_data;
      $('.normal-booking-' + index).css('display', 'none');
      if (spec != null) {
        for (let h = 0; h < spec.length; h++) {
          $('.special-booking-' + index + '-' + h).css('display', 'none');
        }
      }

      let formattedAmt = this.currencyPipe.transform(0, '$');
      $('#amt-' + index).html(formattedAmt);
    }
  }

  fetchProductById() {
    let atlasId = this.searchId;
    this.noData = false;
    this.disabled = true;
    this.loaderInput = true;

    console.log('search id', atlasId);
    if (atlasId !== '') {
      this.searchStatus = false;
      this.searchLoader = true;
      this.getData
        .httpGetRequest('/dealer/get-item-by-atlas-vendor-code/' + atlasId)
        .then((res: any) => {
          this.loaderInput = false;

          if (res.status) {
            this.searchStatus = true;
            this.searchLoader = false;
            this.noItemFound = res.data.filtered_data.length > 0 ? false : true;

            if (res.data.filtered_data.length > 0) {
              this.currentGrouping =
                res.data.filtered_data[0].grouping != null
                  ? res.data.filtered_data[0].grouping
                  : '';
              console.log(res.data.filtered_data);
              console.log(this.currentGrouping, 'we rae');
            }

            this.searchResultData = res.data;
            this.quickOrderData = res.data.filtered_data;
            this.vendorDisplay = res.data.filtered_data[0];
            this.assortedType = res.data.assorted;
            if (this.assortedType) {
              //// this.addToQuickLoader = false
              this.disabled = true;
              this.addBtn = false;
            } else {
              /// this.addToQuickLoader = true
              this.disabled = false;
              this.addBtn = true;
            }
            this.noData = false;
            // this.disabled = false
          } else {
            this.searchStatus = false;
            this.searchLoader = false;
            this.noData = true;
            this.disabled = true;
          }
        })
        .catch((err: any) => {
          this.loaderInput = false;

          this.searchStatus = false;
          this.searchLoader = false;
          this.noData = true;
          this.disabled = true;
          console.log(err);
          this.toastr.error('Something went wrong, try again', ' Error');
        });
    } else {
    }
  }

  fetchQuickOrderCart() {
    this.canOrder = false;
    this.isMod = false;
    let id = this.token.getUser()?.id;
    this.getData
      .httpGetRequest(
        '/dealer/get-dealer-quick-orders/' +
          this.userData.account_id +
          '/' +
          this.userData.id
      )
      .then((result: any) => {
        this.tableView = true;
        this.loader = false;

        if (result.status) {
          this.tableData = result.data;

          this.dataSrc = new MatTableDataSource<PeriodicElement>(result.data);
          // this.dataSrc.sort = this.sort
          this.dataSrc.paginator = this.paginator;
        } else {
          // this.toastr.info(`Something went wrong`, 'Error')
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error');
      });
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
        return true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        return false;
      } else {
        return false;
      }
    });
  }

  async deleteQuickOrderItem(atlsId: any, index: any) {
    let confirmStatus = await this.confirmBox();

    if (confirmStatus) {
      let uid = this.token.getUser().id.toString();

      $('#remove-icon-' + index).css('display', 'none');
      $('#remove-loader-' + index).css('display', 'inline-block');

      this.getData
        .httpGetRequest('/dealer/delete-quick-order-item/' + uid + '/' + atlsId)
        .then((result: any) => {
          $('#remove-icon-' + index).css('display', 'inline-block');
          $('#remove-loader-' + index).css('display', 'none');

          if (result.status) {
            this.toastr.success('Successful', result.message);
            this.fetchQuickOrderCart();
          } else {
            this.toastr.error('Something went wrong', 'Try again');
          }
        })
        .catch((err) => {
          this.toastr.error('Something went wrong', 'Try again');
        });
    }
  }

  async clearCart() {
    let confirm = await this.confirmBox();
    console.log('conifrm', confirm);
    if (confirm) {
      this.ClearBtnText = false;
      this.ClearOrderBtnLoader = true;

      let uid = this.token.getUser().id.toString();

      this.getData
        .httpGetRequest('/dealer/remove-all-user-order/' + uid)
        .then((result: any) => {
          this.ClearBtnText = true;
          this.ClearOrderBtnLoader = false;
          if (result.status) {
            this.toastr.success(`${result.message}`, 'Success');

            this.fetchQuickOrderCart();
          } else {
            this.cartLoader = false;

            this.toastr.info(`${result.message}`, 'Error');
          }
        })
        .catch((err) => {
          this.ClearBtnText = true;
          this.ClearOrderBtnLoader = false;
          if (err.message.response.dealer || err.message.response.dealer) {
            this.toastr.info(
              `Please logout and login again`,
              'Session Expired'
            );
          } else {
            this.toastr.info(`Something went wrong`, 'Error');
          }
        });
   }
  }

  /////////// Achawayne Stopped ///////////////////

  addToQuickOrder() {
    this.addLoader = true;
    this.addSuccess = false;

    let uid = this.token.getUser().id.toString();
    let accntId = this.token.getUser().account_id;
    this.orderLen = this.orderTable.length;
    if (this.orderTable.length > 0) {
      let formdata = {
        uid: uid,
        dealer: accntId,
        product_array: JSON.stringify(this.orderTable),
      };
      this.getData
        .httpPostRequest('/dealer/submit-quick-order', formdata)
        .then((result: any) => {
          if (result.status) {
            this.addLoader = false;
            this.addSuccess = true;
            this.toastr.success(
              `${this.orderLen}  item have been added to order`,
              'Success'
            );
            this.orderTable = [];
            this.atlasInput.nativeElement.value = null;
            this.vendorInput.nativeElement.value = null;
            this.qtyInput.nativeElement.value = null;
            this.searchStatus = false;
            ///   this.fetchQuickOrderCart()
          } else {
            this.addLoader = false;

            this.toastr.info(`Something went wrong`, 'Error');
          }
        })
        .catch((err) => {
          this.addLoader = false;
          if (err.message.response.dealer || err.message.response.dealer) {
            this.toastr.info(
              `Please logout and login again`,
              'Session Expired'
            );
          } else {
            this.toastr.info(`Something went wrong`, 'Error');
          }
        });
    } else {
      this.addLoader = false;

      this.toastr.info(`No item quantity has been set`, 'Error');
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  parser(data: any) {
    return JSON.parse(data);
  }

  getCart() {
    let id = this.token.getUser().account_id;
    this.getData
      .httpGetRequest('/cart/dealer/' + id)
      .then((result: any) => {
        if (result.status) {
          console.log('dealer id', result?.data);
          this.cartHistory = result?.data;
        } else {
          this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error');
      });
  }

  submitOrder() {
    this.cartLoader = true;
    this.orderSuccess = false;

    let uid = this.token.getUser().id.toString();
    let accntId = this.token.getUser().account_id;
    this.orderLen = this.orderTable.length;
    if (this.dataSrc.data.length > 0) {
      let formdata = {
        uid: uid,
        dealer: accntId,
      };
      this.getData
        .httpPostRequest('/dealer/move-dealer-quick-order', formdata)
        .then((result: any) => {
          if (result.status) {
            this.cartLoader = false;
            this.orderSuccess = true;
            this.toastr.success(`${result.message}`, 'Success');
            this.fetchQuickOrderCart();
          } else {
            this.cartLoader = false;
            this.toastr.info(`Something went wrong`, 'Error');
          }
        })
        .catch((err) => {
          this.cartLoader = false;
          if (err.message.response.dealer || err.message.response.dealer) {
            this.toastr.info(
              `Please logout and login again`,
              'Session Expired'
            );
          } else {
            this.toastr.info(`Something went wrong`, 'Error');
          }
        });
    } else {
      this.cartLoader = false;

      this.toastr.info(`No item quantity has been set`, 'Error');
    }
  }
}
