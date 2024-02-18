import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, switchMap, tap} from 'rxjs';
// import { Album, Artist, SearchAlbumResponse, SearchAlbumTracksResponse, SearchArtistAlbumResponse, SearchArtistResponse, SearchTopTrackResponse, SearchTrackResponse, SpotiToken, Track } from '../interfaces/spotiapp.interface';

@Injectable({
  providedIn: 'root'
})
export class SpotiappService {
  private clientId: string = '9a6dcaf3e4e143ff8ea9f72ebe04c5c0';
  private clientSecret: string = 'b413dd6372f64f3eb8f5cc878a0f578c';
  tokenUrl: string = "https://accounts.spotify.com/api/token";
  apiUrl: string ="https://api.spotify.com/v1/"
  idAndSecret: string = btoa(this.clientId + ":" + this.clientSecret);
  private token: string = '';
  private tokenBirth: number = 0;
  private _tagsHistory : string[] = [];
  private _wrongTag : string = '';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
  }

  // Funciones que tienen que ver con el historial
  get tagsHistory() {
    return [...this._tagsHistory];
  }

  lastTag():string{
    if (this._wrongTag !== '') return this._wrongTag;
    if (this._tagsHistory.length === 0) return '';
    this.organizeHistory(this._tagsHistory[0]);
    return this._tagsHistory[0];
  }

  organizeHistory(tag:string){
    this._wrongTag = '';
    tag = tag.toLocaleLowerCase();

    if (this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter((oldTag) => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.slice(0, 5);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
    //console.log(this._tagsHistory);
  }

  private loadLocalStorage():void{
    if (!localStorage.getItem('history')) return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!);
  }

  eraseLast( wrongTag: string):void{
    console.log("holaaaaaaaaaa", wrongTag)
    this._tagsHistory.splice(0, 1);
    this._wrongTag = wrongTag;
    this.saveLocalStorage();
  }

  // Funciones que interactuan con el API

  body = 'grant_type=client_credentials';
  options = {
      headers: new HttpHeaders({
          'Authorization': 'Basic '.concat(this.idAndSecret),
          'Content-Type': 'application/x-www-form-urlencoded',
      })
  };

  // private getAccessToken(): Observable<string> {
  //   const currentTime = new Date().getTime();

  //   if (currentTime - this.tokenBirth < 2700000) {
  //     return of(this.token);
  //   }

  //   return this.http.post<SpotiToken>(this.tokenUrl, this.body, this.options)
  //     .pipe(
  //       map(response => response.access_token),
  //       tap(token => {
  //         this.token = token;
  //         this.tokenBirth = currentTime;
  //       }),
  //       catchError(() => of(''))
  //     );
  // }

  // searchArtist(term: string): Observable<SearchArtistResponse> {
  //   return this.getAccessToken().pipe(
  //     switchMap(token => {
  //       if (token) {
  //         const options = {
  //           headers: new HttpHeaders({
  //             'Authorization': `Bearer ${encodeURIComponent(token)}`
  //           }),
  //           params: new HttpParams({
  //             fromObject: {
  //               'q': term,
  //               'type': 'artist',
  //               'limit': '20',
  //             }
  //           })
  //         };
  //         const url = `${this.apiUrl}search`;

  //         return this.http.get<SearchArtistResponse>(url, options);
  //       } else {
  //         return of({} as SearchArtistResponse);
  //       }
  //     }),
  //     catchError(() => of({} as SearchArtistResponse))
  //   );
  // }


  // searchTrack(term: string): Observable<SearchTrackResponse> {
  //   return this.getAccessToken().pipe(
  //     switchMap(token => {
  //       if (token) {
  //         const options = {
  //           headers: new HttpHeaders({
  //             'Authorization': `Bearer ${encodeURIComponent(token)}`
  //           }),
  //           params: new HttpParams({
  //             fromObject: {
  //               'q': term,
  //               'type': 'track',
  //               'limit': '20',
  //             }
  //           })
  //         };
  //         const url = `${this.apiUrl}search`;

  //         return this.http.get<SearchTrackResponse>(url, options);
  //       } else {
  //         return of({} as SearchTrackResponse);
  //       }
  //     }),
  //     catchError(() => of({} as SearchTrackResponse))
  //   );
  // }

  // getArtistTopTracks(artistId: string): Observable<SearchTopTrackResponse> {
  //   return this.getAccessToken().pipe(
  //     switchMap(token => {
  //       if (token) {
  //         const options = {
  //           headers: new HttpHeaders({
  //             'Authorization': `Bearer ${encodeURIComponent(token)}`
  //           }),
  //           params: new HttpParams({
  //             fromObject: {
  //               'market': 'ES',
  //             }
  //           })
  //         };
  //         const url = `${this.apiUrl}artists/${artistId}/top-tracks`;

  //         return this.http.get<SearchTopTrackResponse>(url, options);
  //       } else {
  //         return of({} as SearchTopTrackResponse);
  //       }
  //     }),
  //     catchError(() => of({} as SearchTopTrackResponse))
  //   );
  // }
  // getArtistAlbums(artistId: string): Observable<SearchArtistAlbumResponse> {
  //   return this.getAccessToken().pipe(
  //     switchMap(token => {
  //       if (token) {
  //         const options = {
  //           headers: new HttpHeaders({
  //             'Authorization': `Bearer ${encodeURIComponent(token)}`
  //           }),
  //         };
  //         const url = `${this.apiUrl}artists/${artistId}/albums`;

  //         return this.http.get<SearchArtistAlbumResponse>(url, options);
  //       } else {
  //         return of({} as SearchArtistAlbumResponse);
  //       }
  //     }),
  //     catchError(() => of({} as SearchArtistAlbumResponse))
  //   );
  // }




  // getAlbumTracks(albumId: string): Observable<SearchAlbumTracksResponse> {
  //   return this.getAccessToken().pipe(
  //     switchMap(token => {
  //       if (token) {
  //         const options = {
  //           headers: new HttpHeaders({
  //             'Authorization': `Bearer ${encodeURIComponent(token)}`
  //           })
  //         };
  //         const url = `${this.apiUrl}albums/${albumId}/tracks`;

  //         return this.http.get<SearchAlbumTracksResponse>(url, options);
  //       } else {
  //         return of({} as SearchAlbumTracksResponse);
  //       }
  //     }),
  //     catchError(() => of({} as SearchAlbumTracksResponse))
  //   );
  // }


  // getAlbumReleases(): Observable<SearchAlbumResponse> {
  //   return this.getAccessToken().pipe(
  //     switchMap(token => {
  //       if (token) {
  //         const options = {
  //           headers: new HttpHeaders({
  //             'Authorization': `Bearer ${encodeURIComponent(token)}`
  //           }),
  //           params: new HttpParams({
  //             fromObject: {
  //               'limit': '20'
  //             }
  //           })
  //         };
  //         const url = `${this.apiUrl}browse/new-releases`;

  //         return this.http.get<SearchAlbumResponse>(url, options);
  //       } else {
  //         return of({} as SearchAlbumResponse);
  //       }
  //     }),
  //     catchError(() => of({} as SearchAlbumResponse))
  //   );
  // }

  // getTrack(trackId: string): Observable<Track> {
  //   return this.getAccessToken().pipe(
  //     switchMap(token => {
  //       if (token) {
  //         const options = {
  //           headers: new HttpHeaders({
  //             'Authorization': `Bearer ${encodeURIComponent(token)}`
  //           })
  //         };
  //         const url = `${this.apiUrl}tracks/${trackId}`;

  //         return this.http.get<Track>(url, options);
  //       } else {
  //         return of({} as Track);
  //       }
  //     }),
  //     catchError(() => of({} as Track))
  //   );
  // }

  // getArtist(artistId: string): Observable<Artist> {
  //   return this.getAccessToken().pipe(
  //     switchMap(token => {
  //       if (token) {
  //         const options = {
  //           headers: new HttpHeaders({
  //             'Authorization': `Bearer ${encodeURIComponent(token)}`
  //           })
  //         };
  //         const url = `${this.apiUrl}artists/${artistId}`;

  //         return this.http.get<Artist>(url, options);
  //       } else {
  //         return of({} as Artist);
  //       }
  //     }),
  //     catchError(() => of({} as Artist))
  //   );
  // }

  // getAlbum(albumId: string): Observable<Album> {
  //   return this.getAccessToken().pipe(
  //     switchMap(token => {
  //       if (token) {
  //         const options = {
  //           headers: new HttpHeaders({
  //             'Authorization': `Bearer ${encodeURIComponent(token)}`
  //           })
  //         };
  //         const url = `${this.apiUrl}albums/${albumId}`;

  //         return this.http.get<Album>(url, options);
  //       } else {
  //         return of({} as Album);
  //       }
  //     }),
  //     catchError(() => of({} as Album))
  //   );
  // }

}
