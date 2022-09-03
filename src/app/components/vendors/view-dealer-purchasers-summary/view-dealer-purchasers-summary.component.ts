import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { MatPaginator } from '@angular/material/paginator'
import { MatTableDataSource } from '@angular/material/table'
import { MatSort, Sort } from '@angular/material/sort'
import { ActivatedRoute } from '@angular/router'
import { ToastrService } from 'ngx-toastr'

declare var $: any

export interface vendorProducts {
  atlas_id: string
  vendor: string
  description: string
  regular: string
  show: string
}

@Component({
  selector: 'app-view-dealer-purchasers-summary',
  templateUrl: './view-dealer-purchasers-summary.component.html',
  styleUrls: ['./view-dealer-purchasers-summary.component.scss'],
})
export class ViewDealerPurchasersSummaryComponent implements OnInit {
  tableView = false
  loader = true
  userData: any
  privilegedVendors: any
  selectedVendorName!: string
  selectedVendorCode!: string
  vendorProductData: any
  incomingData: any

  vendor = ''
  dealer = ''
  user = ''
  summaryData: any
  dealerData: any
  vendorData: any
  noTableData = false
  totalPrice = 0
  vendorNoteData: any
  noVendorNote = false
  vendorNoteLoader = true
  atlasNoteLoader = true
  noAtlasNote = false
  atlasNoteData: any
  vendorNoteText = ''
  atlasNoteText = ''

  vendorDataLoader = false
  vendorAddLoader = false

  atlasDataLoader = false
  atlasAddLoader = false

  @ViewChild('closeVendorNoteModal') closeVendorNoteModal!: ElementRef
  @ViewChild('closeAtlasNoteModal') closeAtlasNoteModal!: ElementRef

  displayedColumns: string[] = [
    'atlas_id',
    'vendor',
    'description',
    'regular',
    'show',
  ]

  constructor(
    private tokenData: TokenStorageService,
    private httpServer: HttpRequestsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
  ) {
    this.userData = tokenData.getUser()

    this.user = this.userData.id
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.user = params['user']

      this.dealer = params['dealer']
      this.vendor = params['vendor']

      this.getDealerSummaryData()
      this.getVendorNotes()
      this.getAtlasNotes()
    })
  }

  exportAtlasNote() {
    $('#altas-note-table').table2excel({
      exclude: '.noExl',
      name: 'atlas-note',
      filename: 'atlas-note',
      fileext: '.xlsx',
    })
  }

  exportVendorNote() {
    $('#vendor-note-table').table2excel({
      exclude: '.noExl',
      name: 'vendor-note',
      filename: 'vendor-note',
      fileext: '.xlsx',
    })
  }

  saveAtlasNote() {
    if (this.atlasNoteText != '') {
      this.atlasAddLoader = true
      let data = {
        vendorCode: this.vendor,
        vendorRepName: this.userData.first_name + ' ' + this.userData.last_name,
        vendorUid: this.userData.id,
        dealerCode: this.dealer,
        dealerRepName:
          this.dealerData.first_name + ' ' + this.dealerData.last_name,
        dealerUid: this.user,
        notes: this.atlasNoteText,
        role: 1,
      }

      this.httpServer
        .httpPostRequest('/vendor/save-vendor-notes', data)
        .then((result: any) => {
          this.atlasNoteLoader = false
          this.atlasAddLoader = false
          this.atlasNoteText = ''
          if (result.status) {
            this.getAtlasNotes()
            this.toastr.success(result.message, `Success`)
            this.closeAtlasNoteModal.nativeElement.click()

            // this.noAtlasNote = result.data.length > 0 ? false : true
          } else {
          }
        })
        .catch((err) => {})
    }
  }

  saveVendorNote() {
    if (this.vendorNoteText != '') {
      this.vendorAddLoader = true
      let data = {
        vendorCode: this.vendor,
        vendorRepName: this.userData.first_name + ' ' + this.userData.last_name,
        vendorUid: this.userData.id,
        dealerCode: this.dealer,
        dealerRepName:
          this.dealerData.first_name + ' ' + this.dealerData.last_name,
        dealerUid: this.user,
        notes: this.vendorNoteText,
        role: 3,
      }

      this.httpServer
        .httpPostRequest('/vendor/save-vendor-notes', data)
        .then((result: any) => {
          this.atlasNoteLoader = false
          this.vendorAddLoader = false
          this.vendorNoteText = ''
          if (result.status) {
            this.getVendorNotes()
            this.toastr.success(result.message, `Success`)
            this.closeVendorNoteModal.nativeElement.click()

            // this.noAtlasNote = result.data.length > 0 ? false : true
          } else {
          }
        })
        .catch((err) => {})
    }
  }

  getAtlasNotes() {
    this.httpServer
      .httpGetRequest(
        '/vendor/get-atlas-notes/' + this.dealer + '/' + this.vendor,
      )
      .then((result: any) => {
        this.atlasNoteLoader = false
        if (result.status) {
          this.atlasNoteData = result.data
          this.noAtlasNote = result.data.length > 0 ? false : true
          this.atlasDataLoader = true
        } else {
        }
      })
      .catch((err) => {})
  }

  getVendorNotes() {
    this.httpServer
      .httpGetRequest(
        '/vendor/get-vendor-notes/' + this.dealer + '/' + this.vendor,
      )
      .then((result: any) => {
        this.vendorNoteLoader = false
        if (result.status) {
          this.vendorNoteData = result.data
          this.noVendorNote = result.data.length > 0 ? false : true
        } else {
        }
      })
      .catch((err) => {})
  }

  getDealerSummaryData() {
    this.httpServer
      .httpGetRequest(
        '/vendor/view-dealer-purchaser-summary/' +
          this.user +
          '/' +
          this.dealer +
          '/' +
          this.vendor,
      )
      .then((result: any) => {
        this.tableView = true
        this.loader = false
        if (result.status) {
          this.summaryData = result.data.summary
          this.dealerData = result.data.dealer
          this.vendorData = result.data.vendor
          this.noTableData = result.data.summary.length > 0 ? false : true
          this.vendorDataLoader = true
          console.log(result.data)
          if (this.summaryData.length > 0) {
            for (let i = 0; i < this.summaryData.length; i++) {
              const element = this.summaryData[i]
              this.totalPrice += parseFloat(element.total)
            }
          }
        } else {
        }
      })
      .catch((err) => {})
  }
}
