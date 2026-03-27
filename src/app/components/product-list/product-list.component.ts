import { Component, inject, ViewChild } from '@angular/core';
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

  mensaje: string = '';

  currentPage = 1;
  itemsPerPage = 10;

  searchTerm = '';
  sortField: 'name' | 'price' | 'date' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  get products(): Product[] {
    return this.productService.getAll();
  }

  get filteredProducts(): Product[] {
    let result = [...this.products];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term)
      );
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (this.sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });

    return result;
  }

  edit(product: Product) {
    this.formComponent.loadProduct(product);
    this.setMensaje('Producto cargado para edición.');
  }

  delete(id: number) {
    this.productService.delete(id);
    this.setMensaje('Producto eliminado correctamente.');

    const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    if (this.currentPage > totalPages && totalPages > 0) {
      this.currentPage = totalPages;
    }
  }

  private setMensaje(texto: string): void {
    this.mensaje = texto;
    setTimeout(() => this.mensaje = '', 5000);
  }

  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(start, start + this.itemsPerPage);
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  get hasNextPage(): boolean {
    return this.currentPage * this.itemsPerPage < this.filteredProducts.length;
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  nextPage(): void {
    if (this.hasNextPage) this.currentPage++;
  }

  prevPage(): void {
    if (this.hasPreviousPage) this.currentPage--;
  }

  setSort(field: 'name' | 'price' | 'date') {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
  }

  getSortIcon(field: string): string {
    if (this.sortField !== field) return '↕';
    return this.sortDirection === 'asc' ? '↑' : '↓';
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }
}
