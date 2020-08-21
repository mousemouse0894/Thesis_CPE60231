import { Component, OnInit } from '@angular/core';
import { SelectDatabase } from './database';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-database-server',
  templateUrl: './database-server.component.html',
  styleUrls: ['./database-server.component.scss'],
})
export class DatabaseServerComponent implements OnInit {
  public selectDatabase = SelectDatabase;

  constructor(public service: AppService) {}

  ngOnInit() {}
}
