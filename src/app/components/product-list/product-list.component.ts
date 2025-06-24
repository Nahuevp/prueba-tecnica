import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductFormComponent } from '../product-form/product-form.component';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent {
  // Inyección del servicio que maneja el array de productos en memoria
  productService = inject(ProductService);

  // Referencia directa al formulario usando @ViewChild (permite editar)
  @ViewChild(ProductFormComponent) formComponent!: ProductFormComponent;

  // Mensaje de feedback para mostrar alertas visuales
  mensaje: string = '';

  // Paginación
  currentPage = 1;
  itemsPerPage = 1;
  
  // Getter que devuelve todos los productos
  get products(): Product[] {
    return this.productService.getAll();
  }

  // Carga los datos del producto en el formulario para edición
  edit(product: Product) {
    this.formComponent.loadProduct(product);
    this.setMensaje('Producto cargado para edición.');
  }

  // Elimina el producto por ID
  delete(id: number) {
  this.productService.delete(id);
  this.setMensaje('Producto eliminado correctamente.');

  // Si la página actual quedó vacía, volver a la anterior
  const totalPages = Math.ceil(this.products.length / this.itemsPerPage);
  if (this.currentPage > totalPages) {
    this.currentPage = totalPages;
  }
}

  // Muestra un mensaje por unos segundos
  private setMensaje(texto: string): void {
    this.mensaje = texto;
    setTimeout(() => this.mensaje = '', 5000); // se borra en 5 segundos
  }

  // Devuelve los productos de la página actual
  get paginatedProducts(): Product[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.products.slice(start, start + this.itemsPerPage);
  }

  // Navegación de páginas
  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  get hasNextPage(): boolean {
    return this.currentPage * this.itemsPerPage < this.products.length;
  }

  nextPage(): void {
    if (this.hasNextPage) this.currentPage++;
  }

  prevPage(): void {
    if (this.hasPreviousPage) this.currentPage--;
  }
}
