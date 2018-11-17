import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { TmdbService } from 'src/app/services/tmdb.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutingStateService } from 'src/app/services/routing-state.service';
import { Title } from '@angular/platform-browser';
import { Storage } from 'src/app/factories/storage';
import { SerieDetails } from 'src/app/factories/serie-details';
import { Serie } from 'src/app/factories/serie';
import { BackgroundService } from 'src/app/services/background.service';
import { UtilityService } from 'src/app/services/utility.service';

@Component({
  selector: 'serie-details-component',
  templateUrl: './serie-details.component.html',
  styleUrls: ['./serie-details.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class SerieDetailsComponent implements OnInit {
  serie: SerieDetails;

  loading = true;

  subRouter: Subscription;

  constructor(
    private tmdb: TmdbService,
    private routeActive: ActivatedRoute,
    private router: Router,
    private routingState: RoutingStateService,
    private title: Title,
    private background: BackgroundService,
    public utility : UtilityService,
  ) { }

  ngOnInit() {
    this.subRouter = this.routeActive.params.subscribe((routeParams) => {
      const { id } = routeParams;
      this.loadSerieDetails(+id);
    });
  }

  ngOnDestroy() {
    this.subRouter.unsubscribe();
  }

  onClickSeason(season, event) {
  }

  loadSerieDetails(id: number) {
    this.loading = true;
    this.tmdb.getSerieDetails(id)
      .then((serieDetails) => {
        this.background.addBackground(`https://image.tmdb.org/t/p/w300${serieDetails.backdrop}`);
        this.serie = serieDetails;
        this.title.setTitle(serieDetails.title);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onClickCredit(credit) {
    this.router.navigate([`/credit/${credit.id}`]);
  }

  close() {
    this.router.navigate([this.routingState.getSeriesLastUrl()]);
  }
}
