import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-grafica',
  templateUrl: './grafica.component.html',
  styleUrls: ['./grafica.component.css']
})
export class GraficaComponent implements OnInit {
  @Input() data:Array<any>;
  @Input() options:Array<any>;
  @Input() colors:Array<any>;
  @Input() labels:Array<any>;
  @Input() tipo:string;
  constructor() { }

  ngOnInit() {
  }

}
