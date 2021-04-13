import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Book } from '../book'

@Injectable({
  providedIn: 'root'
})
export class BookServiceService {

  bookUrl = "http://localhost:3000/books";
  bookDetails: Book[] = [
    { id: 101, name: 'Angular by Krishna', category: 'Angular', title: 'hibru', author: 'sibru' },
    { id: 102, name: 'Core Java by Vishnu', category: 'Java', title: 'kibru', author: 'gibry' },
    { id: 103, name: 'NgRx by Rama', category: 'Angular', title: 'lebru', author: 'sintu' }
  ];

  constructor(private http: HttpClient) { }

  getBooksFromHere(): Observable<Book[]> {
    return of(this.bookDetails);
  }

  getBooksFromStore(): Observable<Book[]> {
    return this.http.get<Book[]>(this.bookUrl);
  }

  getFavBookFromStore(id: number): Observable<Book> {
    return this.http.get<Book>(this.bookUrl + "/" + id);
  }

  getBooksByCategoryFromStore(category: string): Observable<Book[]> {
    return this.http.get<Book[]>(this.bookUrl + "?category=" + category);
  }
}
