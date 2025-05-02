
import { Component, inject } from '@angular/core';
import { ProductCardComponent } from '@products/components/product-card/product-card.component';

import {rxResource} from '@angular/core/rxjs-interop'
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { productsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { delay } from 'rxjs';


@Component({
  selector: 'app-home-page',
  imports: [ProductCardComponent, PaginationComponent],
  templateUrl: './home-page.component.html',
})
export class HomePageComponent {
  paginationService = inject(PaginationService)
  productsService = inject(productsService);



  productResource = rxResource({
    request: () => ({ page: this.paginationService.currentPage() - 1}),
    loader: ({request}) => {
      return this.productsService.getProducts({
        offset: request.page * 9,
      }).pipe(
        delay(1500)
      )
    }
  })


 }


