import { LocalStorageService } from './../common/local-storage.service';
import { inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root',
})
export class LockingService {
  
    private hub: signalR.HubConnection;
    private localStorage = inject(LocalStorageService);
    private hubUrl: string = environment.apiUrl;

    constructor() {
    this.hub = new signalR.HubConnectionBuilder()
      .withUrl(`${this.hubUrl}/lockhub`,

        { accessTokenFactory: () => {
          // Return the access token here (e.g., from local storage or a service)
          return this.localStorage.get("token") || '';
        },
      }
      )
      .withAutomaticReconnect()
      .build();
     
    }

     connect() {      
        this.hub
          .start()
          .then(() => console.log('Connected to Locking Hub'))
          .catch((err) => console.error('Error connecting to Locking Hub:', err));
    }

    disconnect(){
      if (this.hub){
        this.hub.stop();
      }
    }

    requestLock(recordId: number,lockedBy:string) {
        return this.hub.invoke("RequestLock", recordId,lockedBy);
    }

    lockRecord(recordId: number) {
        return this.hub.invoke("LockRecord", recordId);
    }
    forceLockRecord(recordId: number,lockedBy:string) {
        return this.hub.invoke("ForceLockRecord", recordId,lockedBy);
    }
    unlockRecord(recordId: number) {
      return this.hub.invoke("UnlockRecord", recordId);
    }

  onRecordLocked(callback: (recordId: number, user: string) => void) {
    this.hub.on("recordLocked", callback);    
  }

  onRecordUnlocked(callback: (number: string) => void) {
    this.hub.on("recordUnlocked", callback);
  }

  onLockFailed(callback: (recordId: string, lockedBy: string) => void) {
    this.hub.on("lockFailed", callback);
  }

  onRequestLock(callback: (recordId: number, requestedBy: string) => void) {
    this.hub.on("requestLock", callback);
  }

  
}

