import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { SheetdbService } from './common/shared/services/sheetDB.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

// Importa el tooltip de Bootstrap si no está cargado globalmente
declare var bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit {

  @ViewChild('tooltipElement', { static: false }) tooltipElement!: ElementRef;
  @ViewChild('guideOverlay', { static: false }) guideOverlay!: ElementRef;
  @ViewChild('closeGuide', { static: false }) closeGuideButton!: ElementRef;

  companion: boolean = false;  // Aquí declaramos la propiedad companion

  private sections: NodeListOf<Element> = document.querySelectorAll('.section');
  private guideClosed = localStorage.getItem('guideClosed') === 'true'; // Nuevo estado
  private currentSectionIndex = 0; // Índice de la sección actual

  form!: FormGroup;  // Declaramos el FormGroup para el formulario

  constructor(private sheetdbService: SheetdbService) { }

  ngOnInit() {
    this.form = new FormGroup({
      attendance: new FormControl('', Validators.required),
      guestName: new FormControl('', Validators.required),
      guestEmail: new FormControl('', [Validators.required, Validators.email]),
      guestCellphone: new FormControl('', Validators.required),
      companion: new FormControl(false),
      companionName: new FormControl('')
    });

    // Validación del companion
    this.form.get('companion')?.valueChanges.subscribe((value) => {
      if (value) {
        this.form.get('companionName')?.setValidators(Validators.required);
      } else {
        this.form.get('companionName')?.clearValidators();
      }
      this.form.get('companionName')?.updateValueAndValidity();
    });

    // Suscripción a los cambios del campo attendance
    this.form.get('attendance')?.valueChanges.subscribe((value) => {
      if (value === 'no') {
        this.resetSpecificFormFields(); // Limpia los campos si se selecciona 'no'
      }
    });
  }

  // Método para limpiar campos específicos del formulario
  resetSpecificFormFields() {
    // Aquí defines qué campos quieres limpiar
    this.form.get('guestName')?.reset(); // Restablece el campo nombre
    this.form.get('guestEmail')?.reset(); // Restablece el campo email
    this.form.get('guestCellphone')?.reset(); // Restablece el campo celular
    this.form.get('companion')?.setValue(false); // Desmarca el checkbox de acompañante
    this.form.get('companionName')?.reset(); // Restablece el campo de nombre de acompañante
  }

  // Método para resetear todos los campos del formulario
  resetFormFields() {
    this.form.reset();  // Resetea todos los campos del formulario
  }

  ngAfterViewInit() {
    this.guideOverlay.nativeElement.style.display = 'none';
    this.closeGuideButton.nativeElement.style.display = 'none';

    this.sections = document.querySelectorAll('.section');
    window.scrollTo(0, 0);
    window.addEventListener('scroll', () => this.handleScroll());
    this.generatePetals();
    this.observeSection2();

    // Obtener el modal por su ID
    const myModalEl = document.getElementById('exampleModal');
    
    // Asegúrate de que el modal existe antes de agregar el evento
    if (myModalEl) {
      myModalEl.addEventListener('hidden.bs.modal', () => {
        this.onModalClose(); // Llama al método para limpiar campos
      });
    }
  }

  // Método llamado al cerrar el modal
  onModalClose() {
    this.resetFormFields(); // Limpiar los campos del formulario al cerrar el modal
  }

  closeFocus() {
    this.guideOverlay.nativeElement.style.display = 'none';
    this.closeGuideButton.nativeElement.style.display = 'none';
    localStorage.setItem('guideClosed', 'true'); // Guardar el estado de la guía como cerrada
    this.guideClosed = true; // Actualizar el estado en la clase
  }

  onCompanionChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.companion = inputElement.checked; // Asignar el valor de checked a la propiedad companion
  }

  handleScroll() {
    const currentScroll = window.pageYOffset;
    const screenHeight = window.innerHeight;

    // Verifica si hemos llegado al final de la sección actual
    const sectionBottom = (this.sections[this.currentSectionIndex] as HTMLElement).getBoundingClientRect().bottom + currentScroll;

    if (currentScroll + screenHeight >= sectionBottom) {
      this.currentSectionIndex = Math.min(this.currentSectionIndex + 1, this.sections.length - 1);
      this.scrollToSection(this.currentSectionIndex);
    }
  }

  scrollToSection(index: number) {
    const targetSection = this.sections[index] as HTMLElement;

    if (targetSection) {
      const startY = window.pageYOffset;
      const targetY = targetSection.offsetTop;
      const distance = targetY - startY;
      const duration = 1000; // Tiempo total de desplazamiento en milisegundos
      let startTime: number | null = null;

      const animateScroll = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1); // Asegura que no exceda 1
        const easing = this.easeInOutQuad(progress); // Función de easing

        window.scrollTo(0, startY + distance * easing);

        if (progress < 1) {
          requestAnimationFrame(animateScroll);
        }
      };

      requestAnimationFrame(animateScroll);
    }
  }

  // Función de easing para suavizar el movimiento
  easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  observeSection2() {
    const section2 = document.querySelector('#section2');
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !this.guideClosed) { // Verifica si la guía está cerrada
        this.guideOverlay.nativeElement.style.display = 'flex'; // Mostrar la guía al entrar en la sección 2
        this.closeGuideButton.nativeElement.style.display = 'flex';
      } else {
        this.guideOverlay.nativeElement.style.display = 'none'; // Ocultar si salimos de la sección 2
        this.closeGuideButton.nativeElement.style.display = 'none';
      }
    }, { threshold: 0.5 });

    if (section2) {
      observer.observe(section2);
    }
  }

  private generatePetals() {
    const petalsContainer = document.querySelector('.petals-container') as HTMLElement;
    for (let i = 0; i < 50; i++) {
      const petal = document.createElement('div');
      petal.classList.add('petal');
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDelay = `${Math.random() * 10}s`;
      petal.style.animationDuration = `${Math.random() * 5 + 5}s`;
      petalsContainer.appendChild(petal);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      this.sheetdbService.postGuestData(
        formData.attendance,
        formData.guestName,
        formData.guestEmail,
        formData.guestCellphone,
        formData.companionName
      ).subscribe(
        (response) => {
          console.log('Data submitted successfully:', response);
          this.resetFormFields();  // Resetea el formulario después de enviar los datos
        },
        (error) => {
          console.error('Error submitting data:', error);
        }
      );
    } else {
      console.error('Please fill out all fields.');
    }
  }

  ngOnDestroy() {
    // Limpia el listener al destruir el componente
    const myModalEl = document.getElementById('exampleModal');
    if (myModalEl) {
      myModalEl.removeEventListener('hidden.bs.modal', this.onModalClose);
    }
  }

}