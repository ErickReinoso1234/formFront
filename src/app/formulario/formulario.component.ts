import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormularioService } from '../formulario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css']
})
export class FormularioComponent implements OnInit {
  formulario: FormGroup;
  formularios: any[] = [];
  selectedFormulario: any = null; // Para seleccionar un formulario específico

  constructor(private fb: FormBuilder, private formularioService: FormularioService) {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      correo: ['', [Validators.required, Validators.email]],
      cedula: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
    });
  }

  ngOnInit() {
    this.getFormularios();
  }

  onSubmit() {
    if (this.formulario.valid) {
      if (this.selectedFormulario) {
        this.updateFormulario(this.selectedFormulario.id);
      } else {
        this.createFormulario();
      }
    } else {
      console.log('Formulario no válido');
    }
  }

  getFormularios() {
    this.formularioService.getAll().subscribe(
      data => {
        this.formularios = data;
        console.log('Formularios obtenidos:', this.formularios);
      },
      error => {
        console.error('Error al obtener los formularios:', error);
      }
    );
  }

  getFormulario(id: string) {
    this.formularioService.getById(id).subscribe(
      data => {
        this.selectedFormulario = data;
        this.formulario.patchValue(data);
        console.log('Formulario obtenido:', data);
      },
      error => {
        console.error('Error al obtener el formulario:', error);
      }
    );
  }

  createFormulario() {
    this.formularioService.create(this.formulario.value).subscribe(
      data => {
        console.log('Formulario creado:', data);
        this.getFormularios(); 
         // Actualiza la lista de formularios
        this.formulario.reset();
      },
      error => {
        console.error('Error al crear el formulario:', error);
        if (error.error && error.error.message) {
          // Si hay un mensaje de error en la respuesta del servidor, mostrarlo al usuario
          alert(error.error.message);
        } else {
          // Si no hay un mensaje de error específico, mostrar un mensaje genérico
          alert('Ocurrió un error al crear el formulario. Por favor, intenta nuevamente.');
        }
      }
    );
  }

  updateFormulario(id: string) {  
    this.formularioService.update(id, this.formulario.value).subscribe(
      data => {
        console.log('Formulario actualizado:', data);
        this.getFormularios(); // Actualiza la lista de formularios
        this.formulario.reset();
        this.selectedFormulario = null;
      },
      error => {
        console.error('Error al actualizar el formulario:', error);
      }
    );
  }

  deleteFormulario(id: string) {
    this.formularioService.delete(id).subscribe(
      data => {
        console.log('Formulario eliminado:', data);
        this.getFormularios(); // Actualiza la lista de formularios
      },
      error => {
        console.error('Error al eliminar el formulario:', error);
      }
    );
  }
}
