import { Component } from '@angular/core';

@Component({
  selector: 'app-product-list-empty',
  standalone: true,
  template: `
    <div class="empty-state">
      <span class="empty-state-icon">📦</span>
      <h3>No hay productos</h3>
      <p>No se encontraron productos. Intenta ajustar los filtros de búsqueda.</p>
    </div>
  `,
})
export class ProductListEmptyComponent {}
