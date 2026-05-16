import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  // Estado Reactivo con datos de prueba (Dummy Data) para el portfolio
  private readonly _products = signal<Product[]>([
    { id: 1, name: 'Enterprise Analytics Suite', price: 12999, email: 'sales@analytics.co', date: '2026-05-09' },
    { id: 2, name: 'Cloud Infrastructure Manager', price: 8499, email: 'enterprise@cloudmgr.io', date: '2026-05-07' },
    { id: 3, name: 'Security Compliance Platform', price: 15750, email: 'solutions@securetech.com', date: '2026-05-04' },
    { id: 4, name: 'AI Data Processing Engine', price: 22500, email: 'contact@aiprocessing.net', date: '2026-04-30' },
    { id: 5, name: 'DevOps Automation Toolkit', price: 6299, email: 'support@devopskit.io', date: '2026-04-27' },
    { id: 6, name: 'Customer Insights Module', price: 4999, email: 'info@insightsmod.com', date: '2026-04-24' },
    { id: 7, name: 'Real-time Monitoring System', price: 11200, email: 'sales@rtmonitoring.co', date: '2026-04-19' },
    { id: 8, name: 'API Gateway Pro', price: 7850, email: 'enterprise@apigw.io', date: '2026-04-17' },
    { id: 9, name: 'Database Optimization Suite', price: 9400, email: 'team@dboptimize.net', date: '2026-04-14' },
    { id: 10, name: 'Workflow Automation Hub', price: 5600, email: 'hello@workflowhub.com', date: '2026-04-11' },
    { id: 11, name: 'Identity Management Core', price: 18900, email: 'security@idcore.com', date: '2026-04-05' },
    { id: 12, name: 'Microservices Mesh Router', price: 8900, email: 'mesh@router.io', date: '2026-04-02' }
  ]);
  private _currentId = 13;
  
  // Filtros
  readonly searchQuery = signal<string>('');

  // Señales Públicas y Computadas
  readonly products = this._products.asReadonly();
  
  readonly filteredProducts = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const all = this._products();
    if (!query) return all;
    return all.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.email.toLowerCase().includes(query)
    );
  });

  readonly totalProducts = computed(() => this._products().length);
  
  readonly totalValue = computed(() => {
    return this._products().reduce((sum, p) => sum + Number(p.price), 0);
  });

  add(product: Omit<Product, 'id'>): void {
    const newProduct = { ...product, id: this._currentId++ } as Product;
    this._products.update(products => [...products, newProduct]);
  }

  update(product: Product): void {
    this._products.update(products => 
      products.map(p => p.id === product.id ? { ...product } : p)
    );
  }

  delete(id: number): void {
    this._products.update(products => products.filter(p => p.id !== id));
  }

  isDuplicate(product: Omit<Product, 'id'>, excludeId?: number): boolean {
    return this._products().some(
      p => p.name.toLowerCase() === product.name.toLowerCase() && 
           p.email.toLowerCase() === product.email.toLowerCase() &&
           p.id !== excludeId
    );
  }
}
