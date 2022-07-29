import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-add-show-buck',
  templateUrl: './add-show-buck.component.html',
  styleUrls: ['./add-show-buck.component.scss'],
})
export class AddShowBuckComponent implements OnInit {
  @ViewChild('fileCsv') csvFile!: ElementRef
  imgURL!: any
  imgUploadStatus = false
  PreviewImg = false
  dummyImg = true
  productForm!: FormGroup
  csvForm!: FormGroup

  imgStatus = false
  imgFileCount = false
  allVendor: any
  stateVendorName!: string
  selectedVendorId: any
  selectedPdfName!: string
  pdfChecker = false
  pdfErrorMsg = false

  vendorUserForm!: FormGroup
  manualChecker = false
  btnLoader = false
  btnText = true

  uploadCsvSendBtn = false
  setCsvBtn = true
  csvDataFile: any
  csvBtnLoader = false
  csvBtnText = true

  constructor(
    private fb: FormBuilder,
    private postData: HttpRequestsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getVendors()
    this.buildDealerForm()
  }

  getVendors() {
    this.postData
      .httpGetRequest('/get-all-vendors')
      .then((result: any) => {
        console.log(result)

        if (result.status) {
          this.allVendor = result.data
        } else {
          // this.toastr.error(result.message, 'Try again')
        }
      })
      .catch((err) => {
        // this.toastr.error('Try again', 'Something went wrong')
      })
  }

  assignStatus(data: any) {}

  assignVendor(data: any) {
    console.log(data.value)
    for (let index = 0; index < this.allVendor.length; index++) {
      const vendor = this.allVendor[index]
      if (vendor.vendor_name == data.value) {
        this.vendorUserForm.value.vendor_id = vendor.vendor_code
        this.selectedVendorId = vendor.vendor_code
        //this.stateVendorName = vendor.vendor_name
        // this.vendorUserForm.value.vendorName = vendor.vendor_name
      }
    }
  }

  callUploadInput() {
    this.csvFile.nativeElement.click()
  }

  fileCsvUpload(files: any) {
    if (files.length === 0) return
    var mimeType = files[0].type
    if (mimeType !== 'application/pdf') {
      this.toastr.error(
        'File type not supported, upload a PDF file',
        `Upload Error`,
      )
      return
    }

    this.selectedPdfName = files[0].name
    this.pdfChecker = true
    this.csvDataFile = files
    this.pdfErrorMsg = false
  }

  uploadPromotionalFlyer() {
    this.btnLoader = true
    this.btnText = false
    if (this.vendorUserForm.status == 'VALID' && this.pdfChecker) {
      let fd = new FormData()
      fd.append('pdf', this.csvDataFile[0])
      fd.append('vendor_id', this.selectedVendorId)
      fd.append('name', this.vendorUserForm.value.name)

      this.postData
        .uploadFile('/create-promotional-flier', fd)
        .then((result) => {
          this.btnLoader = false
          this.btnText = true
          if (result.status) {
            this.vendorUserForm.reset()
            this.selectedPdfName = ''

            this.toastr.success(result.message, `Success`)
          } else {
            this.toastr.error(
              'Somethin went wrong, Try again',
              `Uploading Error`,
            )
          }
        })
        .catch((err) => {
          this.csvBtnLoader = false
          this.csvBtnText = true

          this.toastr.error('Somethin went wrong, Try again', `Uploading Error`)
        })
    } else {
      this.pdfErrorMsg = true
      this.manualChecker = true
    }
  }

  buildDealerForm(): void {
    this.vendorUserForm = this.fb.group({
      name: ['', [Validators.required]],
      pdf: [''],
      image_url: [''],
      vendor: ['', Validators.required],
    })
  }

  submit() {
    console.log(this.vendorUserForm.value)
    console.log(this.vendorUserForm.status)
    if (this.vendorUserForm.status == 'VALID') {
      this.vendorUserForm.value.vendorName = this.stateVendorName
      this.btnText = false
      this.btnLoader = true
      this.postData
        .httpPostRequest('/register-vendor-users', this.vendorUserForm.value)
        .then((result: any) => {
          console.log(result)
          this.btnText = true
          this.btnLoader = false

          if (result.status) {
            this.vendorUserForm.reset()
            this.vendorUserForm.value.vendor = 'Select Vendor'
            this.toastr.success(
              'Dealer Added Successful',
              `New Dealer has been added`,
            )
          } else {
            this.toastr.error(result.message, 'Try again')
          }
        })
        .catch((err) => {
          this.btnText = true
          this.btnLoader = false
          this.toastr.error('Try again', 'Something went wrong')
        })
    } else {
      this.manualChecker = true
    }
  }

  get vendorUserFormControls() {
    return this.vendorUserForm.controls
  }

  getErrorMessage(instance: string) {
    if (
      instance === 'name' &&
      this.vendorUserFormControls.name.hasError('required')
    ) {
      return 'enter the name'
    }

    if (
      instance === 'vendor' &&
      this.vendorUserFormControls.vendor.hasError('required')
    ) {
      return 'select the vendor'
    }

    if (instance === 'pdf') {
      return 'select the pdf docs'
    }

    return
  }
}
