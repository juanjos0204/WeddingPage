import { Component, AfterViewInit, ElementRef, ViewChild, OnInit, Input, OnDestroy } from '@angular/core';
import { SheetdbService } from './common/shared/services/sheetDB.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Helpers } from './common/utils/helpers.utils';
import { EmailService } from './common/shared/services/emailJS.service';

// Importa el tooltip de Bootstrap si no está cargado globalmente
declare var bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnInit, OnDestroy {

  @ViewChild('tooltipElement', { static: false }) tooltipElement!: ElementRef;
  @ViewChild('guideOverlay', { static: false }) guideOverlay!: ElementRef;
  @ViewChild('closeGuide', { static: false }) closeGuideButton!: ElementRef;

  isLoading: boolean = false;  // Bandera que controla el estado de carga
  companion: boolean = false;  // Aquí declaramos la propiedad companion

  dateFormated: string = '';
  emailError: boolean = false;
  emailSent: boolean = false;
  photoFormValue: string = '';
  urlMap: string = '';
  urlPage: string = '';

  private sections: NodeListOf<Element> = document.querySelectorAll('.section');
  private guideClosed = localStorage.getItem('guideClosed') === 'true'; // Nuevo estado
  private currentSectionIndex = 0; // Índice de la sección actual

  form!: FormGroup;  // Declaramos el FormGroup para el formulario

  constructor(private sheetdbService: SheetdbService, private helpers: Helpers, private emailService: EmailService) { }

  ngOnInit() {
    this.dateFormated = this.helpers.formatDateToDDMMYYYY_HHMMSS(new Date());

    this.getDataFromSheet();

    this.form = new FormGroup({
      attendance: new FormControl('', Validators.required),
      guestName: new FormControl('', Validators.required),
      guestEmail: new FormControl('', [Validators.required, Validators.email]),
      guestCellphone: new FormControl('', Validators.required), // Solo números
      companion: new FormControl(false),
      companionName: new FormControl('')
    });

    // Suscripción a los cambios del campo attendance
    this.form.get('attendance')?.valueChanges.subscribe((value) => {
      if (value === 'no') {
        this.form.get('guestName')?.setValidators([Validators.required]);
        this.form.get('guestEmail')?.clearValidators();
        this.form.get('guestCellphone')?.clearValidators();
        this.form.get('companion')?.clearValidators();
        this.form.get('companionName')?.clearValidators();
        this.dateFormated = this.helpers.formatDateToDDMMYYYY_HHMMSS(new Date());
      } else if (value === 'yes') {
        this.form.get('guestName')?.setValidators([Validators.required]);
        this.form.get('guestEmail')?.setValidators([Validators.required, Validators.email]);
        this.form.get('guestCellphone')?.setValidators([Validators.required]);
        this.form.get('companion')?.setValidators([]);
        this.form.get('companionName')?.setValidators([]);
        this.dateFormated = this.helpers.formatDateToDDMMYYYY_HHMMSS(new Date());
      }

      this.form.get('guestName')?.updateValueAndValidity();
      this.form.get('guestEmail')?.updateValueAndValidity();
      this.form.get('guestCellphone')?.updateValueAndValidity();
      this.form.get('companion')?.updateValueAndValidity();
      this.form.get('companionName')?.updateValueAndValidity();
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
      if (value) {
        this.resetSpecificFormFields(); // Limpia los campos si se selecciona 'no'
      }
    });
  }

  // Método para limpiar campos específicos del formulario
  resetSpecificFormFields() {
    this.form.get('guestName')?.reset();
    this.form.get('guestEmail')?.reset();
    this.form.get('guestCellphone')?.reset();
    this.form.get('companion')?.setValue(false);
    this.form.get('companionName')?.reset();
  }

  // Método para resetear todos los campos del formulario
  resetFormFields() {
    this.form.reset();
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

    this.form.get('attendance')?.valueChanges.subscribe((value) => {
      if (value == 'yes') {
        this.showThankYouMessage(); // Muestra el toast
      }
    });

  }

  scrollToSectionById(sectionId: string) {
    const section = document.querySelector(`#${sectionId}`) as HTMLElement;

    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    } else {
      console.error(`No se encontró la sección con el ID: ${sectionId}`);
    }
  }

  getDataFromSheet() {
    this.sheetdbService.getFotoFormularioField().subscribe(
      (data) => {
        if (data && data.length > 0) {
          // Asignar los valores directamente de las columnas del Excel
          if (data[0]?.FotoFormulario) {
            this.photoFormValue = data[0].FotoFormulario; // Columna 'FotoFormulario'
          }
          if (data[0]?.PaginaWeb) {
            this.urlPage = data[0].PaginaWeb; // Columna 'PaginaWeb'
          }
          if (data[0]?.Ubicacion) {
            this.urlMap = data[0].Ubicacion; // Columna 'Ubicacion'
          }
  
          console.log('Foto:', this.photoFormValue);
          console.log('URL de página:', this.urlPage);
          console.log('URL de mapa:', this.urlMap);
        }
      },
      (error) => {
        console.error('Error al obtener los datos desde SheetDB', error);
      }
    );
  }

  capitalizeFirstLetter(event: Event) {
    const input = event.target as HTMLInputElement;
    const capitalizedValue = this.helpers.capitalizeFirstLetter(input.value);
    this.form.get('guestEmail')?.setValue(capitalizedValue);
  }

  // Validador personalizado para permitir solo números
  numericValidator(control: FormControl) {
    const value = control.value;
    // Verifica si el valor es un número y no está vacío
    if (value && !/^\d+$/.test(value)) {
      return { nonNumeric: true }; // Retorna un objeto de error si hay letras
    }
    return null; // Si es válido, retorna null
  }

  closeFocus() {
    this.guideOverlay.nativeElement.style.display = 'none';
    this.closeGuideButton.nativeElement.style.display = 'none';
    localStorage.setItem('guideClosed', 'true'); // Guardar el estado de la guía como cerrada
    this.guideClosed = true; // Actualizar el estado en la clase
  }

  onCompanionChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.companion = inputElement.checked;
  }

  handleScroll() {
    const currentScroll = window.pageYOffset;
    const screenHeight = window.innerHeight;

    // Verifica si se ha llegado al final de la sección actual
    const sectionBottom = (this.sections[this.currentSectionIndex] as HTMLElement).getBoundingClientRect().bottom + currentScroll;

    if (currentScroll + screenHeight >= sectionBottom) {
      this.currentSectionIndex = Math.min(this.currentSectionIndex + 1, this.sections.length - 1);
      this.scrollToSection(this.currentSectionIndex);
    }
  }

  scrollToSection(index: number) {
    console.log(`Scrolling to section: ${index}`);
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
        const progress = Math.min(timeElapsed / duration, 1);
        const easing = this.easeInOutQuad(progress);

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
      if (entries[0].isIntersecting && !this.guideClosed) {
        this.guideOverlay.nativeElement.style.display = 'flex';
        this.closeGuideButton.nativeElement.style.display = 'flex';
      } else {
        this.guideOverlay.nativeElement.style.display = 'none';
        this.closeGuideButton.nativeElement.style.display = 'none';
      }
    }, { threshold: 0.5 });

    if (section2) {
      observer.observe(section2);
    }
  }

  //Generador de petalos
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
      this.isLoading = true; // Activar el loader
      const formData = this.form.value; // Obtener los datos del formulario
      this.emailError = false; // Reinicia el error al enviar
      this.emailSent = false; // Reinicia el estado de envío

      if (!this.urlPage) {
        console.error('Error: La URL de la página no está disponible.');
        this.isLoading = false; // Desactivar el loader
        this.emailError = true; // Marcar error en el envío de email
        return;
      }

      // URL de invitación que será enviada por email
      let invitationUrl: string = this.urlPage; // Cambia a tu URL real

      // Enviar los datos del invitado a SheetDB
      this.sheetdbService.postGuestData(
        formData.attendance,
        this.helpers.capitalizeName(formData.guestName),
        this.dateFormated,
        formData.guestEmail ? formData.guestEmail.toLowerCase() : '',
        formData.guestCellphone,
        formData.companionName
      ).subscribe(
        (response) => {
          console.log('Datos enviados exitosamente:', response);

          if (formData.attendance === 'yes') {

            // Preparar datos para enviar el email
            const emailData = {
              name: this.helpers.capitalizeName(formData.guestName), // Variable {{name}} en la plantilla
              to_email: formData.guestEmail, // Correo del destinatario
              invitationUrl: invitationUrl // URL dinámica desde el frontend
            };

            // Enviar email usando el servicio de EmailJS
            this.emailService.sendEmail(emailData)
              .then((emailResponse) => {
                console.log('Email enviado exitosamente:', emailResponse);
                this.emailSent = true; // Marcar que el email fue enviado exitosamente
                this.emailError = false; // Limpiar el mensaje de error si el envío es exitoso

                // Reiniciar los campos del formulario
                this.resetFormFields();
              })
              .catch((error) => {
                console.error('Error al enviar el email:', error);
                this.emailError = true; // Marcar que hubo un error al enviar el email
                this.emailSent = false; // Asegurar que el estado de envío es false
              });

          }

        },
        (error) => {
          console.error('Error al enviar datos a SheetDB:', error);
        },
        async () => {
          // Asegúrate de que el modal se cierre antes de establecer isLoading en false
          await this.closeModal();
          this.isLoading = false; // Desactivar el loader al finalizar el proceso
          this.scrollToSectionById('section3');
        }
      );
    }
  }

  // Método para mostrar el Toast de agradecimiento
  private showThankYouMessage() {
    const toastEl = document.getElementById('thankYouToast');
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl); // Crear instancia del Toast
      toast.show(); // Mostrar el Toast
    }
  }

  // Método para cerrar el modal y devolver una promesa
  private closeModal(): Promise<void> {
    return new Promise((resolve) => {
      const myModalEl = document.getElementById('exampleModal');
      if (myModalEl) {
        const modal = bootstrap.Modal.getInstance(myModalEl); // Obtén la instancia del modal
        modal.hide(); // Cierra el modal

        // Espera un pequeño tiempo para que la animación de cierre termine
        setTimeout(() => {
          resolve(); // Resuelve la promesa
        }, 300); // Ajusta el tiempo según la duración de la animación
      } else {
        resolve(); // Resuelve de inmediato si no hay modal
      }
    });
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', () => this.handleScroll());
  }
}