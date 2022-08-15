import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { HttpRequestsService } from 'src/app/core/services/http-requests.service'
import { TokenStorageService } from 'src/app/core/services/token-storage.service'
declare var $: any

@Component({
  selector: 'app-report-problem',
  templateUrl: './report-problem.component.html',
  styleUrls: ['./report-problem.component.scss'],
})
export class ReportProblemComponent implements OnInit {
  @ViewChild('subject') subject!: ElementRef
  @ViewChild('photo') photo!: ElementRef
  @ViewChild('description') description!: ElementRef
  @ViewChild('resetForm') resetForm!: ElementRef
  imgData: any
  imgURL2: any
  formError = false
  uploadedFile: any
  formLoader = false
  responseError: any
  responseSuccess: any
  FileSelected = 'false'

  constructor(
    private token: TokenStorageService,
    private postData: HttpRequestsService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {}
  fileUpload() {
    this.FileSelected = 'true'
    this.uploadedFile = this.photo.nativeElement?.files[0]
    let fileSize = this.uploadedFile.size
    let toMb = fileSize / 1048576

    if (toMb > 5) {
      this.toastr.error('Maximum file size is 5Mb', 'Upload Error')
    }
  }

  submitCaller() {
    switch (this.FileSelected) {
      case 'true':
        let fileSize = this.uploadedFile.size
        let toMb = fileSize / 1048576
        if (toMb < 5) {
          this.submitReport()
        } else {
          this.toastr.error('Maximum file size is 5Mb', 'Upload Error')
        }

        break

      case 'false':
        this.submitReport()
        break

      default:
        break
    }
  }

  submitReport() {
    // let goodToGo = false
    // let fileSize = this.uploadedFile.size
    // let toMb = fileSize / 1048576

    this.formLoader = false
    this.responseError = false
    this.responseSuccess = false
    let sub = this.subject.nativeElement.value!
    let desc = this.description.nativeElement.value!
    let img = this.uploadedFile!
    if (sub && desc) {
      this.formLoader = true
      this.formError = false
      let formData = {
        subject: sub,
        description: desc,
        photo: img,
        user_id: this.token.getUser().id,
        role: '4',
        dealer_id: this.token.getUser().account_id,
      }
      this.postData
        .httpPostRequest('/create-report', formData)
        .then((result: any) => {
          this.formLoader = false
          if (result.status) {
            console.log('result', result, this.responseSuccess)
            this.responseSuccess = true
            this.subject.nativeElement.value = ''
            this.description.nativeElement.value = ''
            this.photo.nativeElement.value = ''

            $('html, body').animate(
              { scrollTop: $('.app-content').offset().top },
              '500',
            )
          } else {
            let error = result.message.response
            {
              error.photo &&
                this.toastr.error(`${error.photo}`, `Something went wrong`)
            }
            {
              error.subject &&
                this.toastr.error(`${error.subject}`, `Something went wrong`)
            }
            {
              error.description &&
                this.toastr.error(
                  `${error.description}`,
                  `Something went wrong`,
                )
            }
            console.log('result else', result)
          }
        })
        .catch((err) => {
          let error = err.message.response
          console.log('erroror', err)
          {
            error.photo &&
              this.toastr.error(`${error.photo}`, `Something went wrong`)
          }
          {
            error.subject &&
              this.toastr.error(`${error.subject}`, `Something went wrong`)
          }
          this.toastr.error('', `Something went wrong`)
          this.formLoader = false
        })
    } else {
      this.formLoader = false
      this.formError = true
      console.log('else info', sub, desc, img)
    }
  }
}
