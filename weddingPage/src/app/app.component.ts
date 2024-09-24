import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

// Importa el tooltip de Bootstrap si no está cargado globalmente
declare var bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('tooltipElement', { static: false }) tooltipElement!: ElementRef;
  @ViewChild('guideOverlay', { static: false }) guideOverlay!: ElementRef;
  @ViewChild('closeGuide', { static: false }) closeGuideButton!: ElementRef;

  private sections: NodeListOf<Element> = document.querySelectorAll('.section');
  private hasShownTooltip = localStorage.getItem('hasShownTooltip') === 'true';
  private guideClosed = localStorage.getItem('guideClosed') === 'true'; // Nuevo estado
  private currentSectionIndex = 0; // Índice de la sección actual
  attendance: { value: string } = { value: '' }; // Inicializas el valor
  companion: boolean = false;

  
  constructor() { }

  ngAfterViewInit() {
    // Asegúrate de que la guía esté oculta inicialmente
    this.guideOverlay.nativeElement.style.display = 'none';
    this.closeGuideButton.nativeElement.style.display = 'none';

    this.sections = document.querySelectorAll('.section');

    // Asegúrate de iniciar en la sección 1 (scroll a la sección 1)
    window.scrollTo(0, 0);

    // Agregar el listener para el scroll
    window.addEventListener('scroll', () => this.handleScroll());

    // Generar pétalos al inicio
    this.generatePetals();

    // Iniciar la observación de la sección 2
    this.observeSection2();
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

}