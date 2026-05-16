import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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

  @Output() formClosed = new EventEmitter<void>();

  form: FormGroup;
  editing = false;
  editId: number | null = null;
  mensaje = '';

  constructor() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      price: [null, [Validators.required, Validators.min(1), Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      email: ['', [Validators.required, Validators.email]],
      date: ['', [Validators.required, this.dateValidator]]
    }, { validators: this.duplicateValidator.bind(this) });
  }

  dateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const inputDate = new Date(control.value);
    const today = new Date();
    if (isNaN(inputDate.getTime())) return { invalidDate: true };
    if (inputDate > today) return { futureDate: true };
    return null;
  }

  duplicateValidator(group: AbstractControl): ValidationErrors | null {
    const name = group.get('name')?.value;
    const email = group.get('email')?.value;
    
    if (name && email) {
      const isDup = this.productService.isDuplicate({ name, email, price: 0, date: '' }, this.editId || undefined);
      if (isDup) {
        group.get('name')?.setErrors({ duplicate: true });
        return { duplicate: true };
      } else {
        const nameCtrl = group.get('name');
        if (nameCtrl?.errors && nameCtrl.errors['duplicate']) {
          delete nameCtrl.errors['duplicate'];
          if (Object.keys(nameCtrl.errors).length === 0) nameCtrl.setErrors(null);
        }
      }
    }
    return null;
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
      this.productService.add(productData);
      this.mensaje = 'Producto agregado correctamente';
    }

    setTimeout(() => {
      this.mensaje = '';
      this.formClosed.emit();
    }, 1200);
  }

  loadProduct(product: Product) {
    this.form.patchValue(product);
    this.editing = true;
    this.editId = product.id!;
  }

  resetForm() {
    this.form.reset({ price: null, date: '' });
    this.editing = false;
    this.editId = null;
    this.mensaje = '';
  }

  close() {
    this.formClosed.emit();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
