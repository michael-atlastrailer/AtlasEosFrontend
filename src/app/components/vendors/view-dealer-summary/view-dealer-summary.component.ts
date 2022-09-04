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
  selector: 'app-view-dealer-summary',
  templateUrl: './view-dealer-summary.component.html',
  styleUrls: ['./view-dealer-summary.component.scss'],
})
export class ViewDealerSummaryComponent implements OnInit {
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

  currenDateTime = ''

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
      this.dealer = params['dealer']
      this.vendor = params['vendor']
      this.selectedVendorCode = this.vendor

      this.changeBellNotificationStatus()
      this.getDealerSummaryData()
      this.getVendorNotes()
      this.getAtlasNotes()
    })

    let d = new Date()
    let month = d.getMonth() + 1
    let mnth = month < 10 ? `0${month}` : month
    let dateT = d.getDate()
    let dd = dateT < 10 ? `0${dateT}` : dateT
    let comDate = dd + '-' + mnth + '-' + d.getFullYear()
    let hrs = d.getHours()
    let hours = hrs < 10 ? `0${hrs}` : hrs
    let mins = d.getMinutes()
    let minutes = mins < 10 ? `0${mins}` : mins
    let sec = d.getSeconds()
    let ampm = hrs >= 12 ? 'pm' : 'am'
    let comTime = hours + ':' + minutes + ':' + sec + ' ' + ampm
    this.currenDateTime = comDate + ' ' + comTime
  }

  exportOrderExcel() {
    $('#order-table-export').table2excel({
      exclude: '.noExl',
      name: 'order-table-export',
      filename: 'order-table-export',
      fileext: '.xlsx',
    })
  }

  changeBellNotificationStatus() {
    this.httpServer
      .httpGetRequest(
        '/vendor/change-bell-notify-status/' +
          this.userData.id +
          '/' +
          this.selectedVendorCode,
      )
      .then((result: any) => {})
      .catch((err) => {})
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
        '/vendor/view-dealer-summary/' + this.dealer + '/' + this.vendor,
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

  getLocal(e: any) {
    return localStorage.getItem(e)
  }
}
