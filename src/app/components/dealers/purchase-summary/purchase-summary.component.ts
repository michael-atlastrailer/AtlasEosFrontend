import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-purchase-summary',
  templateUrl: './purchase-summary.component.html',
  styleUrls: ['./purchase-summary.component.scss'],
})
export class PurchaseSummaryComponent implements OnInit {
  showOrder = false;
  orders: any;
  newTable: any;
  constructor(
    private getData: HttpRequestsService,
    private token: TokenStorageService,
    private toastr: ToastrService
  ) {
    this.fetchDealer();
  }

  ngOnInit(): void {}
  fetchDealer() {
    let id = this.token.getUser().account_id;

    this.getData
      .httpGetRequest('/product-summary/' + id)
      .then((result: any) => {
        // console.log(result);
        if (result.status) {
          
          this.orders = result.data;
          this.newTable = 
          this.checkVendorGroupTotal(this.orders);
        } else {
          this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error');
      });
  }
  checkVendorGroupTotal(array: any) {
  
    if (array.length > 0) {
      this.showOrder=true
      //seperating each dealer in array
      for (var i = 0; i < array.length; i++) {
        let deal = array[i]; let grandTotal = 0
        //checking if all vendor object keys contain anything
        if (Object.keys(deal.all_vendors).length > 0) {
          //converting object to array [vendor_code, array of products under the vendor]
         
          array[i].all_vendors = Object.entries(deal.all_vendors);
           //now allvendors is an array of array with [vendor_code, array of products under the vendor]
          let dealVend = deal.all_vendors;
         
          //geting the aray of products under each vendor
          for (var j = 0; j < dealVend.length; j++) {
            //selceting the individual array of products under a vendor
            let realArr = dealVend[j][1];
            let total = 0;
            //getting total of products under each vendor in all vendors
            for (var k = 0; k < realArr.length; k++) {
              total = total + parseFloat(realArr[k].price);
            }
            //adding the total to the array i.e [vendor_code, product order array, total]
            array[i].all_vendors[j].push(total);
            array[i].all_vendors[j].push(array[i].all_vendors[j][1][0].vendor_name);
            grandTotal= grandTotal+total
          }
        }array[i].grandTotal= grandTotal
      }
    } console.log("calc total check", array)
   return array

   
  }
  
}
