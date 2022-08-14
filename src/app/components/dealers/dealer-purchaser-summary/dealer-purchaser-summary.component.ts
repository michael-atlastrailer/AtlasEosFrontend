import { ElementRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-dealer-purchaser-summary',
  templateUrl: './dealer-purchaser-summary.component.html',
  styleUrls: ['./dealer-purchaser-summary.component.scss'],
})
export class DealerPurchaserSummaryComponent implements OnInit {
  vendors: any;
  @ViewChild('vendorId') vendor!: ElementRef;
  orderTable: any;
  selectDefault = true;
  newTable: any;
  tableData: any;
  orderTotal = 0;
  loader = true;
  products: any = [];
  grandTotal = 0;
  uid: any;
  vendorId: any;
  id = 0;
  constructor(
    private getData: HttpRequestsService,
    private toastr: ToastrService,
    private token: TokenStorageService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe((params) => {
      this.uid = params['uid'];
      this.vendorId = params['vendorId'];
      this.getCartByUid(this.uid!);
    });
  }

  ngOnInit(): void {}
  getCartByUid(id: any) {
    this.loader = true;
    console.log('fetching', id);
    this.orderTable = [];

    this.selectDefault = false;
 
    this.getData
      .httpGetRequest('/dealer-product-summary/' + id)
      .then((result: any) => {
        if (result.status) {
          console.log('search vendor res', result.data, this.uid);
          this.loader = false;

          this.orderTable = result.data;
          this.checkVendorGroup(result.data.vendors);
        } else {
          this.loader = false;

          this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        this.loader = false;

        this.toastr.info(`Something went wrong`, 'Error');
      });
  }
  checkVendorGroup(array: any) {
    console.log("old arr",array)
    let old = array;

    let vends = [];
    let prod = [];

    for (var x = 0; x < array.length; x++) {
      vends.push({
        vendor_code: array[x].vendor_code,
        vendor_name: array[x].vendor_name
      });
      prod.push(array[x].orders);
    }
    this.vendors = vends;
    this.products = prod;
    console.log('new list alt',vends,prod);
    this.id = 0;
    for (var i = 0; i < vends.length; i++) {
      console.log('vendor det',vends[i].vendor_code == this.vendorId, vends[i].vendor_code ,this.vendorId) 
      if (vends[i].vendor_code == this.vendorId) {
        this.id = i;
      }
    }
    this.getProducts(this.id.toString());
  }
  getProducts(a: string) {
    console.log('a',this.products[a])
    this.tableData = this.products[a];
    this.getTotal(this.tableData)
  }
  getTotal(table: any) {
    let total = 0;
    for (var i = 0; i < table.length; i++) {
console.log('price totla', )
      total = total+parseFloat(table[0].price);
    }
    this.orderTotal=total
  }
  parser(data: any) {
    return JSON.parse(data);
  }
}
