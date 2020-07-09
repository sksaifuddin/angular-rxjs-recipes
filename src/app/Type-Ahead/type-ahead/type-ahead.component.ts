import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { of, Observable, BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-type-ahead',
  templateUrl: './type-ahead.component.html',
  styleUrls: ['./type-ahead.component.scss']
})
export class TypeAheadComponent implements OnInit {
  typeAheadForm: FormGroup;
  private selectedContinentsSubject: BehaviorSubject<string[]> = new BehaviorSubject([]);
  private continents: string[] = ['africa','antarctica','asia','australia','europe','north america','south america'];
  selectedContinents$: Observable<string[]> = this.selectedContinentsSubject.asObservable();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForm();
    this.setFormChanges();
  }

  private buildForm(): void {
    this.typeAheadForm = this.fb.group({
      search: ''
    })
  }

  private setFormChanges(): void {
    this.typeAheadForm.get('search').valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(this.fakeContinentsRequest),
      tap((selectedContinents: string[]) => this.selectedContinentsSubject.next(selectedContinents))
    ).subscribe();
  }

  private fakeContinentsRequest = (keys: string): Observable<string[]> => of(this.getContinents(keys)).pipe(
    tap(() => console.log(`API CALL at ${new Date()}`))
  );

  private getContinents = (keys: string): string[] => [
      ...this.continents
    ].filter((continent: string) => continent.indexOf(keys.toLowerCase()) > -1 )

}
