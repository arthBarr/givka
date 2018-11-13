import {
  Component, OnInit, ViewEncapsulation, OnDestroy, HostListener,
} from '@angular/core';
import { findIndex } from 'lodash';
import { WikiartService } from '../../services/wikiart.service';
import { Painting } from '../../factories/painting';
import { Artist } from '../../factories/artist';
import { BroadcastService } from '../../services/broadcast.service';
import { ArtistDetails } from '../../factories/artistDetails';

@Component({
  selector: 'art-component',
  templateUrl: './art.component.html',
  styleUrls: ['./art.component.scss'],
  encapsulation: ViewEncapsulation.None
  })
export class ArtComponent implements OnInit, OnDestroy {
  items

  showPopup: boolean = false;

  loading: boolean = true;

  popupPainting: Painting;

  artistDetails: ArtistDetails

  artists: Artist[]

  tabSelected: string;

  subscriptionPortrait: any;

  subscriptionArtistUrl

  intervalId;

  constructor(
    private wikiart: WikiartService,
    private broadcast: BroadcastService,
  ) { }

  ngOnInit() {
    this.subscriptionPortrait = this.broadcast.getPortrait()
      .subscribe((subject) => {
        this.onClickPortrait(subject.portrait, subject.event);
      });

    this.subscriptionArtistUrl = this.broadcast.getArtistUrl()
      .subscribe((subject) => {
        this.onClickArtist(subject.artistUrl);
      });

    this.onClickArtists();
  }

  ngOnDestroy() {
    this.cancelArrayDelay();
    this.subscriptionPortrait.unsubscribe();
    this.subscriptionArtistUrl.unsubscribe();
  }

  onCloseArtist() {
    this.cancelArrayDelay();
    this.artistDetails = null;
    this.onClickDiscover();
  }

  onClickDiscover() {
    this.loading = true;
    this.tabSelected = 'discover';
    this.cancelArrayDelay();
    this.wikiart.getMostViewedPaintings()
      .then((paintings) => {
        this.arrayDelay(paintings);
      })
      .finally(() => { this.loading = false; });
  }

  onClickArtists() {
    this.loading = true;
    this.tabSelected = 'artists';
    this.cancelArrayDelay();
    this.wikiart.getPopularArtists()
      .then((artists) => {
        this.arrayDelay(artists);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  onClickArtist(artistUrl) {
    this.loading = true;
    this.showPopup = false;
    this.tabSelected = 'artist-details';
    this.cancelArrayDelay();
    this.wikiart.getArtistDetails(artistUrl)
      .then((artist) => {
        this.arrayDelay(artist.paintings);
        this.artistDetails = artist;
      })
      .finally(() => { this.loading = false; });
  }

  onClickPortrait(portrait, $event) {
    if (portrait instanceof Painting) {
      this.showPopup = true;
      this.popupPainting = portrait;
    } else {
      this.onClickArtist(portrait.artistUrl);
    }
  }

  private arrayDelay(array) {
    this.items = [];
    let i = 0;
    this.intervalId = setInterval(() => {
      if (i === array.length) { this.cancelArrayDelay(); } else {
        this.items.push(array[i++]);
      }
    }, 50);
  }

  cancelArrayDelay() {
    clearInterval(this.intervalId);
  }
}
