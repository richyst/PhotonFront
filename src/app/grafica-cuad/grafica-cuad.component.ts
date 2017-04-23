import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-grafica-cuad',
  templateUrl: './grafica-cuad.component.html',
  styleUrls: ['./grafica-cuad.component.css']
})
export class GraficaCuadComponent implements OnInit {
  @Input() data:Array<any>;
  @Input() options:Array<any>;
  @Input() colors:Array<any>;
  @Input() labels:Array<any>;
  @Input() tipo:string;
  constructor() { }

  ngOnInit() {
  }

}
