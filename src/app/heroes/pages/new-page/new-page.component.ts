import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { filter, switchMap, tap } from 'rxjs';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { HeroesService } from '../../services/heroes.service';

import { Hero } from '../../interfaces/hero.interface';
import { Publisher } from '../../interfaces/hero.interface';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [],
})
export class NewPageComponent implements OnInit {
  public heroForm = new FormGroup({
    id: new FormControl(''),
    superhero: new FormControl('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', value: 'DC - Comics' },
    { id: 'Marvel Comics', value: 'Marvel - Comics' },
  ];

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHero(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('/heroes/list');

        return this.heroForm.reset(hero);
      });
  }

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;

    return hero;
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        this.showSnackbar(`${hero.superhero} was successfully updated`);
      });

      return;
    }

    this.heroesService.addHero(this.currentHero).subscribe((hero) => {
      this.showSnackbar(
        `${this.currentHero.superhero} was successfully created`
      );
      this.router.navigateByUrl(`/heroes/edit/${hero.id}`);
    });
  }

  onDeleteHero() {
    if (!this.currentHero.id) throw Error('Hero ID is required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => this.heroesService.deleteHero(this.currentHero.id))
      )
      .subscribe((wasDeleted) => {
        if (wasDeleted) {
          this.showSnackbar(
            `${this.currentHero.superhero} was successfully deleted`
          );

          this.router.navigateByUrl('/heroes/list');
        } else {
          this.showSnackbar(
            `${this.currentHero.superhero} couldn't be deleted`
          );
        }
      });
  }

  showSnackbar(message: string): void {
    this.snackbar.open(message, 'Close', { duration: 5000 });
  }
}
