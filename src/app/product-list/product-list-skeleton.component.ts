import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-product-list-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="skeleton-table">
      <div class="skeleton-header">
        <div class="skeleton-header-cell"></div>
        <div class="skeleton-header-cell"></div>
        <div class="skeleton-header-cell"></div>
        <div class="skeleton-header-cell"></div>
        <div class="skeleton-header-cell"></div>
        <div class="skeleton-header-cell"></div>
      </div>
      <div *ngFor="let row of rows" class="skeleton-row">
        <div class="skeleton-cell skeleton-cell--image"></div>
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell"></div>
        <div class="skeleton-cell"></div>
      </div>
    </div>
  `,
  styles: `
    @keyframes skeleton-shimmer {
      0% {
        background-position: -1000px 0;
      }
      100% {
        background-position: 1000px 0;
      }
    }

    .skeleton-table {
      width: 100%;
      background: #fff;
      border: 1px solid #eef1f5;
      border-radius: 6px;
      overflow: hidden;
    }

    .skeleton-header {
      display: grid;
      grid-template-columns: 50px 1fr 1fr 100px 100px 50px;
      gap: 16px;
      padding: 16px 16px;
      background: #f6f8fb;
      border-radius: 6px 6px 0 0;
      border-bottom: 2px solid #d5dae1;
    }

    .skeleton-header-cell {
      height: 16px;
      background: linear-gradient(90deg, #d5dae1 0%, #eef1f5 20%, #d5dae1 40%, #d5dae1 100%);
      background-size: 1000px 100%;
      animation: skeleton-shimmer 2s infinite;
      border-radius: 4px;
    }

    .skeleton-row {
      display: grid;
      grid-template-columns: 50px 1fr 1fr 100px 100px 50px;
      gap: 16px;
      padding: 18px 16px;
      border-bottom: 1px solid #eef1f5;
      align-items: center;
      background: #fff;
    }

    .skeleton-row:last-child {
      border-bottom: none;
      border-radius: 0 0 6px 6px;
    }

    .skeleton-cell {
      height: 16px;
      background: linear-gradient(90deg, #e0e4eb 0%, #f0f3f8 20%, #e0e4eb 40%, #e0e4eb 100%);
      background-size: 1000px 100%;
      animation: skeleton-shimmer 2s infinite;
      border-radius: 4px;
    }

    .skeleton-cell--image {
      height: 40px;
      width: 40px;
      border-radius: 50%;
      background: linear-gradient(90deg, #e0e4eb 0%, #f0f3f8 20%, #e0e4eb 40%, #e0e4eb 100%);
      animation: skeleton-shimmer 2s infinite;
    }
  `,
})
export class ProductListSkeletonComponent {
  @Input() rows: number[] = Array(5)
    .fill(0)
    .map((_, i) => i);
}
