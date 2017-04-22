import { Component, ChangeDetectionStrategy , OnInit, OnChanges, Inject } from '@angular/core';
import {trigger, state,animate,style,transition} from '@angular/animations';
import {CommandService} from '../services/command.service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[CommandService],
  animations:[
    trigger('datos', [
      state('true' , style({ opacity: 1, transform: 'translateX(0%)' })),
      state('false', style({ opacity: 0, transform: 'translateX(-100%)'  })),
      transition('1 <=> 0',
        animate(400)
      )
    ]),
    trigger('info', [
      state('true' , style({ opacity: 1, transform: 'translateX(100%)' })),
      state('false', style({ opacity: 0, transform: 'translateX(100%)'  })),
      transition('1 <=> 0',
        animate(400)
      )
    ])
  ]
})
export class HomeComponent implements OnInit {
  public status :string;
  public formulario:boolean;
  public info : boolean;
  public sep: number;
  public diam: number;
  public niv: number;
  public vol : number;
  public lado : number;
  public diam1 : number;
  public diam2 : number;
  public forma:string;
  public lastH:string;
  public historial=[];
  public axis=[];
  public events : boolean;
  constructor(private _httpService: CommandService) { }

  ngOnInit() {
    this.formulario=true;
    this.info=false;
    this.sep= 5;
    this.diam= 30;
    this.niv=1;
    this.diam1=25;
    this.diam2=30;
    this.forma='Cilindro';

    this.infoGeneral();
    this.eventos();
    this.recalc();
  }
  getNivel(){
    if(this.status){
      this._httpService.getNivel()
        .subscribe(
          data => {console.log(data);this.niv=data.result;},
          error => console.log(error)
        );
    }else{
      console.log("Photon desconectado");
    }

  }
  infoGeneral(){
    this._httpService.infoGen()
      .subscribe(
        data => {
          console.log(data);this.status=data.connected;
          this.lastH=data.last_heard;
          let timer = Observable.timer(5000,5000);
          timer.subscribe(t=>this.getNivel());
        },
        error => console.log(error)
      );
  }
  eventos(){
    this._httpService.getEvents()
      .subscribe(
        data => {console.log(data); this.recolecta(data);this.events=true;},
        error => {console.log(error);this.events=false;}
      );
  }
  recalc(){
    if(this.forma=='Cilindro'){
        this.vol=((3.141592)*((this.diam/2)*(this.diam/2)*(this.sep*this.niv)))*.001;
    }
    if(this.forma=='Prisma'){
        this.vol=(this.lado*this.lado)*(this.sep*this.niv)*.001;
    }
    if(this.forma=='Cono'){
        this.vol=((3.141592*(this.niv*this.sep))/3)*(((this.diam2/2)*(this.diam2/2))+((this.diam1/2)*(this.diam2/2))+((this.diam/2)*(this.diam/2)))*.001;
    }

  }
  recolecta(data){
    for(var i = 0;i<data.feeds.length;i++){
      this.historial.push(parseInt(data.feeds[i].field1));
      this.axis.push(i+1);
    }
    console.log(this.historial);
    console.log(this.axis);
  }
}
