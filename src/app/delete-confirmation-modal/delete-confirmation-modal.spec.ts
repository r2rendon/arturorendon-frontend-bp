import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { DeleteConfirmationModal } from './delete-confirmation-modal';

describe('DeleteConfirmationModal', () => {
  let component: DeleteConfirmationModal;
  let fixture: ComponentFixture<DeleteConfirmationModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfirmationModal],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteConfirmationModal);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display modal when isOpen is false', () => {
    component.isOpen = false;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
    expect(backdrop).toBeNull();
  });

  it('should display modal when isOpen is true', () => {
    component.isOpen = true;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
    expect(backdrop).toBeTruthy();
  });

  it('should display product name in confirmation message', () => {
    component.isOpen = true;
    component.productName = 'Test Product';
    fixture.detectChanges();

    const message = fixture.nativeElement.querySelector('.modal-message');
    expect(message.textContent).toContain('Test Product');
  });

  it('should emit confirm event when confirm button is clicked', () => {
    const confirmSpy = vi.spyOn(component.confirm, 'emit');
    component.isOpen = true;
    fixture.detectChanges();

    component.onConfirm();

    expect(confirmSpy).toHaveBeenCalled();
  });

  it('should emit cancel event when cancel button is clicked', () => {
    const cancelSpy = vi.spyOn(component.cancel, 'emit');
    component.isOpen = true;
    fixture.detectChanges();

    component.onCancel();

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should emit cancel event when backdrop is clicked', () => {
    const cancelSpy = vi.spyOn(component.cancel, 'emit');
    component.isOpen = true;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop') as HTMLElement;
    component.onBackdropClick({ target: backdrop } as unknown as MouseEvent);

    expect(cancelSpy).toHaveBeenCalled();
  });

  it('should not emit cancel when modal card is clicked', () => {
    const cancelSpy = vi.spyOn(component.cancel, 'emit');
    component.isOpen = true;
    fixture.detectChanges();

    const modalCard = fixture.nativeElement.querySelector('.modal-card') as HTMLElement;
    component.onBackdropClick({ target: modalCard } as unknown as MouseEvent);

    expect(cancelSpy).not.toHaveBeenCalled();
  });
});
