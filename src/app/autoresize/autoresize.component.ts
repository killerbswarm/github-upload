import { Component, ElementRef, HostListener, Directive, OnInit } from '@angular/core';
@Component({
  selector: 'app-autoresize',
  templateUrl: './autoresize.component.html',
  styleUrls: ['./autoresize.component.scss']
})
@Directive({
  selector: 'ion-textarea[autosize]'
})
export class AutoresizeComponent implements OnInit {
  @HostListener('input', ['$event.target'])
  onInput(textArea:HTMLTextAreaElement):void {
    this.adjust();
  }

  constructor(public element:ElementRef) {
  }

  ngOnInit():void {
    setTimeout(() => this.adjust(), 0);
  }

  adjust():void {
    const textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }
}