import { Component, OnInit } from '@angular/core';
import {CommandService} from '../services/command.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers:[CommandService]
})
export class HomeComponent implements OnInit {
  public arg = 'off';
  public status :string;
  public comp : number;
  public intensity: number;
  constructor(private _httpService: CommandService) { }

  ngOnInit() {
    this.toggleLED();
    this.photoresistor();
  }

  photoresistor(){
    this._httpService.getPhotoresistor()
      .subscribe(
        data => {console.log(data); this.intensity=data.result;},
        error => this.comp=error.return_value
      );
  }

  toggleLED(){
    this._httpService.toggleLed(this.arg)
      .subscribe(
        data => {console.log(data); this.comp=data.return_value;this.validar(this.comp)},
        error => this.comp=error.return_value
      );

  }
  validar(val){
    if(val==0){
      this.status='off';
    }
    if(val==1){
      this.status= 'on';
    }
    if(val==-1){
      this.status= 'ERROR';
    }
  }

}
