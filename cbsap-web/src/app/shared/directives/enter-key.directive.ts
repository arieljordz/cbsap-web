import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appEnterKey]',
  standalone: true
})
export class EnterKeyDirective {

  @Output() enterKeyPressed = new EventEmitter<KeyboardEvent>();

  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    this.enterKeyPressed.emit(event);
   
  }

}
