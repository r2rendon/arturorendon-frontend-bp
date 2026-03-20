import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../api';
import { Product } from '../../types/api';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  toastr = inject(ToastrService);
  private readonly route = inject(ActivatedRoute);

  constructor(private apiService: ApiService) {}

  // Detail mode (read-only)
  selectedProductId = signal<string | null>(null);
  selectedProduct = computed(() => {
    const id = this.selectedProductId();
    if (!id) return null;
    return this.products().find((p) => p.id === id) ?? null;
  });
  isDetailMode = computed(() => this.selectedProductId() !== null);

  // Pagination (frontend-only)
  products = signal<Product[]>([]);
  pageSize = signal(5);
  currentPage = signal(1);

  ngOnInit() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.selectedProductId.set(params.get('id'));
    });
    this.fetchData();
  }

  async fetchData() {
    const response = await firstValueFrom(this.apiService.getProducts());
    this.products.set(response.data);
    this.ensureValidCurrentPage();
  }

  get totalResults(): number {
    return this.products().length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.pageSize()));
  }

  visibleProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.products().slice(start, end);
  });

  onPageSizeChange(event: Event) {
    const value = Number((event.target as HTMLSelectElement).value);
    this.pageSize.set(Number.isFinite(value) && value > 0 ? value : 5);
    this.currentPage.set(1);
  }

  prevPage() {
    this.currentPage.update((page) => Math.max(1, page - 1));
  }

  nextPage() {
    this.currentPage.update((page) => Math.min(this.totalPages, page + 1));
  }

  private ensureValidCurrentPage() {
    this.currentPage.update((page) => Math.max(1, Math.min(page, this.totalPages)));
  }
}
