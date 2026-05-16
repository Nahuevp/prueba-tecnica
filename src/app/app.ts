import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductListComponent],
  template: `
    <div class="min-h-screen bg-slate-950 text-slate-50 flex flex-col items-center py-10 px-4">
      <div class="w-full max-w-6xl space-y-8">
        
        <!-- Header -->
        <header class="flex items-center gap-3">
          <div class="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
            <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
          </div>
          <div>
            <h1 class="text-2xl font-bold tracking-tight">Product Catalog</h1>
            <p class="text-slate-400 text-sm">Enterprise inventory management system</p>
          </div>
        </header>

        <!-- Metric Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Total Products -->
          <div class="bg-[#0b1120] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-[170px]">
            <div class="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <div>
              <h3 class="text-slate-400 text-sm font-medium mb-1">Total Products</h3>
              <p class="text-3xl font-bold">{{ productService.totalProducts() }}</p>
              <p class="text-cyan-400 text-xs mt-2">+12 this month</p>
            </div>
          </div>

          <!-- Total Value -->
          <div class="bg-[#0b1120] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-[170px]">
            <div class="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h3 class="text-slate-400 text-sm font-medium mb-1">Total Value</h3>
              <p class="text-3xl font-bold">\${{ productService.totalValue() | number:'1.2-2' }}</p>
              <p class="text-indigo-400 text-xs mt-2">+8.4% growth</p>
            </div>
          </div>

          <!-- Last Activity -->
          <div class="bg-[#0b1120] border border-slate-800/80 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-[170px]">
            <div class="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h3 class="text-slate-400 text-sm font-medium mb-1">Last Activity</h3>
              <p class="text-3xl font-bold">May 9, 2026</p>
              <p class="text-emerald-400 text-xs mt-2">Updated recently</p>
            </div>
          </div>
        </div>

        <!-- Main Content (Grid + Form) -->
        <app-product-list />
        
      </div>
    </div>
  `
})
export class AppComponent {
  productService = inject(ProductService);
}
