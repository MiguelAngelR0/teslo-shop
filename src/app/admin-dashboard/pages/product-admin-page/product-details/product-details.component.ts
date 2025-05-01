import { Component, computed, inject, input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductCarrouselComponent } from '@products/components/product-carrousel/product-carrousel.component';
import { Product } from '@products/interfaces/product.interface';
import { FormUtils } from 'src/app/utils/form-utils';
import { FormErrorLabelComponent } from "../../../../shared/components/form-error-label/form-error-label.component";
import { productsService } from '../../../../products/services/products.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'product-details',
  imports: [ProductCarrouselComponent, ReactiveFormsModule, FormErrorLabelComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit {
  product = input.required<Product>();

  fb = inject(FormBuilder);
  router = inject(Router);
  productsService = inject(productsService);
  wasSaved = signal(false);

  imageFileList: FileList | undefined = undefined;
  tempImages = signal<string[]>([]);

  imagesToCarousel= computed(() => {
    const currentProductImages = [...this.product().images, ...this.tempImages()];
    return currentProductImages;
  })

  productForm = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    slug:['', [Validators.required, Validators.pattern(FormUtils.slugPattern)]],
    price:[0, [Validators.required, Validators.min(0)]],
    stock:[0, [Validators.required, Validators.min(0)]],
    sizes:[['']],
    images: [[]],
    tags:[''],
    gender:['men', [Validators.required, Validators.pattern(/men|women|kid|unisex/)]]
  })


  sizes = ['XS', 'S' , 'M' , 'L' , 'XL' , 'XXL'];

  ngOnInit(): void {
    this.setFormValue(this.product())
  }

  setFormValue(formLike: Partial<Product>){
    this.productForm.patchValue({tags: formLike.tags?.join(',')})
    this.productForm.reset(this.product()as any)
  }

  onSizeClicked(size:string){
    const currentSizes = this.productForm.value.sizes ?? [];
    if(currentSizes.includes(size)){
      currentSizes.splice(currentSizes.indexOf(size),1)
    } else {
      currentSizes.push(size);
    }

    this.productForm.patchValue({sizes:currentSizes})
  }

  async onSubmit() {
    const isValid = this.productForm.valid;
    this.productForm.markAllAsTouched();

    if (!isValid) return;
    const formValue = this.productForm.value;

    const productLike: Partial<Product> = {
      ...(formValue as any),
      tags:
        formValue.tags
          ?.toLowerCase()
          .split(',')
          .map((tag) => tag.trim()) ?? [],
    };

    if (this.product().id === 'new') {
      // Crear producto, espera a que tengamos el producto por el await y luego continua la ejecucion
      const product = await firstValueFrom(
        this.productsService.createProduct(productLike, this.imageFileList)
      );

      this.router.navigate(['/admin/products', product.id]);
    } else {
      await firstValueFrom(
        this.productsService.updateProduct(this.product().id, productLike, this.imageFileList)
      );
    }

    this.wasSaved.set(true);
    setTimeout(() => {
      this.wasSaved.set(false);
    }, 3000);
  }
  //Manejo de imagenes
  onFilesChanged(event:Event){
    const fileList=(event.target as HTMLInputElement).files;
    this.imageFileList = fileList ?? undefined; //El objeto que sirve para subir los archivos

    this.tempImages.set([])
    const imageUrls = Array.from(fileList ?? []).map(
      file => URL.createObjectURL(file) // esto solo lo convierte a un url para mostrarlo en pantalla
    )

   this.tempImages.set(imageUrls);
  }

 }
