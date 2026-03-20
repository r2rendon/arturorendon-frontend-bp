import { Component } from '@angular/core';

@Component({
  selector: 'app-product-register-form-skeleton',
  standalone: true,
  template: `
    <div class="skeleton-form">
      <div class="skeleton-form-grid">
        <div class="skeleton-field">
          <div class="skeleton-label"></div>
          <div class="skeleton-input"></div>
        </div>
        <div class="skeleton-field">
          <div class="skeleton-label"></div>
          <div class="skeleton-input"></div>
        </div>
        <div class="skeleton-field">
          <div class="skeleton-label"></div>
          <div class="skeleton-input skeleton-input--textarea"></div>
        </div>
        <div class="skeleton-field">
          <div class="skeleton-label"></div>
          <div class="skeleton-input"></div>
        </div>
        <div class="skeleton-field">
          <div class="skeleton-label"></div>
          <div class="skeleton-input"></div>
        </div>
        <div class="skeleton-field">
          <div class="skeleton-label"></div>
          <div class="skeleton-input"></div>
        </div>
      </div>
      <div class="skeleton-buttons">
        <div class="skeleton-button"></div>
        <div class="skeleton-button"></div>
        <div class="skeleton-button"></div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes skeleton-shimmer {
        0% {
          background-position: -1000px 0;
        }
        100% {
          background-position: 1000px 0;
        }
      }

      .skeleton-form {
        margin-top: 18px;
      }

      .skeleton-form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 34px;
        row-gap: 22px;
        margin-bottom: 26px;
      }

      .skeleton-field {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .skeleton-label {
        height: 16px;
        width: 80px;
        background: linear-gradient(90deg, #d5dae1 0%, #eef1f5 25%, #d5dae1 50%, #d5dae1 100%);
        background-size: 1000px 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
      }

      .skeleton-input {
        height: 44px;
        background: linear-gradient(90deg, #d5dae1 0%, #eef1f5 25%, #d5dae1 50%, #d5dae1 100%);
        background-size: 1000px 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
        border: 1px solid #eef1f5;
      }

      .skeleton-input--textarea {
        height: 76px;
      }

      .skeleton-buttons {
        display: flex;
        justify-content: center;
        gap: 26px;
      }

      .skeleton-button {
        height: 44px;
        width: 140px;
        background: linear-gradient(90deg, #d5dae1 0%, #eef1f5 25%, #d5dae1 50%, #d5dae1 100%);
        background-size: 1000px 100%;
        animation: skeleton-shimmer 2s infinite;
        border-radius: 4px;
      }

      @media (max-width: 768px) {
        .skeleton-form-grid {
          grid-template-columns: 1fr;
          column-gap: 0;
        }
      }
    `,
  ],
})
export class ProductRegisterFormSkeletonComponent {}
