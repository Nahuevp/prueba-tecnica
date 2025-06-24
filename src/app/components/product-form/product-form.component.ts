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
  // Inyección de dependencias: FormBuilder para formularios reactivos, y servicio de productos
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);

  // FormGroup para manejar el formulario reactivo
  form: FormGroup;
  
  // Variables de control para edición
  editing = false;
  editId: number | null = null;

  // Mensaje de éxito tras agregar o editar
  mensaje = '';

  constructor() {
    // Estructura del formulario con validaciones
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [null, [Validators.required, Validators.min(1)]],
      email: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/) // Exige la estructura "ejemplo@algo.algo"
      ]],
      date: ['', Validators.required]
    });
  }

  // Método ejecutado al enviar el formulario
  onSubmit(): void {
    if (this.editing && this.editId !== null) {
      // Si se está editando, se actualiza el producto
      this.productService.update({ id: this.editId, ...this.form.value });
      this.mensaje = 'Producto editado correctamente';
    } else {
      // Si no, se agrega un nuevo producto
      this.productService.add(this.form.value);
      this.mensaje = 'Producto agregado correctamente';
    }

    // Reset de estado y formulario
    this.form.reset();
    this.editing = false;
    this.editId = null;

    // Limpieza del mensaje a los 3 segundos
    setTimeout(() => this.mensaje = '', 3000);
  }

  // Carga los datos en el formulario para editar
  loadProduct(product: Product) {
    this.form.patchValue(product);
    this.editing = true;
    this.editId = product.id!;
  }
}
