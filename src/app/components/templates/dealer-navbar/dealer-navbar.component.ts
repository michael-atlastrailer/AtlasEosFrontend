import { TokenStorageService } from 'src/app/core/services/token-storage.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { HttpRequestsService } from 'src/app/core/services/http-requests.service';
import { ChatService } from 'src/app/core/services/chat.service';

declare var $: any;
@Component({
  selector: 'app-dealer-navbar',
  templateUrl: './dealer-navbar.component.html',
  styleUrls: ['./dealer-navbar.component.scss'],
})
export class DealerNavbarComponent implements OnInit {
  @ViewChild('overlay') overlay!: ElementRef;
  toggle = true;
  search = '';
  firstName!: string;
  lastName!: string;
  acct!: string;
  company!: string;
  location!: string;
  greetingStatus = true;
  dealerToVendorSwitch = false;
  k = true;

  timeSeconds = 59;
  timeDays = 0;
  timeHours: number = 24;
  timeMinutes: number = 59;
  interval: any;

  checkerInterval: any;
  startCounterChecker: any;
  countDownTimer: any;

  countDownData: any;

  initalDays: number = 0;
  initalHours: number = 0;
  initalMinutes: number = 0;
  initalSeconds: number = 0;

  showSecondsExtrazero = false;

  testStartTimer!: number;
  testStopTimer!: number;
  testTimeLeft!: number;
  starterTimerTimestamp!: number;
  endTimer = '';
  endTimerStamp!: number;
  initalEndTime: any;
  initalStartTime: any;
  ngOnInit(): void {
    this.getData();
    this.dealerData = this.tokenStorage.getUser();
    this.getUnreadMsg();
    this.getUnreadReportProblem();

    setInterval(() => {
      this.getUnreadReportProblem();
      this.getUnreadMsg();
    }, 10000);

    this.chatService.getNotification().subscribe((data: any) => {
      this.getUnreadMsg();
    });
  }

  unreadMsgCount = 0;
  dealerData: any;
  unreadReplyCounter = 0;
  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService,
    private getHttpData: HttpRequestsService,

    private chatService: ChatService
  ) {
    this.getProgramCountDown();

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        console.log(
          'detected route change',
          event.url,
          event?.url?.split('/'),
          event?.url?.split('/')[2],
          event?.url?.split('/')[2] == 'search'
        );
        this.greetingStatus = false;

        let currUrl = event?.url?.split('/');
        if (!(currUrl[2] == 'search')) {
          console.log('matches cond');
          this.search = '';
        }
      }
    });
    if (this.tokenStorage.checkSwitch()) {
      if (this.tokenStorage.getSwitchType() == 'vendor-to-dealer') {
        this.dealerToVendorSwitch = true;
      } else {
        this.dealerToVendorSwitch = false;
      }
    }
  }

  switchToVendor() {
    this.tokenStorage.switchFromDealerToVendor();
    this.router.navigate(['/vendors/dealer-switch']);
  }

  getUnreadReportProblem() {
    this.getHttpData
      .httpGetRequest('/dealer/unread-report-reply/' + this.dealerData.id)
      .then((result: any) => {
        if (result.status) {
          this.unreadReplyCounter = result.data;
        }
      })
      .catch((err) => {});
  }

  getUnreadMsg() {
    this.getHttpData
      .httpGetRequest('/chat/count-unread-msg/' + this.dealerData.id)
      .then((result: any) => {
        if (result.status) {
          this.unreadMsgCount = result.data;
        }
      })
      .catch((err) => {});
  }
  refresher() {
    let initUrl = this.router.url
    let currentUrl = this.router.url.split('/')[2]
  
    console.log(currentUrl, 'current utl', currentUrl == 'show-orders');
    if (currentUrl == "show-orders") {
      // this.router.navigate([ `/dealers/show-orders/`]);
      window.location.reload()
    }
}
  closeOverLay() {
    const query = window.matchMedia('(max-width: 700px)');
    if (query.matches) {
      this.overlay.nativeElement.click();
    }
  }
  toggleSideNav() {
    this.toggle = !this.toggle;
  }
  logout() {
    // this.tokenStorage.signOut();
    return this.router.navigate(['/']);
  }

  getData() {
    let data = this.tokenStorage.getUser();
    // console.log(data);
    this.firstName = data.first_name;
    this.lastName = data.last_name;
    this.company = data.company_name;

    this.acct = data.account_id;
    this.location = data.location;
  }
  searchData() {
    console.log('hehheh');
    if (this.search != '') {
      this.router.navigate(['dealers/search/' + this.search]);
    }
  }
  arrangeTimer(data: any) {
    let initalDays = data.days;
    let initalHours = data.hours;
    let initalMinutes = data.minutes;
    let initalSeconds = data.seconds;
    this.timeDays = data.days;

    if (data.hours > 24) {
      this.timeHours = 24;
    } else {
      this.timeHours = data.hours;
    }

    if (data.minutes > 59) {
      this.timeMinutes = 59;
    } else {
      this.timeMinutes = data.minutes;
    }

    if (data.seconds > 59) {
      this.timeSeconds = 59;
    } else {
      this.timeSeconds = data.seconds;
    }
  }

  startTimer(data: any) {
    let initalDays = data.days;
    let initalHours = data.hours;
    let initalMinutes = data.minutes;
    let initalSeconds = data.seconds;
    this.timeDays = data.days;

    if (data.hours < 1) {
      this.timeHours = 0;
    } else {
      if (data.hours > 24) {
        this.timeHours = 23;
      } else {
        this.timeHours = data.hours;
      }
    }

    if (data.minutes > 59) {
      this.timeMinutes = 59;
    } else {
      this.timeMinutes = data.minutes;
    }

    if (data.seconds != 0) {
      if (data.seconds > 59) {
        this.timeSeconds = 59;
      } else {
        this.timeSeconds = data.seconds;
      }
    } else {
      this.timeSeconds = data.seconds;
    }

    this.interval = setInterval(() => {
      if (this.timeSeconds > 0) {
        this.timeSeconds--;
      } else {
        if (data.seconds != 0) {
          this.timeSeconds = 59;
        }

        if (this.timeMinutes < 1 && this.timeHours != 0) {
          this.timeMinutes = 59;
          this.timeHours--;
        }

        if (this.timeHours < 1 && this.timeDays != 0) {
          this.timeDays--;
          this.timeHours = 23;
        }

        if (this.timeMinutes > 0) {
          this.timeMinutes--;
        }
      }

      if (
        this.timeSeconds == 0 &&
        this.timeMinutes == 0 &&
        this.timeHours == 0 &&
        this.timeDays == 0
      ) {
        this.pauseTimer();
      }

      let stringSeconds = this.timeSeconds;
      let conventerStringSeconds = stringSeconds.toString();
      console.log(conventerStringSeconds.length);
      if (conventerStringSeconds.length == 1) {
        this.showSecondsExtrazero = true;
      } else {
        this.showSecondsExtrazero = false;
      }
    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  stopCountdownTimer() {
    clearInterval(this.countDownTimer);
  }

  startCheckerFund() {
    this.checkerInterval = setInterval(() => {
      let dd = new Date();
      let currentTime = dd.getTime();
      let dateInstance = new Date(this.initalStartTime);
      let intialStartTimer = dateInstance.getTime();

      if (currentTime >= intialStartTimer) {
        this.stopCounterChecker();
        this.startCountDownTimer();
      } else {
      }
    }, 1000);
  }

  stopCounterChecker() {
    clearInterval(this.checkerInterval);
  }

  startCountDownTimer() {
    this.countDownTimer = setInterval(() => {
      let dd: any = new Date();
      let curTimer = dd.getTime();
      let createDate = new Date(this.initalEndTime);
      let endIntilaTime = createDate.getTime();

      // console.log(curTimer)

      let endTime = Date.parse(this.endTimer) / 1000;
      let now: any = new Date();
      now = Date.parse(now) / 1000;

      var timeLeft = endTime - now;

      var days: any = Math.floor(timeLeft / 86400);
      var hours: any = Math.floor((timeLeft - days * 86400) / 3600);
      var minutes: any = Math.floor(
        (timeLeft - days * 86400 - hours * 3600) / 60
      );
      var seconds: any = Math.floor(
        timeLeft - days * 86400 - hours * 3600 - minutes * 60
      );

      if (hours < '10') {
        hours = '0' + hours;
      }
      if (minutes < '10') {
        minutes = '0' + minutes;
      }
      if (seconds < '10') {
        seconds = '0' + seconds;
      }

      if (endIntilaTime < curTimer) {
        this.stopCountdownTimer();
        $('#days').html('0' + '<span> </span>');
        $('#hours').html('00' + '<span> </span>');
        $('#minutes').html('00' + '<span> </span>');
        $('#seconds').html('00' + '<span> </span>');
      } else {
        $('#days').html(days + '<span> </span>');
        $('#hours').html(hours );
        $('#minutes').html(minutes);
        $('#seconds').html(seconds );
      }
    }, 1000);
  }

  getProgramCountDown() {
    this.getHttpData
      .httpGetRequest('/get-countdown')
      .then((result: any) => {
        if (result.status) {
          this.countDownData = result.data;
          this.endTimer = result.data.inital_end_timer;
          this.initalEndTime = result.data.inital_end_timer;
          this.initalStartTime = result.data.real_start_timer;
          console.log(this.initalStartTime);
          // let dd = new Date(this.endTimer)
          // let fp = dd.getTime()
          // console.log(fp, 'seconse')
          // console.log(dd, 'fulll data nd time')
          // console.log(new Date().getTime())
          ////this.startTimeMe = result.

          this.endTimerStamp = result.data.end_timer_timestamp;
          this.starterTimerTimestamp = result.data.start_timer_timestamp;

          this.startCheckerFund();
        } else {
        }
      })
      .catch((err: any) => {
        ///this.loader = false
      });
  }
}
