import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styles: [],
})
export class LayoutPageComponent {
  public sidebarItems = [
    {
      label: 'Heroes List',
      icon: 'label',
      url: './list',
    },
    {
      label: 'New Hero',
      icon: 'add',
      url: './new',
    },
    {
      label: 'Search Heroes',
      icon: 'search',
      url: './search',
    },
  ];
}
