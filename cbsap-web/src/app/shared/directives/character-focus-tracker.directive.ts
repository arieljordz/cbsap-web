import { Directive, ElementRef, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appCharacterFocusTracker]',
  standalone: true
})
export class CharacterFocusTrackerDirective {

  @Output() focusChange = new EventEmitter<boolean>();

  constructor(private el: ElementRef) {
    // Listen to the focus and blur events
    this.el.nativeElement.addEventListener('focus', this.onFocus.bind(this));
    this.el.nativeElement.addEventListener('blur', this.onBlur.bind(this));
  }

  onFocus() {
    this.focusChange.emit(true);  // Emit 'true' when focused
  }

  onBlur() {
    this.focusChange.emit(false);  // Emit 'false' when blurred
  }

}
