import { Component, ChangeDetectionStrategy , OnInit, OnChanges,
  Inject, trigger, Input, state, style, transition, animate,ElementRef } from '@angular/core';
import {CommandService} from '../services/command.service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[CommandService],
  animations: [
    trigger('formChanged', [
      state('true' , style({ opacity: 1, transform: 'translateX(0%) scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'translateX(-100%) scale(0.0)'  })),
      transition('1 => 0',[
        animate('400ms')
      ]),
      transition('0 => 1',[
        animate('400ms')
      ])
    ]),
    trigger('infoChanged', [
      state('true' , style({ opacity: 1, transform: 'translateX(0%) scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'translateX(100%) scale(0.0)'  })),
      transition('1 => 0',[
        animate('400ms')
      ]),
      transition('0 => 1',[
        animate('400ms ')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {
  public arg = 'off';
  public status :string;
  public comp : number;
  public intensity: number;
  public formulario:boolean = true;
  public info : boolean = false;
  public sep:number = 5;
  public diam: number = 30;
  public niv:number = 1;
  public vol : number=0;
  public lado : number = 30;
  public diam1 : number =20;
  public diam2 : number =30;
  public forma : string = "Cilindro";
  public lastH:string;
  public historial : number[];
  constructor(private _httpService: CommandService) { }

  ngOnInit() {
    // this.toggleLED();
    this.infoGeneral();
    this.eventos();
    this.getNivel();
    this.recalc();
    let timer = Observable.timer(5000,5000);
    timer.subscribe(t=>this.getNivel());
  }
  getNivel(){
    this._httpService.getNivel()
      .subscribe(
        data => {console.log(data);this.niv=data.result;},
        error => console.log(error)
      );
  }
  infoGeneral(){
    this._httpService.infoGen()
      .subscribe(
        data => {console.log(data);this.status=data.connected; this.lastH=data.last_heard;},
        error => console.log(error)
      );
  }
  eventos(){
    this._httpService.getEvents()
      .subscribe(
        data => {console.log(data); this.recolecta(data);},
        error => console.log(error)
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
    data.feeds
  }

  // toggleLED(){
  //   this._httpService.toggleLed(this.arg)
  //     .subscribe(
  //       data => {console.log(data); this.comp=data.return_value;this.validar(this.comp)},
  //       error => this.comp=error.return_value
  //     );
  //
  // }


}
