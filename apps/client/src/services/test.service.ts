import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TestService {


  public selectedTest: WritableSignal<any | null> = signal(null)
  constructor() { }
}
