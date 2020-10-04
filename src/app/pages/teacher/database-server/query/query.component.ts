import { ActivatedRoute } from '@angular/router';
import { AppService } from './../../../../services/app.service';
import { Component, OnInit } from '@angular/core';
import { SelectDatabase } from '../database';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

const _window: any = window;

interface FoodNode {
  name: string;
  children?: FoodNode[];
}

@Component({
  selector: 'app-query',
  templateUrl: './query.component.html',
  styleUrls: ['./query.component.scss'],
})
export class QueryComponent implements OnInit {
  public dbSelected: string = '';
  public tbSelected: string = '';
  public dataInTable: any = null;
  public sqlCommand: string = '';
  public pagiShowdatabase: number = 1;
  public aceEditor: any = null;

  treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();

  constructor(public service: AppService, private route: ActivatedRoute) {}

  hasChild = (_: number, node: FoodNode) =>
    !!node.children && node.children.length > 0;

  ngOnInit() {
    // if (SelectDatabase.getdatabaseResult() == null)
    //   this.service.navRouter('/database/view');
    // this.route.paramMap.subscribe((val) => {
    //   if (val.get('dbname')) {
    //     SelectDatabase.setDatabase(val.get('dbname'));
    //   }
    // });
    // this.inputCommand = SelectDatabase.getCommand();
    // this.databaseResult = SelectDatabase.getdatabaseResult();
    // this.dbSelected = SelectDatabase.getDatabase();
    // this.tbSelected = SelectDatabase.getTbResult();
    // this.dataInTable = SelectDatabase.getdatabaseResult();
    this.getDatabase();

    _window.ace.require('ace/ext/language_tools');
    this.aceEditor = _window.ace.edit('queryTest');

    this.aceEditor.session.setMode('ace/mode/sql');
    this.aceEditor.setTheme('ace/theme/tomorrow');
    this.aceEditor.setOptions({
      enableBasicAutocompletion: true,
      enableSnippets: true,
      enableLiveAutocompletion: true,
    });
  }

  private getDatabase = () => {
    this.service
      .httpGet(
        `/exdatabase/getall/${
          this.service.localStorage.get('userLogin')['uid']
        }?token=${this.service.localStorage.get('userLogin')['token']}`
      )
      .then((val: any) => {
        let data = [];
        let children = [];
        if (val.result) {
          val.result.forEach((list: any) => {
            if (list.status == '1') {
              children = [];
              if (list.table_name.length > 0) {
                list.table_name.split(',').forEach((tb_name) => {
                  children.push({ name: tb_name });
                });

                data.push({ name: list.database_name, children: children });
              }
            }
          });

          this.dataSource.data = data;
          console.log(this.dataSource);
        }
      });
  };

  public selectTable = (db_name: string, tb_name: string) => {
    this.dbSelected = db_name;
    this.tbSelected = tb_name;
    this.dataInTable = null;

    SelectDatabase.setDatabase(this.dbSelected);
    SelectDatabase.setTbResult(this.tbSelected);

    this.service
      .httpGet(
        `/exdatabase/getdata/${db_name}/${tb_name}?token=${
          this.service.localStorage.get('userLogin')['token']
        }`
      )
      .then((value: any) => {
        if (value.success) {
          this.dataInTable = value.result;
          SelectDatabase.setdatabaseResult(this.dataInTable);
        } else {
          this.dataInTable = null;
          this.service.showAlert('', value.message, 'error');
        }
      });
  };

  // public setCommand = () => {
  //   SelectDatabase.setCommand(this.inputCommand);
  // };

  // public onSelectedDB = () => {
  //   SelectDatabase.setDatabase(this.selectDB);
  // };

  public onQuery = () => {
    this.dataInTable = null;
    this.service
      .httpPost(
        `/exdatabase/simquery?token=${
          this.service.localStorage.get('userLogin')['token']
        }`,
        JSON.stringify({
          sqldatabase: this.dbSelected,
          sqlquery: this.aceEditor.getValue(),
        })
      )
      .then((value: any) => {
        if (value.success) {
          this.dataInTable = value.result;
        } else {
          this.dataInTable = null;
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
