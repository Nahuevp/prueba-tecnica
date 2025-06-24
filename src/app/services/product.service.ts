import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

// Servicio inyectable disponible a nivel global (root)
@Injectable({ providedIn: 'root' })
export class ProductService {
  // Array en memoria para almacenar los productos
  private products: Product[] = [];

  // ID incremental para asignar identificadores únicos
  private currentId = 1;

  // Devuelve todos los productos registrados
  getAll(): Product[] {
    return this.products;
  }

  // Agrega un nuevo producto al array
  add(product: Product): void {
    product.id = this.currentId++; // asigna ID único
    this.products.push({ ...product }); // clona y guarda
  }

  // Actualiza un producto existente según su ID
  update(product: Product): void {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = { ...product }; // reemplaza datos
    }
  }

  // Elimina un producto por su ID
  delete(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }
}
