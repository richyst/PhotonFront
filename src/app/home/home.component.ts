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
  // ----------- Datos formulario y Photon
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
  public realTime:boolean;
  // ---------- Datos Graficas
  public historial=[];
  public niveles = [];

  public decD:any;
  public decL:any;
  public decC:any;

  public valsA;
  public valsM;
  public valsS;
  public promA;
  public promM;
  public promS;
  public meses =[];
  public semanas=[];
  public dias =[];

  public refM=[
    'Ene','Feb','Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov','Dic'
  ];
  public refD=[
    'Dom','Lun','Mar', 'Mie','Jue','Vie','Sab'
  ]
  public fechas=[];
  public fechasOri=[];
  public events : boolean;
  public formatoHora:string;
  public line = 'line';
  public grafVar = 'bar';

  public actualizar:boolean=true;

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
  public comparacion: Array<any>= [
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
  public BarraOptions:any = {
    responsive: true,
    scaleShowVerticalLines: false,
    scales:{
      xAxes:[{
        ticks:{
          fontSize:12,
          minRotation:0
        }
      }]
    },
    legend:{
      display:false
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
  public barraAzul:Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(150,243,255,0.4)',
      borderColor: 'rgba(0,188,212,1)',
      borderWidth:1
    }
  ];
  public barraGris:Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.4)',
      borderColor: 'rgba(77,83,96,1)',
      borderWidth:1
    }
  ];
  public barraRoja:Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(255,109,109,0.4)',
      borderColor: 'rgba(255,109,109,1)',
      borderWidth:1
    }
  ];
  public barraVerde:Array<any> = [
    { // dark grey
      backgroundColor: 'rgba(179,255,109,0.4)',
      borderColor: 'rgba(179,255,109,1)',
      borderWidth:1
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
    this.realTime=true;
    this.formatoHora='FechaExacta';
    this.sep= 5;
    this.diam= 30;
    this.niv=1;
    this.diam1=25;
    this.diam2=30;
    this.lado=20;
    this.forma='Cilindro';
    let timer = Observable.timer(0,5000);
    timer.subscribe(t=>{this.infoGeneral();});
    let timer1 = Observable.timer(0,10000);
    timer1.subscribe(t=>{this.eventos(); });
    this.recalc();
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
      this.realTime=false;
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
    if(this.realTime){
      this.actualizar=false;
    }
    this._httpService.getEvents()
      .subscribe(
        data => {
          // console.log(data);
          this.recolecta(data);
          this.events=true;
          if(this.realTime){
            this.actualizar=true;
          }
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
  recalc():void{
      var volumen;
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

  graficasC():void{
    this.valsA=null;
    this.valsM=null;
    this.valsS=null;
    this.promA=null;
    this.promM=null;
    this.promS=null;
    this.meses =null;
    this.semanas=null;
    this.dias =null;

    this.valsA= new Array(0,0,0,0,0,0,0,0,0,0,0,0);
    this.valsM=new Array(0,0,0,0,0,0);
    this.valsS=new Array(0,0,0,0,0,0,0);

    this.promA= new Array(0,0,0,0,0,0,0,0,0,0,0,0);
    this.promM= new Array(0,0,0,0,0,0);
    this.promS= new Array(0,0,0,0,0,0,0);

    this.meses =[0,1,2,3,4,5,6,7,8,9,10,11];
    this.semanas=[0,1,2,3,4,5,6];
    this.dias =[0,1,2,3,4,5,6];
    var ahora = new Date().getTime();
    var prevM=100;

    for(var i = 0; i<this.historial.length;i++){
      if((ahora-this.fechasOri[i])<31536000000){
        var mes = new Date(this.fechasOri[i]).getMonth();
        this.valsA[mes]=this.valsA[mes]+1;
        this.promA[mes]=this.promA[mes]+this.historial[i];
      }
      if((ahora-this.fechasOri[i])<2629746000){
        if((ahora-this.fechasOri[i])<(2629746000*(i+1))){
          var semana = parseInt(''+new Date(this.fechasOri[i]).getDate()/6);
          this.valsM[semana]=this.valsM[semana]+1;
          this.promM[semana]=this.promM[semana]+this.historial[i];
        }
      }
      if((ahora-this.fechasOri[i])<604800000){
        var dia = parseInt(''+new Date(this.fechasOri[i]).getDay());
        this.valsS[dia]=this.valsS[dia]+1;
        this.promS[dia]=this.promS[dia]+this.historial[i];
      }
    }

    this.meses= this.meses.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    })
    this.semanas= this.semanas.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    })
    this.dias= this.dias.filter(function(elem, index, self) {
      return index == self.indexOf(elem);
    })

    var tmpM=this.meses;
    var tmpS=this.semanas;
    var tmpD=this.dias;
    this.meses =[];
    this.semanas=[];
    this.dias =[];
    var anoC = new Date(ahora).getFullYear();
    var mesC = new Date(ahora).getMonth();
    var semanaC = parseInt(''+new Date(ahora).getDate()/6);
    var diaC = new Date(ahora).getDay()

    for(var i = 0; i<this.valsA.length;i++){
      var mesCh = (mesC+13)%12;
      this.meses.push(mesCh);
      mesC++;
    }
    for(var i = 0; i<this.valsM.length;i++){
      var semCh = (semanaC+7)%6;
      this.semanas.push(semCh);
      semanaC++;
    }
    for(var i = 0; i<this.valsS.length;i++){
      var diaCh = (diaC+8)%7;
      this.dias.push(diaCh);
      diaC++;
    }

    var tmpAn=this.valsA;
    var tmpMe=this.valsM;
    var tmpSe=this.valsS;
    this.valsA=[];
    this.valsM=[];
    this.valsS=[];
    var tmpPA=this.promA;
    var tmpPM=this.promM;
    var tmpPS=this.promS;
    this.promA=[];
    this.promM=[];
    this.promS=[];

    for(var i = 0; i<this.meses.length;i++){
      this.valsA.push(tmpAn[this.meses[i]]);
      if(tmpAn[this.meses[i]]==0){
        this.promA.push(0);
      }else{
        this.promA.push(tmpPA[this.meses[i]]/tmpAn[this.meses[i]]);
      }
    }

    for(var i = 0; i<this.semanas.length;i++){
      this.valsM.push(tmpMe[this.semanas[i]]);
      if(tmpMe[this.semanas[i]]==0){
        this.promM.push(0);
      }else{
        this.promM.push(tmpPM[this.semanas[i]]/tmpMe[this.semanas[i]]);
      }
    }

    for(var i = 0; i<this.dias.length;i++){
      this.valsS.push(tmpSe[this.dias[i]]);
      if(tmpSe[this.dias[i]]==0){
        this.promS.push(0);
      }else{
        this.promS.push(tmpPS[this.dias[i]]/tmpSe[this.dias[i]]);
      }
    }

    for(var i = 0; i<this.meses.length;i++){
      this.meses[i]=this.refM[this.meses[i]];
    }
    for(var i = 0; i<this.semanas.length;i++){
      if(i==5){
        this.semanas[5]='Esta semana';
      }else{
        this.semanas[i]='Hace '+(5-i)+' semanas';
      }
    }
    for(var i = 0; i<this.dias.length;i++){
      if(i==6){
        this.dias[i]='Hoy';
      }else{
        this.dias[i]=this.refD[this.dias[i]];
      }
    }
  }

  recolecta(data):void{
    for(var i = 0;i<data.feeds.length;i++){
      var num = i+1;
      if((new Date(Date.parse(data.feeds[i].created_at))).getMinutes()<10){
        this.fechas[i]=((new Date(Date.parse(data.feeds[i].created_at))).getDate())
          + '/'
          +this.refM[(new Date(Date.parse(data.feeds[i].created_at))).getMonth()]
          +'/'
          +((new Date(Date.parse(data.feeds[i].created_at))).getFullYear()).toString().slice(2,4)
          +'-'+
          ((new Date(Date.parse(data.feeds[i].created_at))).getHours())
          +':0'+
          ((new Date(Date.parse(data.feeds[i].created_at))).getMinutes());
        this.fechasOri[i]=(new Date(Date.parse(data.feeds[i].created_at))).getTime();
        this.historial[i]=(this.calc(parseInt(data.feeds[i].field1)));
        this.niveles[i]=(parseInt(data.feeds[i].field1));
      }else{
        this.fechas[i]=((new Date(Date.parse(data.feeds[i].created_at))).getDate())
          + '/'
          +this.refM[(new Date(Date.parse(data.feeds[i].created_at))).getMonth()]
          +'/'
          +((new Date(Date.parse(data.feeds[i].created_at))).getFullYear()).toString().slice(2,4)
          +'-'+
          ((new Date(Date.parse(data.feeds[i].created_at))).getHours())
          +':'+
          ((new Date(Date.parse(data.feeds[i].created_at))).getMinutes());
        this.fechasOri[i]=(new Date(Date.parse(data.feeds[i].created_at))).getTime();
        this.historial[i]=(this.calc(parseInt(data.feeds[i].field1)));
        this.niveles[i]=(parseInt(data.feeds[i].field1));
      }
    }
    this.graficasC();
  }
}
