import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';

export interface PeriodicElement {
  atlas_id: string;
  vendor: string;
  vendor_name: string;
  description: string;
  booking: number;
  special: number;
}
@Component({
  selector: 'app-new-orders',
  templateUrl: './new-orders.component.html',
  styleUrls: ['./new-orders.component.scss'],
})
export class NewOrdersComponent implements OnInit {
  allCategoryData: any;
  noData = false;
  tableLoader = false;
  tableStatus = false;
  viewSet = false;
  productData: any;
  @ViewChild('vendorId') vendor!: ElementRef;
  vendorId: any;
  searchatlasId: any;
  tableData: PeriodicElement[] = [];
  displayedColumns: string[] = [
    'atlas_id',
    'vendor',
    'vendor_name',
    'description',
    'booking',
    'special',
  ];
  currentData: any;
  dataSrc = new MatTableDataSource<PeriodicElement>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  constructor(
    private getData: HttpRequestsService,
    private toastr: ToastrService
  ) {
    this.getAllVendors();
    this.getAllNewProducts();
  }

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.dataSrc.paginator = this.paginator;
  }
  viewProduct(data: any) {
    console.log(data);
    this.currentData = data;

    this.viewSet = true;
  }
  parser(data: any) {
    return JSON.parse(data);
  }

  getAllVendors() {
    this.getData
      .httpGetRequest('/fetch-vendors-new-products')
      .then((result: any) => {
        console.log(result);
        if (result.status) {
          this.allCategoryData = result.data.vendors;
        } else {
          this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error');
      });
  }
 
  selectVendor() {
    let id = this.vendor.nativeElement.value;
    console.log('id of prod', id);
    if (id == 'all') {
      this.getAllNewProducts();
    } else {
      this.getProductByVendorId();
    }
  }

  getAllNewProducts() {
    // let id = this.vendor.nativeElement.value;
    this.getData
      .httpGetRequest('/get-all-new-products')
      .then((result: any) => {
        console.log(result, 'promotion');

        if (result.status) {
          console.log('search vendor res', result.data);
          this.tableData = result.data;
          this.dataSrc = new MatTableDataSource<PeriodicElement>(result.data);
          this.dataSrc.paginator = this.paginator;
        } else {
          this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error');
      });
  }
  getProductByVendorId() {
    let id = this.vendor.nativeElement.value;
    if (id == '0') {
      this.getAllNewProducts();
    } else {
      this.getData
        .httpGetRequest('/products/new/vendor_id/' + id)
        .then((result: any) => {
          console.log(result, 'promotion');

          if (result.status) {
            console.log('search vendor res vendor, producra', id, result.data);
            this.tableData = result.data;
            this.dataSrc = new MatTableDataSource<PeriodicElement>(result.data);
            this.dataSrc.paginator = this.paginator;
          } else {
            this.toastr.info(`Something went wrong`, 'Error');
          }
        })
        .catch((err) => {
          this.toastr.info(`Something went wrong`, 'Error');
        });
    }
  }
}
