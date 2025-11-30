import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BudgetStore } from '../budget-store';
import { CommonModule } from '@angular/common';
import { MonthValue, ParentCategory, SubCategory } from '../../shared/interface/budget';

@Component({
  selector: 'app-budget-table',
  imports: [CommonModule],
  templateUrl: './budget-table.html',
  styleUrl: './budget-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetTable {
  @Input() store!: BudgetStore;

  /** Get value for a specific month */
  getValue(sub: SubCategory, month: string): number {
    return sub.values.find((v: MonthValue) => v.month === month)?.value ?? 0;
  }

  /** When user types a value in input */
  onInput(
    event: Event,
    parentId: string,
    subId: string,
    month: string
  ): void {
    const input = event.target as HTMLInputElement;
    const val = Number(input.value || 0);
    this.store.updateCell(parentId, subId, month, val);
  }

  /** Right click apply-to-all */
  onRightClick(
    ev: MouseEvent,
    parentId: string,
    subId: string
  ): void {
    ev.preventDefault();
    const v = prompt('Apply value to all months for this row (enter number):');
    if (v !== null) {
      this.store.applyToAll(parentId, subId, Number(v || 0));
    }
  }

  /** Subtotal for a month */
  calcSubTotal(parent: ParentCategory, month: string): number {
    return parent.subCategories.reduce((acc: number, sub: SubCategory) => {
      const val =
        sub.values.find((v: MonthValue) => v.month === month)?.value ?? 0;
      return acc + val;
    }, 0);
  }
}
