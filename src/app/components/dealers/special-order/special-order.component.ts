import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CurrencyPipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { T } from '../show-orders/show-orders.component';
interface Dealer {
  cname: any;
  fname: string;
  lname: string;
  id: any;
}
class Product {
  public quantity: number | undefined;
  description: string | undefined;
  vendor_no: string | undefined;
  vendor_code: string | undefined;
}
declare var $: any;
export interface PeriodicElement {
  no: number;
  qty: string;
  description: string;
  vendor_name: string;
  vendor_code: string;
}

@Component({
  selector: 'app-special-order',
  templateUrl: './special-order.component.html',
  styleUrls: ['./special-order.component.scss'],
})
export class SpecialOrderComponent implements OnInit {
  allCategoryData: any;
  vendorSelected = false;
  arr: any = [];

  ordained: any;
  dealer: Dealer = {
    fname: '',
    lname: '',
    cname: '',
    id: undefined,
  };
  tableData: PeriodicElement[] = [];
  displayedColumns: string[] = [
    'id',
    'qty',
    'description',
    'vendor_code',
    'vendor_name',
    'ordered_by',
    'action',
  ];
  noData = false;
  editable: any = {
    quantity: '',
    vendor_no: '',
    description: '',
    id: '',
    vendor_code: '',
  };
  editOrderPage = false;
  editOrderSuccess = false;
  saveLoader = false;
  tableId = {};
  disableSubmit = false;
  errorPrmpt = false;
  allOrderPage = false;
  dataSrc = new MatTableDataSource<PeriodicElement>();
  duplicateArr: any = [];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  isSpecial = false;
  arrNotSpec: any = [];
  cannotSubmit = false;
  showDropdown = false;
  @ViewChild('vendorInput') dummyInput!: ElementRef;
  vendorCode = '';
  allObj = { vendor_name: 'All Vendors', vendor_code: 'none' };
  incomingVendorData: any;
  constructor(
    private getData: HttpRequestsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private _liveAnnouncer: LiveAnnouncer,
    private token: TokenStorageService,
    private currencyPipe: CurrencyPipe
  ) {
    this.getAllVendors();
    this.fetchOrder();
  }
  @ViewChild(MatSort)
  sort!: MatSort;
  ngOnInit(): void {}
  applyFilter(filterValue: any) {
    this.dataSrc.filter = filterValue.trim().toLowerCase();
  }
  sortData(sort: Sort) {
    const data = this.dataSrc.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSrc.data = data;
      return;
    }

    this.dataSrc.data = data.sort((a: any, b: any) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'quantity':
          return compare(a.quantity, b.quantity, isAsc);
        case 'vendor_name':
          return compare(a.vendor_name, b.vendor_name, isAsc);
        case 'vendor_no':
          return compare(a.vendor_no, b.vendor_no, isAsc);

        default:
          return 0;
      }
    });
  }
  getAllVendors() {
    this.getData
      .httpGetRequest('/dealer/get-vendors')
      .then((result: any) => {
        // console.log(result);
        if (result.status) {
          
          this.incomingVendorData = result.data;
          this.incomingVendorData.unshift(this.allObj);
          this.allCategoryData=this.incomingVendorData
        } else {
          this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error');
      });
  }
  selectVendor() {
    console.log("slected search",this.vendorCode)
    if (this.vendorCode !== 'none') {
      this.ordained = this.allCategoryData.filter((item:any) => {
        return item.vendor_code == this.vendorCode
      }); this.ordained =this.ordained[0]
        this.vendorSelected = true;
      this.dealer.fname = this.token.getUser().first_name;
      this.dealer.lname = this.token.getUser().last_name;
      this.dealer.cname = this.token.getUser().company_name;
      this.dealer.id = this.token.getUser().id;
      console.log('dealer data', this.ordained, this.allCategoryData);
      this.clearOrder();
    }
  }
  addRow() {
    this.arr.push(new Product());
    console.log('array result', this.arr);
  }

  goToEditOrder(qty: any, vId: any, desc: any, i: any, vCode: any) {
    this.editOrderPage = true;
    this.editable.quantity = qty;
    this.editable.vendor_no = vId;
    this.editable.description = desc;
    this.editable.id = i;
    this.editable.vendor_code = vCode;

    console.log('setting edtiable', desc, vId, qty, i, vCode, this.editable);
    this.editOrderSuccess = false;
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  goToAllOrder() {
    this.editOrderPage = false;
    this.allOrderPage = true;
    this.vendorSelected = false;

    if (this.vendorCode !== 'none') {
    
      console.log('venfor code', this.vendorCode);
      this.fetchOrderByVendorId(this.vendorCode);
    } else {
      {
        this.fetchOrder();
      }
    }
  }
  enterValue(type: any, value: any, i: any) {
    console.log('array enter value', value);
    if (type == 'qty') {
      this.arr[i].quantity = value;
    }
    if (type == 'vId') {
      this.arr[i].vendor_no = value;
    }
    if (type == 'desc') {
      this.arr[i].description = value;
    }
    console.log('array result enterval', this.arr, i, this.arr[i]);
  }

  parser(data: any) {
    return JSON.parse(data);
  }
  submitEditSpecialOrder(qty: any, vId: any, desc: any) {
    let array: any = [];

    array.push(this.editable);
    console.log('compaer editable', this.editable);
    let formdata = {
      uid: this.token.getUser().id,
      product_array: JSON.stringify(array),
    };
    this.getData
      .httpPostRequest('/special-orders/edit', formdata)
      .then((result: any) => {
        // console.log(result);
        if (result.status) {
          this.editOrderSuccess = true;
          this.fetchOrder();
          this.toastr.success(`Special Order has been edited`, 'Success');
        } else {
          this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error');
      });
  }
  submitOrder() {
    this.checkEmptyStat('23', '#$', false);

    if (!this.disableSubmit) {
      this.saveLoader = true;
      for (var i = 0; i < this.arr.length; i++) {
        this.arr[i].vendor_code = this.ordained.vendor_code;
      }
      console.log('submitted arr', this.arr, JSON.stringify(this.arr));

      let formdata = {
        uid: this.token.getUser().id,
        product_array: JSON.stringify(this.arr),
        dealer_id: this.token.getUser().account_id,
      };
      this.errorPrmpt = false;
      this.getData
        .httpPostRequest('/special-orders/add', formdata)
        .then((result: any) => {
          // console.log(result);
          if (result.status) {
            this.saveLoader = false;
            this.toastr.success(
              `Special order has been successfully saved`,
              'Success'
            );
            this.clearOrder();
          } else {
            this.saveLoader = false;

            this.toastr.info(
              `Something went wrong could not save orders`,
              'Error'
            );
          }
        })
        .catch((err) => {
          this.saveLoader = false;

          this.toastr.info(
            `Something went wrong could not save orders`,
            'Error'
          );
        });
    } else {
      this.errorPrmpt = true;
    }
  }
  fetchOrder() {
    let user = this.token.getUser().account_id;
    let empty: any = [];
    this.getData
      .httpGetRequest('/special-orders/' + user)
      .then((result: any) => {
        // console.log(result);
        if (result.status) {
          this.dataSrc = new MatTableDataSource<PeriodicElement>(result.data);
          this.dataSrc.paginator = this.paginator;
        } else {
          // this.toastr.info(
          //   `Something went wrong fetching special orders`,
          //   'Error'
          // );

          this.dataSrc = new MatTableDataSource<PeriodicElement>(result.data);
          this.dataSrc.paginator = this.paginator;
          this.dataSrc.sort = this.sort;
        }
      })
      .catch((err) => {
        this.saveLoader = false;

        this.toastr.info(
          `Something went wrong fetching special orders`,
          'Error'
        );
      });
  }
  fetchOrderByVendorId(id: any) {
    let user = this.token.getUser().account_id;
    let empty: any = [];
    this.getData
      .httpGetRequest('/special-orders/' + user)
      .then((result: any) => {
        // console.log(result);
        if (result.status) {
          let filteredRes = result.data.filter((item: any) => {
            return item.vendor_code == id;
          });
          console.log('filtereed', filteredRes);
          this.dataSrc = new MatTableDataSource<PeriodicElement>(filteredRes);
          this.dataSrc.paginator = this.paginator;
        } else {
          // this.toastr.info(
          //   `Something went wrong fetching special orders`,
          //   'Error'
          // );
          let filteredRes = result.data.filter((item: any) => {
            return item.vendor_code == id;
          });
          console.log('filtereed', filteredRes);
          this.dataSrc = new MatTableDataSource<PeriodicElement>(filteredRes);
          this.dataSrc.paginator = this.paginator;
          this.dataSrc.sort = this.sort;
        }
      })
      .catch((err) => {
        this.saveLoader = false;

        this.toastr.info(
          `Something went wrong fetching special orders`,
          'Error'
        );
      });
  }

  checkEmptyStat(id: any, j: any, check: boolean) {
    let error = false;
    console.log('errror disable', this.disableSubmit, error);
    this.hasDuplicates(this.arr);
    if (this.arr?.length < 1) {
      error = true;
    } else {
      for (var i = 0; i < this.arr.length; i++) {
        console.log(this.arr[i], this.arr[i].vendor_no);
        if (this.arr[i].quantity == '') {
          error = true;
        }
        if (this.arr[i].quantity == null) {
          error = true;
        }
        if (this.arr[i].vendor_no == '') {
          error = true;
        }
        if (this.arr[i].description == '') {
          error = true;
        }
        if (this.arr[i].vendor_no == undefined) {
          error = true;
        }
        if (this.arr[i].description == undefined) {
          error = true;
        }
      }
    }

    this.disableSubmit = error;
    console.log('errror disable after', this.disableSubmit, error, id, j);

    if (check) {
      this.addDesc(j, 'ed');
      this.checkVendorNo(id, j);
    }
  }
  checkVendorNo(id: any, i: any) {
    this.isSpecial = false;

    let save = this.disableSubmit;
    this.disableSubmit = true;
    this.getData
      .httpGetRequest('/dealer/get-item-by-atlas-vendor-code/' + id)
      .then((result: any) => {
        console.log(result, 'promotion');

        if (result.status) {
          console.log('search vendor res', result.data['filtered_data'].length);

          if (result.data['filtered_data'].length == 0) {
            this.arr[i].inBooking = false;
            this.isSpecial = true;
            this.disableSubmit = save;
          } else {
            this.disableSubmit = save;

            this.toastr.error(
              `Item is on the show please other on the show order form `,
              '',
              { timeOut: 6000 }
            );
            this.arr[i].inBooking = true;
            this.isSpecial = true;
          }
        } else {
          // this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        // this.toastr.info(`Something went wrong`, 'Error');
      });
  }
  hasDuplicates(a: any) {
    let filteredArr = a.filter((item: any, i: any) => {
      return a.indexOf(item) !== i;
    });

    const noDups = new Set(a.vendor_no);
    console.log('filtrted array', filteredArr, noDups);
    // return a.length !== noDups.size;
  }
  checkConstraint() {
    this.arrNotSpec = [];
    function toFindDuplicates(arry: any) {
      const uniqueElements = new Set(arry);
      const filteredElements = arry.filter((item: any) => {
        if (uniqueElements.has(item.vendor_no)) {
          uniqueElements.delete(item);
        } else {
          return item.vendor_no;
        }
      });

      return [...new Set(uniqueElements)];
    }
    const duplicates = toFindDuplicates(this.arr);

    for (var i = 0; i < this.arr.length; i++) {
      if (this.arr[i].qty == '') {
        this.cannotSubmit = true;
      }
      if (this.arr[i].qty == null) {
        this.cannotSubmit = true;
      }
      if (this.arr[i].vendor_no == '') {
        this.cannotSubmit = true;
      }

      if (this.arr[i].inBooking == true) {
        this.cannotSubmit = true;
        this.arrNotSpec.push(this.arr[i].vendor_no);
      } else {
        this.cannotSubmit = false;
      }
    }
    if (this.arrNotSpec.length == 0) {
      this.submitOrder();
    }
    console.log(
      'checking constraint',
      this.arrNotSpec,
      this.cannotSubmit,
      duplicates
    );
  }
  getUser(uid: string, userlist: any) {
    let name: any;
    for (var i = 0; i < userlist.length; i++) {
      if (userlist[i].id == parseInt(uid)) {
        name = userlist[i].full_name;
      }
    }
    return name;
  }
  addDesc(j: any, q: any) {
    if (!this.arr[j].description) {
      this.arr[j].description = '';
    }
  }
  deleteOrder(i: any) {
    if (i > -1) {
      this.arr.splice(i, 1);
      this.checkEmptyStat('g', 'f', false);
    }
  }
  deleteSavedOrder(i: any) {
    let dealer = this.token.getUser().account_id;
    this.getData
      .httpGetRequest('/special-orders/delete/' + dealer + '/' + i)
      .then((result: any) => {
        // console.log(result);
        if (result.status) {
          this.fetchOrder();
          this.toastr.info(`Item has been removed successfully`, 'Order');
        } else {
          this.toastr.info(`Something went wrong deleting special orders`, '');
          this.fetchOrder();
        }
      })
      .catch((err) => {
        this.saveLoader = false;

        this.toastr.info(`Something went wrong deleting special orders`, '');
      });
  }
  navigateFromEdit() {
    this.editOrderPage = false;
    this.editOrderSuccess = false;
  }
  clearOrder() {
    this.arr = [];
    this.arr.push(new Product());
  }
  // dropdown
  applyFilterAlt(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.incomingVendorData.vendor_name = filterValue.trim().toLowerCase();
    this.allCategoryData = this.filterArray('*' + filterValue);
  }
  filterArray(expression: string) {
    var regex = this.convertWildcardStringToRegExp(expression);
    return this.incomingVendorData.filter(function (item: any) {
      return regex.test(item.vendor_name);
    });
  }
  escapeRegExp(str: string) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  convertWildcardStringToRegExp(expression: string) {
    var terms = expression.split('*');

    var trailingWildcard = false;

    var expr = '';
    for (var i = 0; i < terms.length; i++) {
      if (terms[i]) {
        if (i > 0 && terms[i - 1]) {
          expr += '.*';
        }
        trailingWildcard = false;
        expr += this.escapeRegExp(terms[i]);
      } else {
        trailingWildcard = true;
        expr += '.*';
      }
    }

    if (!trailingWildcard) {
      expr += '.*';
    }

    return new RegExp('^' + expr + '$', 'i');
  }
  toggleVendors() {
    if (this.showDropdown) {
      this.showDropdown = false;
    } else {
      this.showDropdown = true;
    }
  }

  getAllSelectedDealerUsers(data: any) {
    if (this.showDropdown) {
      this.showDropdown = false;
    } else {
      this.showDropdown = true;
    }

    this.dummyInput.nativeElement.value = data.vendor_name;
    this.vendorCode = data.vendor_code;
    console.log('vendor sele', data);
  }
}
function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
