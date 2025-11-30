import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BudgetStore } from '../app/budget/budget-store';
import { BudgetTable } from './budget/budget-table/budget-table';
import { MonthSelector } from './budget/month-selector/month-selector';

@Component({
  selector: 'app-root',
  imports: [ BudgetTable,  MonthSelector],
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
   store = new BudgetStore();

  onRangeChange({ start, end }: { start: Date; end: Date }) {
    this.store.setMonthsFromRange(start, end);
  }

}
