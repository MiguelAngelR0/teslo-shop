import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { Pagination } from 'swiper/modules';

@Injectable({providedIn: 'root'})
export class PaginationService {
  private ActivatedRoute = inject(ActivatedRoute);


  currentPage = toSignal(
    this.ActivatedRoute.queryParamMap.pipe(
      map(params => (params.get('page') ? + params.get('page')! : 1)),
      map(page => (isNaN(page) ? 1 : page)) // si viene un string en la pagina, sera un 1
    ),
    {initialValue:1} //Para siempre tener un valor y que no sea undefined
  )
}
