import { ActivatedRoute } from '@angular/router';
import { AppService } from './../../../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { SelectDatabase } from '../database';

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss'],
})
export class QueryComponent implements OnInit {
  public inputCommand: string = '';
  public databaseResult: any = null;
  public selectDB: string = '';
  public queryResult: any = null;

  constructor(public service: AppService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((val) => {
      if (val.get('dbname')) {
        SelectDatabase.setDatabase(val.get('dbname'));
      }
    });
    this.inputCommand = SelectDatabase.getCommand();
    this.databaseResult = SelectDatabase.getdatabaseResult();
    this.selectDB = SelectDatabase.getDatabase();
  }

  public setCommand = () => {
    SelectDatabase.setCommand(this.inputCommand);
  };

  public onSelectedDB = () => {
    SelectDatabase.setDatabase(this.selectDB);
  };

  public onQuery = () => {
    this.service
      .httpPost(
        `/exdatabase/simquery?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify({
          sqldatabase: SelectDatabase.getDatabase(),
          sqlquery: this.inputCommand,
        })
      )
      .then((value: any) => {
        if (value.success) {
          this.queryResult = value.result;
          console.log(this.queryResult);
        } else {
        }
      });
  };

  public getKeyObject = (array) => {
    if (array.length > 0) {
      let ObjectData = [...array];
      return Object.keys(ObjectData[0]);
    } else if (typeof array == 'object') {
      return Object.keys(array);
    } else {
      return [];
    }
  };
}
