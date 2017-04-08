import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Command} from '../interfaces/command';

@Injectable()
export class CommandService {
  home= 'https://api.particle.io/v1/devices/';
  deviceID= '380036000247353137323334/';
  accessToken= 'access_token=32f5b42801184057fdfd9e4e3b64f0e981966bae';


  // https://api.particle.io/v1/devices/your-device-ID-goes-here/led?access_token=your-access-token-goes-here
  constructor(private _http: Http) { }

  toggleLed(command){
    let headers = new Headers({ 'Authorization': 'Bearer ' + '32f5b42801184057fdfd9e4e3b64f0e981966bae' });
    headers.append('Content-Type','application/json');
    return this._http.post(this.home+this.deviceID+'led', {"arg":command}, {headers: headers})
    .map(res => res.json());
  }

  getPhotoresistor(){
    return this._http.get(this.home+this.deviceID+'analogvalue?'+this.accessToken)
    .map(res => res.json());
  }

}
