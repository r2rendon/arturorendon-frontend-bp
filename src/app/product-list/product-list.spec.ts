import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { vi } from 'vitest';

import { ProductList } from './product-list';
import { ApiService } from '../api';
import { Product } from '../../types/api';

describe('ProductList', () => {
  let component: ProductList;
  let fixture: ComponentFixture<ProductList>;
  let router: Router;

  const products: Product[] = [
    {
      id: '1',
      name: 'Cuenta Plus',
      description: 'Producto premium para clientes',
      logo: 'https://example.com/1.png',
      date_release: '2099-01-01',
      date_revision: '2100-01-01',
    },
    {
      id: '2',
      name: 'Tarjeta Gold',
      description: 'Tarjeta con beneficios extendidos',
      logo: 'https://example.com/2.png',
      date_release: '2099-02-01',
      date_revision: '2100-02-01',
    },
    {
      id: '3',
      name: 'Seguro Casa',
      description: 'Cobertura completa del hogar',
      logo: 'https://example.com/3.png',
      date_release: '2099-03-01',
      date_revision: '2100-03-01',
    },
    {
      id: '4',
      name: 'Credito Auto',
      description: 'Financiamiento flexible para vehiculos',
      logo: 'https://example.com/4.png',
      date_release: '2099-04-01',
      date_revision: '2100-04-01',
    },
    {
      id: '5',
      name: 'Plan Viajes',
      description: 'Asistencia global para viajeros',
      logo: 'https://example.com/5.png',
      date_release: '2099-05-01',
      date_revision: '2100-05-01',
    },
    {
      id: '6',
      name: 'Ahorro Kids',
      description: 'Ahorro programado para menores',
      logo: 'https://example.com/6.png',
      date_release: '2099-06-01',
      date_revision: '2100-06-01',
    },
  ];

  let apiServiceMock: {
    getProducts: ReturnType<typeof vi.fn>;
    deleteProduct: ReturnType<typeof vi.fn>;
  };
  let toastrMock: {
    success: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };

  async function createComponent() {
    await TestBed.configureTestingModule({
      imports: [ProductList],
      providers: [
        provideRouter([]),
        {
          provide: ApiService,
          useValue: apiServiceMock,
        },
        {
          provide: ToastrService,
          useValue: toastrMock,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductList);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(async () => {
    vi.clearAllMocks();
    apiServiceMock = {
      getProducts: vi.fn(() => of({ data: products })),
      deleteProduct: vi.fn(() => of(void 0)),
    };
    toastrMock = {
      success: vi.fn(),
      error: vi.fn(),
    };

    await createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads products on init and renders the first page', () => {
    expect(apiServiceMock.getProducts).toHaveBeenCalled();
    expect(component.products()).toEqual(products);
    expect(component.visibleProducts()).toHaveLength(5);

    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(5);
    expect(fixture.nativeElement.querySelector('.results-counter')?.textContent).toContain('6');
  });

  it('filters products by search query and resets the current page', () => {
    component.currentPage.set(2);
    component.onSearchChange({ target: { value: 'gold' } } as unknown as Event);
    fixture.detectChanges();

    expect(component.searchQuery()).toBe('gold');
    expect(component.currentPage()).toBe(1);
    expect(component.filteredProducts().map((product) => product.id)).toEqual(['2']);
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(1);
  });

  it('changes page size and falls back to 5 for invalid values', () => {
    component.onPageSizeChange({ target: { value: '10' } } as unknown as Event);
    expect(component.pageSize()).toBe(10);

    component.currentPage.set(2);
    component.onPageSizeChange({ target: { value: '0' } } as unknown as Event);
    expect(component.pageSize()).toBe(5);
    expect(component.currentPage()).toBe(1);
  });

  it('moves between pages within valid bounds', () => {
    component.nextPage();
    expect(component.currentPage()).toBe(2);

    component.nextPage();
    expect(component.currentPage()).toBe(2);

    component.prevPage();
    expect(component.currentPage()).toBe(1);

    component.prevPage();
    expect(component.currentPage()).toBe(1);
  });

  it('toggles and closes the dropdown menu', () => {
    component.toggleDropdown('1');
    expect(component.openDropdownId()).toBe('1');

    component.toggleDropdown('1');
    expect(component.openDropdownId()).toBeNull();

    component.toggleDropdown('2');
    component.closeDropdown();
    expect(component.openDropdownId()).toBeNull();
  });

  it('closes the dropdown when clicking outside the dropdown container', () => {
    component.toggleDropdown('1');
    component.onDocumentClick({
      target: {
        closest: vi.fn(() => null),
      },
    } as unknown as MouseEvent);

    expect(component.openDropdownId()).toBeNull();
  });

  it('keeps the dropdown open when clicking inside the dropdown container', () => {
    component.toggleDropdown('1');
    component.onDocumentClick({
      target: {
        closest: vi.fn(() => ({})),
      },
    } as unknown as MouseEvent);

    expect(component.openDropdownId()).toBe('1');
  });

  it('navigates to the edit page for a product', async () => {
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    component.toggleDropdown('2');

    component.editProduct('2');

    expect(component.openDropdownId()).toBeNull();
    expect(navigateSpy).toHaveBeenCalledWith(['/products/2/edit']);
  });

  it('opens the delete modal when the product exists', () => {
    component.toggleDropdown('3');

    component.deleteProduct('3');

    expect(component.openDropdownId()).toBeNull();
    expect(component.isDeleteModalOpen()).toBe(true);
    expect(component.productToDelete()).toEqual({ id: '3', name: 'Seguro Casa' });
  });

  it('does not open the delete modal when the product does not exist', () => {
    component.deleteProduct('999');

    expect(component.isDeleteModalOpen()).toBe(false);
    expect(component.productToDelete()).toEqual({ id: '', name: '' });
  });

  it('deletes a product successfully and refreshes the list', async () => {
    apiServiceMock.getProducts.mockReturnValueOnce(of({ data: products })).mockReturnValueOnce(
      of({ data: products.slice(1) }),
    );
    const fetchSpy = vi.spyOn(component, 'fetchData');
    component.productToDelete.set({ id: '1', name: 'Cuenta Plus' });
    component.isDeleteModalOpen.set(true);

    await component.handleDeleteConfirm();

    expect(apiServiceMock.deleteProduct).toHaveBeenCalledWith('1');
    expect(toastrMock.success).toHaveBeenCalledWith('Producto eliminado exitosamente');
    expect(component.isDeleteModalOpen()).toBe(false);
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('shows an error toast when delete fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    apiServiceMock.deleteProduct.mockReturnValueOnce(throwError(() => new Error('delete failed')));
    component.productToDelete.set({ id: '1', name: 'Cuenta Plus' });
    component.isDeleteModalOpen.set(true);

    await component.handleDeleteConfirm();

    expect(toastrMock.error).toHaveBeenCalledWith('Error al eliminar el producto');
    expect(component.isDeleteModalOpen()).toBe(false);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('closes the delete modal when cancel is triggered', () => {
    component.isDeleteModalOpen.set(true);

    component.handleDeleteCancel();

    expect(component.isDeleteModalOpen()).toBe(false);
  });
});
