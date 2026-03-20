import { ComponentFixture, TestBed } from '@angular/core/testing';
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
    fixture.detectChanges();
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
    let confirmEmitted = false;
    component.confirm.subscribe(() => {
      confirmEmitted = true;
    });
    component.isOpen = true;
    fixture.detectChanges();

    const confirmButton = fixture.nativeElement.querySelector('.button-confirm');
    confirmButton.click();

    expect(confirmEmitted).toBe(true);
  });

  it('should emit cancel event when cancel button is clicked', () => {
    let cancelEmitted = false;
    component.cancel.subscribe(() => {
      cancelEmitted = true;
    });
    component.isOpen = true;
    fixture.detectChanges();

    const cancelButton = fixture.nativeElement.querySelector('.button-cancel');
    cancelButton.click();

    expect(cancelEmitted).toBe(true);
  });

  it('should emit cancel event when backdrop is clicked', () => {
    let cancelEmitted = false;
    component.cancel.subscribe(() => {
      cancelEmitted = true;
    });
    component.isOpen = true;
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.modal-backdrop');
    backdrop.click();

    expect(cancelEmitted).toBe(true);
  });

  it('should not emit cancel when modal card is clicked', () => {
    let cancelCount = 0;
    component.cancel.subscribe(() => {
      cancelCount++;
    });
    component.isOpen = true;
    fixture.detectChanges();

    const modalCard = fixture.nativeElement.querySelector('.modal-card');
    modalCard.click();

    expect(cancelCount).toBe(0);
  });
});
