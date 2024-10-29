import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable()
export class PaginatorService implements MatPaginatorIntl {
  changes = new Subject<void>();

  firstPageLabel = 'Első oldal';
  itemsPerPageLabel = '';
  lastPageLabel = 'Utolsó oldal';

  nextPageLabel = 'Következő oldal';
  previousPageLabel = 'Előző oldal';

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return `1. oldal`;
    }
    const amountPages = Math.ceil(length / pageSize);
    return page + 1 + ' / ' + amountPages;
  }
}
