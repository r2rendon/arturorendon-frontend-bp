import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeader } from './app-header/app-header';
import { ProductList } from './product-list/product-list';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeader, ProductList],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true,
})
export class App {
  protected readonly title = signal('arturorendon-frontend-bp');
}
