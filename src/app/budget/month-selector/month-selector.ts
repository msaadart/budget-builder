import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-month-selector',
  imports: [],
  templateUrl: './month-selector.html',
  styleUrl: './month-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthSelector {
  @Output() rangeChange = new EventEmitter<{ start: Date, end: Date }>();


  apply(startStr: string, endStr: string) {
    if (!startStr || !endStr) return alert('Select both start and end');
    const [sY, sM] = startStr.split('-').map(Number);
    const [eY, eM] = endStr.split('-').map(Number);
    const s = new Date(sY, sM - 1, 1);
    const e = new Date(eY, eM - 1, 1);
    this.rangeChange.emit({ start: s, end: e });
  }


  reset() {
    this.rangeChange.emit({ start: new Date(2024, 0, 1), end: new Date(2024, 11, 1) });
  }
}
