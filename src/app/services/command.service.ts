import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Command} from '../interfaces/command';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CommandService {
  home= 'https://api.particle.io/v1/devices/';
  deviceID= '2a0037000347353137323334';
  accessToken= '7aa3147feb8f52b04624e1b42f6901612a86c2b9';

  // https://api.particle.io/v1/devices/your-device-ID-goes-here/led?access_token=your-access-token-goes-here
  constructor(private _http: Http) { }


  getNivel(){
    return this._http.get(this.home+this.deviceID+'/nivel/?access_token='+this.accessToken)
    .map(res => res.json());
  }

  infoGen(){
    return this._http.get(this.home+this.deviceID+'\?access_token\='+this.accessToken)
    // 'https://api.particle.io/v1/devices/0123456789abcdef01234567\?access_token\=1234'
    .map(res => res.json());
  }
  getEvents(){
    return this._http.get('https://api.thingspeak.com/channels/261968/fields/1.json?results=20')
    // https://events.bluz.io/devices/b1e2b1e2b1e2b1e2b1e2b1e2\?limit\=10\&access_token\=12345
    .map(res => res.json());
  }

}
