import { Component, computed, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [RouterLink],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  pages = input(0); //si no hay paginas que no aparezca ningun boton
  currentPage = input<number>(1);
  //Linked singal permite inicializar una señal con un valor, pero una vez ya inicializada, se trabaja comoo si fuera una señal comun y corriente
  activePage = linkedSignal(this.currentPage)

  getPagesList = computed(() => {
    return Array.from({length : this.pages()}, (_,i) => i+1 ); //Array de paginas basdo en numeros
  })

 }
