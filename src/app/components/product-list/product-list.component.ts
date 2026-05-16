import { Component, inject, computed, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductFormComponent, FormsModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {
  productService = inject(ProductService);

  @ViewChild(ProductFormComponent) formComponent!: ProductFormComponent;

  Math = Math;
  isDrawerOpen = signal(false);
  currentPage = signal(1);
  itemsPerPage = 10;
  
  sortField = signal<'name' | 'price' | 'email' | 'date'>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  readonly sortedProducts = computed(() => {
    const products = [...this.productService.filteredProducts()];
    const field = this.sortField();
    const dir = this.sortDirection() === 'asc' ? 1 : -1;
    
    return products.sort((a, b) => {
      if (field === 'name') return a.name.localeCompare(b.name) * dir;
      if (field === 'price') return (a.price - b.price) * dir;
      if (field === 'email') return a.email.localeCompare(b.email) * dir;
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
    });
  });

  readonly paginatedProducts = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    return this.sortedProducts().slice(start, start + this.itemsPerPage);
  });

  readonly totalPages = computed(() => Math.ceil(this.sortedProducts().length / this.itemsPerPage));

  getPagesArray(): number[] {
    return Array.from({length: this.totalPages()}, (_, i) => i + 1);
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.productService.searchQuery.set(val);
    this.currentPage.set(1);
  }

  setSort(field: 'name' | 'price' | 'email' | 'date') {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
    this.currentPage.set(1);
  }

  openAddDrawer() {
    this.formComponent.resetForm();
    this.isDrawerOpen.set(true);
  }

  openEditDrawer(product: Product) {
    this.formComponent.loadProduct(product);
    this.isDrawerOpen.set(true);
  }

  closeDrawer() {
    this.isDrawerOpen.set(false);
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.delete(id);
      if (this.currentPage() > this.totalPages() && this.totalPages() > 0) {
         this.currentPage.set(this.totalPages());
      }
    }
  }
}
