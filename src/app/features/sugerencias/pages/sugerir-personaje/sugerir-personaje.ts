import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideCircleCheck } from '@lucide/angular';

@Component({
  selector: 'app-sugerir-personaje',
  imports: [ReactiveFormsModule, LucideCircleCheck],
  templateUrl: './sugerir-personaje.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SugerirPersonaje {
  // [E69] nonNullable: reset() vuelve al valor inicial, no a null
  private readonly fb = inject(FormBuilder).nonNullable;

  protected readonly enviado = signal<string | null>(null);
  protected readonly razas = ['Saiyan', 'Human', 'Namekian', 'Android', 'Majin', 'Otra'];

  // [E70] Cada campo: [valor inicial, validadores]
  protected readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    raza: ['Saiyan', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    motivo: ['', [Validators.maxLength(200)]],
  });

  // [E71] Inválido -> markAllAsTouched() para mostrar todos los errores
  protected enviar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // getRawValue() está tipado: { nombre: string; raza: string; ... }
    const datos = this.form.getRawValue();
    this.enviado.set(datos.nombre);
    this.form.reset();
  }

  // [E72] keyof typeof: solo acepta nombres de campos que existen
  protected tieneError(campo: keyof typeof this.form.controls, error: string) {
    const c = this.form.controls[campo];
    return c.touched && c.hasError(error);
  }
}
