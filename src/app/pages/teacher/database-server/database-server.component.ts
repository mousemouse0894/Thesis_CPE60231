import { Component, OnInit } from '@angular/core';
import { SelectDatabase } from './database';

@Component({
  selector: 'app-database-server',
  templateUrl: './database-server.component.html',
  styleUrls: ['./database-server.component.scss'],
})
export class DatabaseServerComponent implements OnInit {
  public selectDatabase = SelectDatabase;
  constructor() {}

  ngOnInit() {}
}
