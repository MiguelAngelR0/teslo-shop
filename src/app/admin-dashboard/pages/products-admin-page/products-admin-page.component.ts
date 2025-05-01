import { Component, inject, signal } from '@angular/core';
import { ProductTableComponent } from "../../../products/components/product-table/product-table.component";
import { rxResource } from '@angular/core/rxjs-interop';
import { productsService } from '@products/services/products.service';
import { PaginationService } from '@shared/components/pagination/pagination.service';
import { PaginationComponent } from "../../../shared/components/pagination/pagination.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-products-admin-page',
  imports: [ProductTableComponent, PaginationComponent, RouterLink],
  templateUrl: './products-admin-page.component.html',
})
export class ProductsAdminPageComponent {
  paginationService = inject(PaginationService);
  productsService = inject(productsService);

  productsPerPage = signal(10);



  productResource = rxResource({

    request: () => (
      {
        page: this.paginationService.currentPage() - 1,
        limit: this.productsPerPage(),
      }),
    loader: ({request}) => {
      console.log('Loading products for page', request);
      return this.productsService.getProducts({
        offset: request.page * 9,
        limit: request.limit,
      });
    }
  })

 }
