import { AfterViewInit, Component, Renderer2 } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient } from '@angular/common/http';
import { formatCurrency } from '@angular/common';

declare const $: any;

@Component({
  selector: 'app-forex',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, FooterComponent],
  templateUrl: './forex.component.html',
  styleUrl: './forex.component.css',
})
export class ForexComponent implements AfterViewInit {
  private _table1: any;

  constructor(private renderer: Renderer2, private httpClient: HttpClient) {}

  ngAfterViewInit(): void {
    this.renderer.removeClass(document.body, 'sidebar-open');
    this.renderer.addClass(document.body, 'sidebar-closed');
    this.renderer.addClass(document.body, 'sidebar-collapse');

    this._table1 = $('#table1').DataTable({
      columnDefs: [
        {
          targets: 3,
          className: 'text-right',
        },
      ],
    });

    this.bindTable1();
  }

  bindTable1(): void {
    console.log('bindTable1()');

    var ratesUrl =
      'https://openexchangerates.org/api/latest.json?app_id=9d00a8c0800644d6a358ddf3b33b49c2';

    const currenciesUrl = 'https://openexchangerates.org/api/currencies.json';

    this.httpClient.get(currenciesUrl).subscribe((currencies: any) => {
      this.httpClient.get(ratesUrl).subscribe((data: any) => {
        const rates = data.rates;
        let index = 1;

        for (const currency in rates) {
          const currencyName = currencies[currency];

          const rate = rates.IDR / rates[currency];
          const formatRate = formatCurrency(rate, 'en-US', '', currency);

          console.log(`${currency}: ${currencyName} - ${formatRate}`);

          const row = [index++, currency, currencyName, formatRate];
          this._table1.row.add(row);
          this._table1.draw(false);
        }
      });
    });
  }
}
