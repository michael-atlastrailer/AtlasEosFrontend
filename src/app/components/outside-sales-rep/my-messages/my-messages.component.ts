import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-my-messages',
  templateUrl: './my-messages.component.html',
  styleUrls: ['./my-messages.component.scss'],
})
export class MyMessagesComponent implements OnInit {
  tableView = true
  loader = false
  constructor() {}

  ngOnInit(): void {}
}
