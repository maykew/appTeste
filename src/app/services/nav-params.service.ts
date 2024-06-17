import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavParamsService {

  private params: { [key: string]: any; } | undefined;
  constructor() { }

  public setParams(params: {[key: string]: any}): void {
    this.params = params;
  }

  public get(key: string): any {
    return this.params![key];
  }

  public has(key: string): boolean {
    return this.params !== undefined && this.params.hasOwnProperty(key);
  }

}
