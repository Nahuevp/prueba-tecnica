import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  form: FormGroup;
  editing = false;
  editId: number | null = null;
  mensaje = '';

  constructor() {
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [null, [Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      email: ['', [Validators.required, Validators.email]],
      date: ['', [Validators.required, Validators.pattern(datePattern)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const productData = { ...this.form.value };

    if (this.editing && this.editId !== null) {
      this.productService.update({ id: this.editId, ...productData });
      this.mensaje = 'Producto editado correctamente';
    } else {
      if (this.productService.isDuplicate(productData)) {
        this.mensaje = 'Ya existe un producto con el mismo nombre y correo';
        setTimeout(() => this.mensaje = '', 3000);
        return;
      }
      this.productService.add(productData);
      this.mensaje = 'Producto agregado correctamente';
    }

    this.form.reset({ price: null, date: '' });
    this.editing = false;
    this.editId = null;

    setTimeout(() => this.mensaje = '', 3000);
  }

  loadProduct(product: Product) {
    this.form.patchValue(product);
    this.editing = true;
    this.editId = product.id!;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['min']) return 'Debe ser mayor a 0';
    if (control.errors['pattern']) {
      if (field === 'price') return 'Ingrese un número válido';
      if (field === 'date') return 'Formato de fecha inválido (use YYYY-MM-DD)';
    }
    if (control.errors['email']) return 'Formato de correo inválido';

    return '';
  }
}
