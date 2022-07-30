import { Component, OnInit } from '@angular/core';

import { HttpRequestsService } from 'src/app/core/services/http-requests.service';

@Component({
  selector: 'app-promotional-flyer',
  templateUrl: './promotional-flyer.component.html',
  styleUrls: ['./promotional-flyer.component.scss'],
})
export class PromotionalFlyerComponent implements OnInit {
  promotionalLoader = true;
  promotionalData = false;
  promotionalStatus = false;
  promotionalAds: any;
  allCategoryData: any;
  init = true;
  defaultFlyer = 1

  constructor(private getData: HttpRequestsService) {
    this.getAllVendors();
  }

  ngOnInit(): void {}

  getAllVendors() {
    this.getData
      .httpGetRequest('/promotional_fliers/vendors')
      .then((result: any) => {
        console.log(result);
        if (result.status) {
          this.allCategoryData = result.data;
          console.log("albendor", result.data)
          this.defaultFlyer = result.data[0].vendor_code;
          this.fetchFlyer(result.data[0].vendor_code);
        } else {
        }
      })
      .catch((err) => {});
  }
  fetchFlyer(data: any) {
    this.init = false;

    console.log("chosen one",data);
    this.promotionalLoader = true;
    this.promotionalData = false;
    this.promotionalStatus = false;

    
    console.log(data, 'id');
    this.getData
      .httpGetRequest('/show-promotional-flier-by-vendor-id/' + data)
      .then((result: any) => {
        console.log(result, 'promotion');

        this.promotionalLoader = false;
        if (result.status) {
          // this.promotionalData = result.data.length > 0 ? true : false;
          // this.promotionalStatus = result.data.length <= 0 ? true : false;
          this.promotionalAds = result.data[0];
          this.promotionalData = true;
        } else {
        }
      })
      .catch((err) => {
        this.promotionalLoader = false;
        this.promotionalData = true;
      });
  }
}
