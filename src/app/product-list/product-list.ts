import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  signal,
  HostListener,
  ElementRef,
  effect,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../api';
import { Product } from '../../types/api';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { DeleteConfirmationModal } from '../delete-confirmation-modal/delete-confirmation-modal';
import { ProductListSkeletonComponent } from './product-list-skeleton.component';
import { ProductListEmptyComponent } from './product-list-empty.component';

@Component({
  selector: 'app-product-list',
  imports: [
    CommonModule,
    RouterLink,
    DeleteConfirmationModal,
    ProductListSkeletonComponent,
    ProductListEmptyComponent,
  ],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css',
})
export class ProductList {
  toastr = inject(ToastrService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  constructor(private apiService: ApiService) {
    effect(() => {
      this.fetchData();
    });
  }

  // Dropdown state
  openDropdownId = signal<string | null>(null);

  // Loading state
  isLoading = signal(false);

  // Delete confirmation modal state
  isDeleteModalOpen = signal(false);
  productToDelete = signal<{ id: string; name: string }>({ id: '', name: '' });

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const dropdownContainer = target.closest('.dropdown-container');

    if (!dropdownContainer) {
      this.closeDropdown();
    }
  }

  searchQuery = signal<string>('');

  // Pagination (frontend-only)
  products = signal<Product[]>([]);
  pageSize = signal(5);
  currentPage = signal(1);

  async fetchData() {
    try {
      this.isLoading.set(true);
      const response = await firstValueFrom(this.apiService.getProducts());
      this.products.set(response.data);
      this.ensureValidCurrentPage();
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.products();
    return this.products().filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query),
    );
  });

  get totalResults(): number {
    return this.filteredProducts().length;
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.totalResults / this.pageSize()));
  }

  visibleProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredProducts().slice(start, end);
  });

  onSearchChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
    this.currentPage.set(1);
  }

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

  toggleDropdown(productId: string) {
    if (this.openDropdownId() === productId) {
      this.openDropdownId.set(null);
    } else {
      this.openDropdownId.set(productId);
    }
  }

  closeDropdown() {
    this.openDropdownId.set(null);
  }

  editProduct(productId: string) {
    this.closeDropdown();
    this.router.navigate([`/products/${productId}/edit`]);
  }

  deleteProduct(productId: string) {
    this.closeDropdown();
    const product = this.products().find((p) => p.id === productId);
    if (product) {
      this.productToDelete.set({ id: productId, name: product.name });
      this.isDeleteModalOpen.set(true);
    }
  }

  async handleDeleteConfirm() {
    const productId = this.productToDelete().id;
    try {
      await firstValueFrom(this.apiService.deleteProduct(productId));
      this.toastr.success('Producto eliminado exitosamente');
      this.isDeleteModalOpen.set(false);
      this.fetchData();
    } catch (error) {
      this.toastr.error('Error al eliminar el producto');
      console.error(error);
      this.isDeleteModalOpen.set(false);
    }
  }

  handleDeleteCancel() {
    this.isDeleteModalOpen.set(false);
  }
}
