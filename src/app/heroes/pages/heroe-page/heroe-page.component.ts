import { Component, Inject, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'heroes-heroe-page',
  templateUrl: './heroe-page.component.html',
  styles: [],
})
export class HeroePageComponent implements OnInit {
  public hero?: Hero;

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesService.getHero(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('heroes/list');

        return (this.hero = hero);
      });
  }

  goBack() {
    this.router.navigateByUrl('heroes/list');
  }
}
