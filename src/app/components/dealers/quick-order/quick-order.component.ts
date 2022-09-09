import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CurrencyPipe } from '@angular/common';
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

declare var $: any;
export interface PeriodicElement {
  qty: any;
  atlas_id: any;
  vendor: string;
  description: string;
  booking: number;
  special: number;
  extended: number;
}

@Component({
  selector: 'app-quick-order',
  templateUrl: './quick-order.component.html',
  styleUrls: ['./quick-order.component.scss'],
})
export class QuickOrderComponent implements OnInit {
  searchId = '';
  searchLoader = true;
  searchStatus = false;
  noData = false;
  allCategoryData: any;
  searchResultData: any;
  disabled = true;
  disabledBtn = true;
  addLoader = false;
  addSuccess = false;
  orderTotal: any;
  productData: any = [];
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
  //alt
  assortedItems: [] | any = [];
  currentState: [] | any = [];
  assortFilter: [] | any = [];
  assortSecondFilter: [] | any = [];
  newArrayFilter: [] | any = [];

  benchMarkQty = 4;

  normalPrice = 0;
  currentProductAmt = 0;
  overTotal: any = 0;

  anotherLinePhase: any | [] = [];
  anotherLinePhaseFilter: any | [] = [];
  groupsArray: any | [] = [];

  allAddedItemAtlasID: any | [] = [];

  @ViewChildren('extend')
  extendField!: QueryList<ElementRef>;

  dummyAmt = 0;
  userData: any;
  //end of alt
  constructor(
    private getData: HttpRequestsService,
    private toastr: ToastrService,
    private token: TokenStorageService,
    private _liveAnnouncer: LiveAnnouncer,
    private currencyPipe: CurrencyPipe
  ) {
    // this.searchResultData.vendor_name = '';
    this.fetchProductById();
    this.getCart();
  }
  @ViewChild(MatSort)
  sort!: MatSort;
  ngOnInit(): void {}
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

  fetchProductById() {
    let atlasId = this.searchId;
    this.noData = false;
    this.disabled = true;

    console.log('search id', atlasId);
    if (atlasId !== '') {
      this.searchStatus = false;
      this.searchLoader = true;
      this.getData
        .httpGetRequest('/quick-order-filter-atlasid/' + atlasId)
        .then((res: any) => {
          if (res.status) {
            this.searchStatus = true;
            this.searchLoader = false;
            this.searchResultData = res.data;
            this.noData = false;
            this.disabled = false;
            console.log('search result', this.searchResultData);
          } else {
            this.searchStatus = false;
            this.searchLoader = false;
            this.noData = true;
            this.disabled = true;
          }
        })
        .catch((err: any) => {
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
  qtyInputCheck(qty: any, runcalc: boolean) {
    if (qty > 0) {
      this.disabledBtn = false;
      this.searchResultData.qty = qty;

      if (runcalc) {
        this.productData.push(this.searchResultData);
        console.log(
          'lenght product',
          this.productData,
          this.productData.length - 1
        );
        this.runCalculation(this.productData.length - 1, qty);
      }
    } else {
      this.disabledBtn = true;
    }
  }
  runCalculation(index: number, qty: any) {
    if (qty !== '') {
      console.log(
        'enter calc run',
        this.productData[index],
        this.productData[index].atlas_id,
        this.productData[index].spec_data
      );
      let curr = this.productData[index];
      let atlasId = curr.atlas_id;
      let spec = curr.spec_data;

      if (!this.allAddedItemAtlasID.includes(atlasId)) {
        this.allAddedItemAtlasID.push(atlasId);
      }

      if (spec !== null) {
        if (spec.length > 0) {
          console.log();
          for (let j = 0; j < spec.length; j++) {
            const f = spec[j];
            if (f.type == 'assorted') {
              curr.quantity = qty;
              curr.pos = index;
              console.log('entered asspred', curr);
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
                      console.log('e assoted', e.spec_data.pos);
                      // e.spec_data[h].quantity = e.quantity;
                      // e.spec_data[h].pos = e.pos;
                      // e.spec_data[0].arrIndex = e.spec_data.length - 1;
                      // secondPhase.push(e.spec_data[0]);

                      e.spec_data.pos = e.pos;
                      e.spec_data.quantity = e.quantity;
                      e.spec_data.atlas_id = e.atlas_id;
                      e.spec_data.group = e.grouping;
                      console.log(
                        'ele',
                        e.spec_data,
                        e,
                        h,
                        this.newArrayFilter
                      );

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
                      console.log('e.pos asort', e.pos, newPrice, price);
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
                  for (let h = 0; h < this.anotherLinePhaseFilter.length; h++) {
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
              console.log(
                'Entered special',
                this.productData[index].spec_data,
                parseFloat(this.productData[index].booking)
              );
              ///////// Speacial Price ////////
              let arr = this.extendField.toArray()[index];
              let specialAmt = 0;
              let specialCond = 0;
              let specData = this.parser(this.productData[index].spec_data);
              this.normalPrice = parseFloat(this.productData[index].booking);
              for (let i = 0; i < specData.length; i++) {
                console.log('spec data special', specData[i]);
                let curAmt = parseFloat(specData[i].special);
                let cond = parseInt(specData[i].cond);
                let orignialAmt = parseFloat(specData[i].booking);
                specData[i].arrIndex = i;
                let nextArr = i + 1;
                let len = specData.length;

                if (qty >= cond) {
                  this.normalPrice = curAmt;
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
                  this.normalPrice = this.normalPrice;
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
                  this.normalPrice = curAmt;
                } else {
                  this.normalPrice = this.normalPrice;
                }
              }

              let calAmt = qty * this.normalPrice;
              this.currentProductAmt = calAmt;
              $('#u-price-' + index).html(this.normalPrice);
              let formattedAmt = this.currencyPipe.transform(calAmt, '$');
              console.log(formattedAmt, 'special price', arr, this.extendField);
              this.productData[index].extended = formattedAmt;
              // arr.nativeElement.innerHTML = formattedAmt;
              $('#amt-' + index).html(formattedAmt);
              $('#amt-hidd-' + index).html(calAmt);
            }
          }
        } else {
          let quantity = parseInt(qty);
          let price = parseFloat(curr.booking);

          let calAmt = quantity * price;
          this.currentProductAmt = calAmt;

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
        this.currentProductAmt = calAmt;

        ///console.log(price, 'unit Price');
        $('#u-price-' + index).html(price);

        $('.normal-booking-' + index).css('display', 'inline-block');

        let formattedAmt = this.currencyPipe.transform(calAmt, '$');
        console.log('amount normal', formattedAmt, index, this.productData);
        this.productData[index].extended = formattedAmt;
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

                  $('.normal-booking-' + activeData.pos).css('display', 'none');

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
                  let formattedAmt = this.currencyPipe.transform(newPrice, '$');

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
                  let formattedAmt = this.currencyPipe.transform(newPrice, '$');

                  $('#u-price-' + activeData.pos).html(special);
                  $('#amt-' + activeData.pos).html(formattedAmt);
                  $('#amt-hidd-' + activeData.pos).html(newPrice);

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
                  let formattedAmt = this.currencyPipe.transform(newPrice, '$');

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
                  let formattedAmt = this.currencyPipe.transform(newPrice, '$');

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
      for (let h = 0; h < spec.length; h++) {
        $('.special-booking-' + index + '-' + h).css('display', 'none');
      }

      let formattedAmt = this.currencyPipe.transform(0, '$');
      $('#amt-' + index).html(formattedAmt);
    }
    this.dataSrc = new MatTableDataSource<PeriodicElement>(
      this.checkQtyTable(this.productData)
    );
    this.dataSrc.sort = this.sort;
    this.dataSrc.paginator = this.paginator;
    console.log(this.checkQtyTable(this.productData), 'check rpoduct');
    ////this.runTotalCalculation()
  }

  getTotal() {
    let total = 0;
    if (this.dataSrc.data.length > 0) {
      for (var i = 0; i < this.dataSrc.data.length; i++) {
        let Obj: any = this.dataSrc.data[i]!;
        total = total + parseFloat(Obj.price!);
      }
      return (this.orderTotal = total);
    } else {
      return (this.orderTotal = 0);
    }
  }
  deleteQuickOrderItem(id: any, qty: any, product: any) {
    this.productData[id].qty = 0;
    this.runCalculation(id, qty);
  }
  checkQtyTable(arr: any) {
    let newarr = [];
    if (arr.length > 0) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].qty > 0) {
          newarr.push(arr[i]);
        }
      }
    } else {
      newarr = arr;
    }
    return newarr;
  }

  addToQuickOrder() {
    let uid = this.token.getUser().id.toString();
    let accntId = this.token.getUser().account_id;
    this.orderLen = this.orderTable.length;
    if (this.orderTable.length > 0) {
    } else {
      this.addLoader = false;

      this.toastr.info(`No item quantity has been set`, 'Error');
    }
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
      console.log('adding to quick cart', formdata);
      this.getData
        .httpPostRequest('/move-quick-order', formdata)
        .then((result: any) => {
          if (result.status) {
            this.cartLoader = false;
            this.orderSuccess = true;
            this.toastr.success(
              `${this.orderLen}  item(s) have been added to cart`,
              'Success'
            );
            this.orderTable = [];
            this.getCart();
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
  clearCart() {
    let uid = this.token.getUser().id.toString();

    if (this.dataSrc.data.length > 0) {
      this.orderLen = this.dataSrc.data.length;
      this.getData
        .httpGetRequest('/delete-quick-order-items-user-id/' + uid)
        .then((result: any) => {
          if (result.status) {
            this.toastr.success(
              `${this.orderLen}  item(s) have been Deleted from cart`,
              'Success'
            );
            this.orderTable = [];
            this.getCart();
            this.canOrder = false;
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

      this.toastr.info(`No item has been added to quick order cart`, 'Error');
    }
  }
}
