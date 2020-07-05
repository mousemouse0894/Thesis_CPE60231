import { AppService } from './../../../services/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-database-server',
  templateUrl: './database-server.component.html',
  styleUrls: ['./database-server.component.scss']
})
export class DatabaseServerComponent implements OnInit {
  public databaseResult:any =null;
  public tableResult:any = null;
  public Dataintable:any =null
  public selectDatabase:any = null;
  constructor(public service:AppService) { }

  ngOnInit() {
      this.onGetdatabse();
  }

  public onGetdatabse = () =>{
    this.service.httpGet(`/exdatabase/show?token=${this.service.localStorage.get('userLogin')['token']}`).then((value:any)=>{
        if(value.success){
            this.databaseResult = value.result
            // console.log(this.databaseResult)

        }else{
            this.service.showAlert('',value.message,'error')
        }
    })
  }

  public onGettable = (Database:any) =>{
    this.selectDatabase = Database;
        this.service.httpGet(`/exdatabase/table/${Database}?token=${this.service.localStorage.get('userLogin')['token']}`).then((value:any)=>{
            if(value.success){
              this.tableResult =value.result
              console.log(this.tableResult);
            }else{
              this.service.showAlert('',value.message,'error');
            }
        })
  }

  public onGetDataintable = (table_name:any) => {
    this.service.httpGet(`/exdatabase/getdata/${this.selectDatabase}/${table_name}?token=${this.service.localStorage.get('userLogin')['token']}`).then((value:any) =>{
      if(value.success){
          this.Dataintable= value.result;
          console.log(this.Dataintable)
      }else{
          this.service.showAlert('',value.message,'error')
      }
    })
  }

  public getKeyObject = array => {
    if (array.length > 0) {
      let ObjectData = [...array];
      return Object.keys(ObjectData[0]);
    } else if (typeof array == "object") {
      return Object.keys(array);
    } else {
      return [];
    }
  };

}
