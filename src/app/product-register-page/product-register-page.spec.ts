import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRegisterPage } from './product-register-page';

describe('ProductRegisterPage', () => {
  let component: ProductRegisterPage;
  let fixture: ComponentFixture<ProductRegisterPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRegisterPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductRegisterPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
