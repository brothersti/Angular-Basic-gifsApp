import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root'
})

export class GifsService {

  private apiKey: string = '5zAuCmc0URX34cUyA8gAfX3Sc9sbGRt2';
  private baseUrl: string = 'https://api.giphy.com/v1/gifs';
  private _historial: string[] = [];

  public resultados: Gif[] = [];


  get historiales() {
    return [...this._historial];
  }


  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || []; //mantener la informacón en el local storage
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
  }

  buscarGifs(query: string) {

    if (!this._historial.includes(query.trim().toLocaleLowerCase())) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10); //para mantener 10 registros

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('limit', '10')
      .set('q', query)
      .set('api_key', this.apiKey)


    this.http.get<SearchGifsResponse>(`${this.baseUrl}/search`, {params})
      .subscribe((resp) => {
        this.resultados = resp.data;

        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });


  }
}
