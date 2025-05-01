import { Component, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { productsService } from '../../../products/services/products.service';
import { ProductCarrouselComponent } from "../../../products/components/product-carrousel/product-carrousel.component";


@Component({
  selector: 'app-product-page',
  imports: [ProductCarrouselComponent],
  templateUrl: './product-page.component.html'
})
export class ProductPageComponent {

  activateRoute = inject(ActivatedRoute);
  productsService = inject(productsService)
  //snapshot pòrque no necesito que sea reactivo, el url
  productIdSlug= this.activateRoute.snapshot.params['idSlug'];

  productResource = rxResource({
    request : () => ({idSlug: this.productIdSlug}),
    loader: ({request}) =>
       this.productsService.getProductByIdSlug(request.idSlug)
  });




 }
