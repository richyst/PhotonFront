import { Component, ChangeDetectionStrategy , OnInit, OnChanges, Inject } from '@angular/core';
import {CommandService} from '../services/command.service';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[CommandService]
})
export class HomeComponent implements OnInit {
  public formulario : boolean =true;
  public status :string;
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
  public niveles = [];
  public axis=[];
  public fechas=[];
  public fechasOri=[];
  public ticks:number;
  public events : boolean;
  public formatoHora:string;
  public tamCom : string;
  public tamComR : string;
  public comp :boolean;
  public line = 'line';
  public volumenData: Array<any>= [
    {
      data:this.historial,
      label: 'Volumen de Agua (litros)'
    }
  ];
  public nivelesData: Array<any>= [
    {
      data:this.niveles,
      label: 'Nivel de Agua'
    }
  ];
  public lineChartData2: Array<any>= [
    {
      data:this.niveles,
      label: 'Nivel de Agua'
    },
    {
      data:this.historial,
      label: 'Volumen de Agua (litros)'
    }
  ];
  public FechaExOptions:any = {
    responsive: true,
    scales:{
      yAxes:[{
        ticks:{
          beginsAtZero:true
        }
      }],
      xAxes:[{
        ticks:{
          fontSize:9,
          minRotation:75
        }
      }]
    },
    legend:{
      display:true
    }
  };
  public nivelesOptions:any = {
    responsive: true,
    scales:{
      yAxes:[{
        ticks:{
          beginsAtZero:true,
          max:7,
        }
      }]
    }
  };
  public volumenOptions:any = {
    responsive: true,
    scales:{
      yAxes:[{
        ticks:{
          beginsAtZero:true,
          min:0
        }
      }]
    }
  };
  public gris:Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public azul:Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(150,243,255,0.2)',
      borderColor: 'rgba(0,188,212,1)',
      pointBackgroundColor: 'rgba(53,186,204,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public mezclados:Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(150,243,255,0.2)',
      borderColor: 'rgba(0,188,212,1)',
      pointBackgroundColor: 'rgba(53,186,204,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  constructor(private _httpService: CommandService) { }

  ngOnInit() {
    this.comp=false;
    this.tamCom='col-xs-12'
    this.formatoHora='FechaExacta';
    this.sep= 5;
    this.diam= 30;
    this.niv=1;
    this.diam1=25;
    this.diam2=30;
    this.forma='Cilindro';
    let timer = Observable.timer(0,5000);
    timer.subscribe(t=>{this.infoGeneral();this.ticks=t;});
    let timer1 = Observable.timer(0,15000);
    timer1.subscribe(t=>{this.eventos(); });
  }
  getNivel():void{
    if(this.status){
      this._httpService.getNivel()
        .subscribe(
          data => {
            // console.log(data);
            this.niv=data.result;
          },
          error => console.log(error)
        );
    }else{
      console.log("Photon desconectado");
    }

  }
  infoGeneral():void{
    this._httpService.infoGen()
      .subscribe(
        data => {
          // console.log(data);
          this.status=data.connected;
          this.lastH=data.last_heard;
          this.getNivel();
        },
        error => console.log(error)
      );
  }
  eventos():void{
    this._httpService.getEvents()
      .subscribe(
        data => {
          // console.log(data);
          this.recolecta(data);
          this.events=true;
        },
        error => {console.log(error);this.events=false;}
      );
  }

  calc(niv) : number{
    var volumen;
    if(this.forma=='Cilindro'){
        volumen=((3.141592)*((this.diam/2)*(this.diam/2)*(this.sep*niv)))*.001;
    }
    if(this.forma=='Prisma'){
        volumen=(this.lado*this.lado)*(this.sep*niv)*.001;
    }
    if(this.forma=='Cono'){
        volumen=((3.141592*(niv*this.sep))/3)*(((this.diam2/2)*(this.diam2/2))+((this.diam1/2)*(this.diam2/2))+((this.diam/2)*(this.diam/2)))*.001;
    }
    return volumen;

  }
  comparar(val:number):void{
    if(val==0){
      this.tamCom='col-xs-12';
      this.tamComR='col-xs-12';
      this.comp=false;
    }
    if(val==1){
      this.tamCom='col-xs-6 division' ;
      this.tamComR='col-xs-6';
      this.comp=true;
    }
  }

  recolecta(data):void{
    for(var i = 0;i<data.feeds.length;i++){
      var num = i+1;
      this.axis[i]=('X'+num);
      this.parseoFechas("la");
      if(this.formatoHora=='FechaExacta'){
        this.fechas[i]=((new Date(Date.parse(data.feeds[i].created_at))).getDate())
        + '/'
        +((new Date(Date.parse(data.feeds[i].created_at))).getFullYear()).toString().slice(2,4)
        +'-'+
        ((new Date(Date.parse(data.feeds[i].created_at))).getHours())
        +':'+
        ((new Date(Date.parse(data.feeds[i].created_at))).getMinutes());
      }
      if(this.formatoHora=='Estacion'){
        this.fechas[i]=((new Date(Date.parse(data.feeds[i].created_at))).getDate())
        + '/'
        +((new Date(Date.parse(data.feeds[i].created_at))).getFullYear()).toString().slice(2,4)
        +'-'+
        ((new Date(Date.parse(data.feeds[i].created_at))).getHours())
        +':'+
        ((new Date(Date.parse(data.feeds[i].created_at))).getMinutes());
      }

      this.historial[i]=(this.calc(parseInt(data.feeds[i].field1)));
      this.niveles[i]=(parseInt(data.feeds[i].field1));

    }
    console.log(this.fechas);
  }

  parseoFechas(tipo): void{
    if(tipo=='Ano'){

    }
    if(tipo=='Mes'){

    }
    if(tipo=='Dia'){

    }
  }
}
