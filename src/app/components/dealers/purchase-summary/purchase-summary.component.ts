import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { TokenStorageService } from 'src/app/core/services/token-storage.service';

@Component({
  selector: 'app-purchase-summary',
  templateUrl: './purchase-summary.component.html',
  styleUrls: ['./purchase-summary.component.scss']
})
export class PurchaseSummaryComponent implements OnInit {
showOrder=false
orders:any
  constructor(private getData: HttpRequestsService, private token: TokenStorageService, private toastr: ToastrService,) {this.fetchDealer() }

  ngOnInit(): void {
  }
  fetchDealer() {
    let id = this.token.getUser().account_id;

    this.getData
      .httpGetRequest('/product-summary/' + id)
      .then((result: any) => {
        // console.log(result);
        if (result.status) {
          this.showOrder=true
          this.orders = result.data;
        } else {
          this.toastr.info(`Something went wrong`, 'Error');
        }
      })
      .catch((err) => {
        this.toastr.info(`Something went wrong`, 'Error');
      });
  }
}
