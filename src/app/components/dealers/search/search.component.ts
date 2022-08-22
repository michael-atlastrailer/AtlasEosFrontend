import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CategorySearch } from 'src/app/core/model/category-search';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { GoogleTranslateService } from 'src/app/core/services/google-translate.service';
import { Sort } from '@angular/material/sort';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
declare var $: any;
export interface Products {
  id: number;
  img: string;
  atlas_id: number;
  description: string;
  vendor_logo: string;
  spec_data: any;
  um: string;
  booking: any;
  quantity: any;
  category: any;
  pos: any;
  grouping: any;
  short_note: string;
  short_note_url: string;
  vendor_name: string;
  is_new: boolean;
  xref: string | number;
}
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  dataStatus = false;
  loader = true;
  dummyAmt = 0;
  tableView = false;
  viewSet = false;
  pageTitle: any = '';
  nuller = 'vendor';

  productData: any;
  urlData!: any;
  showModal = false;
  itemsInCart: any = [];
  inCartStatus = false;
  sortedData!: Products[];

  @ViewChildren('extend')
  extendField!: QueryList<ElementRef>;

  @ViewChildren('trRow')
  tableRow!: QueryList<ElementRef>;

  @ViewChildren('inputAmt') quantityInput!: QueryList<ElementRef>;

  normalPrice = 0;
  currentData: any;
  benchMarkQty = 4;
  currentProductAmt = 0;

  DealerCart: any = [];
  category = '';

  assortedItems: [] | any = [];
  currentState: [] | any = [];

  assortFilter: [] | any = [];
  assortSecondFilter: [] | any = [];

  searchData = new CategorySearch('', '');
  searchMsg = false;
  allCategoryData: any;

  currentCartState: [] | any = [];

  // products!: Products[];

  search!: any;
  newArrayFilter: [] | any = [];
  dealerId!: number;
  repeatItems: any;
  cartCountAlert = false;
  cartCount = 0;
  vendorData: any;
  currentCategoryOrder = 0;
  vendorStatus = false;
  productStatus = false;
  productNoData = false;
  vendorNoData = false;
  proCategory = '';
  constructor(
    private getData: HttpRequestsService,
    private toastr: ToastrService,
    private currencyPipe: CurrencyPipe,
    private router: Router,
    private route: ActivatedRoute,
    private tokenStore: TokenStorageService,
    private postData: HttpRequestsService
  ) {
    this.route.params.subscribe((params) => {
      this.search = params['search'];
      this.getSearchData(this.search);
    });
  }
  ngOnInit(): void {}

  getSearchData(search: any) {
    this.productStatus = false;
    this.productNoData = false;
    this.vendorStatus = false;
    this.vendorNoData = false;
    this.getData
      .httpGetRequest('/universal-search/' + search)
      .then((result: any) => {
        this.loader = false;
        this.tableView = true;
        if (result.status) {
          let data = result.data;
          if (data.products) {
            this.productData = data.products;
            this.productStatus = true;
            this.productNoData = false;

            console.log(
              'entered pro true',
              this.productStatus,
              this.productNoData
            );
          }
          if (data.vendor) {
            this.vendorData = data.vendor;
            this.vendorStatus = true;
            this.vendorNoData = false;
            console.log(
              'entered vend true',
              this.vendorStatus,
              this.vendorNoData
            );
          }
          if (data.products == null) {
            this.productStatus = false;
            this.productNoData = true;
            console.log(
              'entered pro null',
              this.productStatus,
              this.productNoData
            );
          }
          if (data.vendor == null) {
            this.vendorNoData = true;
            this.vendorStatus = false;
            console.log(
              'entered pro null',
              this.vendorStatus,
              this.vendorNoData
            );
          }
          {
            this.productNoData == true &&
              this.vendorNoData == true &&
              this.toastr.error('Item not on show', ` Error`);
          }
          console.log('result', result);
        } else {
          this.toastr.error('', `Item not on show`);
        }
      })
      .catch((err) => {
        console.log('there is an err', err);
        this.toastr.error('Something went wrong', ` Error`);
        this.loader = false;
      });
  }
  parser(data: any) {
    return JSON.parse(data);
  }
  sortData(sort: Sort) {
    const data = this.productData.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'atlas_id':
          return compare(a.atlas_id, b.atlas_id, isAsc);
        case 'calories':
          return compare(a.calories, b.calories, isAsc);
        default:
          return 0;
      }
    });
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
