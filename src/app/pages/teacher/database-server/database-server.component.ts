import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-database-server',
  templateUrl: './database-server.component.html',
  styleUrls: ['./database-server.component.scss'],
})
export class DatabaseServerComponent implements OnInit {
  constructor(public service: AppService) {}

  ngOnInit() {}
}
