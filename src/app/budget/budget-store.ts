import { signal, computed } from '@angular/core';
import { MonthValue, ParentCategory, SubCategory } from '../shared/interface/budget';
import { v4 as uuidv4 } from 'uuid';

export class BudgetStore {
  months = signal<string[]>([]);
  categories = signal<ParentCategory[]>([]);
  openingBalance = signal<number>(0);

  incomeTotal = computed(() => this.calcTotal('income'));
  expensesTotal = computed(() => this.calcTotal('expense'));
  profitLoss = computed(() => this.incomeTotal() - this.expensesTotal());
  closingBalance = computed(() => this.openingBalance() + this.profitLoss());

  constructor() {
    this.setDefaultMonths();
    this.setDefaultData();
  }

  setDefaultMonths() {
    this.months.set([
      'January 2024', 'February 2024', 'March 2024', 'April 2024', 'May 2024', 'June 2024',
      'July 2024', 'August 2024', 'September 2024', 'October 2024', 'November 2024', 'December 2024'
    ]);
  }

  setMonthsFromRange(start: Date, end: Date) {
    const months: string[] = [];
    const d = new Date(start.getTime());
    d.setDate(1);
    while (d <= end) {
      months.push(d.toLocaleString('en-US', { month: 'long', year: 'numeric' }));
      d.setMonth(d.getMonth() + 1);
    }
    this.months.set(months);
  }

  private calcTotal(type: 'income' | 'expense') {
    return this.categories()
      .filter(p => p.type === type)
      .flatMap(p => p.subCategories)
      .flatMap(s => s.values)
      .reduce((acc, v) => acc + (v.value || 0), 0);
  }

  updateCell(parentId: string, subId: string, month: string, value: number) {
    const clone: ParentCategory[] = structuredClone(this.categories());
    const parent: ParentCategory | undefined = clone.find(p => p.id === parentId);
    if (!parent) return;

    const sub: SubCategory | undefined = parent.subCategories.find(s => s.id === subId);
    if (!sub) return;

    const cell: MonthValue | undefined = sub.values.find(v => v.month === month);
    if (cell) cell.value = Number(value || 0);

    this.categories.set(clone);
  }

  applyToAll(parentId: string, subId: string, value: number) {
    const clone: ParentCategory[] = structuredClone(this.categories());
    const parent: ParentCategory | undefined = clone.find(p => p.id === parentId);
    if (!parent) return;

    const sub: SubCategory | undefined = parent.subCategories.find(s => s.id === subId);
    if (!sub) return;

    sub.values.forEach((v: MonthValue) => v.value = Number(value || 0));
    this.categories.set(clone);
  }

  deleteSubCategory(parentId: string, subId: string) {
    const clone = structuredClone(this.categories());
    const parent = clone.find(p => p.id === parentId);
    if (!parent) return;
    parent.subCategories = parent.subCategories.filter(s => s.id !== subId);
    this.categories.set(clone);
  }

  addParentCategory(type: 'income' | 'expense', name = 'New Parent') {
    const p: ParentCategory = {
      id: uuidv4(),
      type,
      name,
      subCategories: [] as SubCategory[]
    };
    this.categories.set([...this.categories(), p]);
  }

  private setDefaultData() {
    // Minimal sample data
    const months = this.months();
    this.categories.set([
      {
        id: uuidv4(),
        type: 'income',
        name: 'General Income',
        subCategories: [
          { id: uuidv4(), name: 'Sales', values: months.map(m => ({ month: m, value: 0 })) },
          { id: uuidv4(), name: 'Commission', values: months.map(m => ({ month: m, value: 0 })) }
        ]
      },
      {
        id: uuidv4(),
        type: 'expense',
        name: 'Operational Expenses',
        subCategories: [
          { id: uuidv4(), name: 'Cloud Hosting', values: months.map(m => ({ month: m, value: 0 })) },
        ]
      }
    ]);
  }
}
