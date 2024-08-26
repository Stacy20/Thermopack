import { Component, Input, SimpleChanges } from '@angular/core';
import { CardComponent } from "../card/card.component";
import { Services } from '../../../interfaces/services.interface';
import { Products } from '../../../interfaces/products.interface';
import { MainService } from '../../../services/service';

@Component({
    selector: 'shared-list-card',
    standalone: true,
    templateUrl: './list-card.component.html',
    styleUrl: './list-card.component.css',
    imports: [CardComponent]
})
export class ListCardComponent {
  public loading: boolean = true ;
  public areItems: boolean = false;

  @Input()
  public services: Services[] = [];
  @Input()
  public products: Products[] = [];
  @Input()
  public type!: number;
  @Input()
  public permissions!: number;

  constructor(
    private service: MainService,
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.type === 1) {
      this.service.areProducts().subscribe(async (areProducts) => {
        this.areItems = areProducts;
        if (!this.areItems) this.loading = false
      });
    }else{
      this.service.areServices().subscribe(async (areServices) => {
        this.areItems = areServices;
        if (!this.areItems) this.loading = false
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['products']) {
      if (this.areItems && this.products.length>0) this.loading = false
    }
    if (changes['services']) {
      if (this.areItems && this.services.length>0) this.loading = false
    }
  }
}
