import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private products: Product[] = [];
  private currentId = 1;

  getAll(): Product[] {
    return this.products;
  }

  add(product: Product): void {
    product.id = this.currentId++;
    this.products.push({ ...product });
  }

  update(product: Product): void {
    const index = this.products.findIndex(p => p.id === product.id);
    if (index !== -1) {
      this.products[index] = { ...product };
    }
  }

  delete(id: number): void {
    this.products = this.products.filter(p => p.id !== id);
  }

  isDuplicate(product: Omit<Product, 'id'>): boolean {
    return this.products.some(
      p => p.name.toLowerCase() === product.name.toLowerCase() && 
           p.email.toLowerCase() === product.email.toLowerCase()
    );
  }
}
