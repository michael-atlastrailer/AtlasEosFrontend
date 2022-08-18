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
  defaultFlyer = 'top';
  pdfDefault = {
    pdf_url: 'https://atlasdoc.urge2k.com/XtraAir.pdf',
    description: 'Atlas',
  };
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
          console.log('albendor', result.data);

          this.fetchFlyer(this.defaultFlyer);
        } else {
        }
      })
      .catch((err) => {});
  }
  fetchFlyer(data: any) {
    this.init = false;

    console.log('chosen one', data);
    this.promotionalLoader = true;
    this.promotionalData = false;
    this.promotionalStatus = false;

    console.log(data, 'id');
    if (data == 'top') {
      console.log(data, 'id', this.pdfDefault, this.promotionalAds);
      this.promotionalAds = this.pdfDefault;

      console.log(data, 'id', this.pdfDefault, this.promotionalAds);
      this.promotionalData = true;
    } else {
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
}
