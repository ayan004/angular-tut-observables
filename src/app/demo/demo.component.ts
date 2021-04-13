import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../book';
import { BookServiceService } from '../services/book-service.service';
// import { map } from 'rxjs/add/operator/map';
import { of } from 'rxjs';
import { map, mergeMap, switchMap, catchError, retry } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
// import 'rxjs/add/operator/retry';
// import 'rxjs/add/operator/mergeMap';
// import { of as observableOf } from 'rxjs/observable/of';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {

  allBooks$: Observable<Book[]> | undefined;
  favBook$: Observable<Book> | undefined;
  softBooks: Book[] | undefined;
  favBookNameO$: Observable<string> | undefined;
  favBookName: string | undefined;
  myAllfavBooks$: Observable<Book[]> | undefined;
  allFavBooks: Book[] | undefined;
  similarBooks$: Observable<Book[]> | undefined;
  booksFromLocalStore$: Observable<Book[]> | undefined;
  bookName: string | undefined;

  constructor(private bookService: BookServiceService) { }

  ngOnInit(): void {
    this.getFavBook();
    this.getBooks();
    this.getsoftBooks();
    this.getBookName();
    this.getBookNameO();
    this.getAllFavBooks_usingObservableVariable();
    this.getAllFavBooks_withoutUsingObservableVariable();
    this.searchSimilarBooks(2);
    this.callGetBooksFromArrayCreatedInService();
  }

  getBooks() {
    this.allBooks$ = this.bookService.getBooksFromStore();
    // console.log(this.allBooks$);
  }

  getFavBook() {
    this.favBook$ = this.bookService.getFavBookFromStore(4);
    // console.log(this.favBook$);
  }

  getsoftBooks() {
    this.bookService.getBooksFromStore().subscribe(books => {
      this.softBooks = books;
      // console.log("///////////////");
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          //A client-side or network error occurred.
          console.log('An error occurred:///////////', err.error.message);
        } else {
          //Backend returns unsuccessful response codes such as 404, 500 etc.
          console.log('Backend returned status code:>>>>>>>>>>>> ', err.status);
          console.log('Response body:>>>>>>>>>>>>', err.error);
        }
        retry(3)
      },
    );
  }

  getBookNameO() {
    this.favBookNameO$ = this.bookService.getFavBookFromStore(6).pipe(map(book => {
      if (book.name.length < 8) {
        return book.name;
      } else {
        throw ('Length more han 8');
      }
    }))
      .pipe(catchError((error: HttpErrorResponse) => {
        console.log(error);
        //return of("Default Name");
        throw (error.message || error);
      }));

    //doing the same stuff as the above code. Extra added subscribe code in it
    // this.bookService.getFavBookFromStore(6).pipe(map(book => {
    //   if (book.name.length < 2) {
    //     return book.name;
    //   } else {
    //     throw ('Length more han 2');
    //   }
    // }))
    //   .pipe(catchError((error: HttpErrorResponse) => {
    //     console.log(error);
    //     //return of("Default Name");
    //     throw (error.message || error);
    //   }))
    //   .subscribe(name => {
    //     this.bookName = name;
    //     console.log(name);
    //   },
    //     err => {
    //       console.log(err);
    //     }
    //   );
  }

  //here I am just subscribing to get the data
  getBookName() {
    this.bookService.getFavBookFromStore(6).subscribe(book => {
      this.favBookName = book.name;
    });
  }

  //here also I am subscribing to get the data, but before that I have to use map and pipe(so I am commenting out this function, and using the above written function)
  // getBookName() {
  //   this.bookService.getFavBookFromStore(4).pipe(map(book => book.name)).subscribe(name => {
  //     this.favBookName = name;
  //   });
  // }

  getAllFavBooks_usingObservableVariable() {
    this.myAllfavBooks$ = this.bookService.getFavBookFromStore(4)
      .pipe(mergeMap(book => this.bookService.getBooksByCategoryFromStore(book.category)));
  }

  getAllFavBooks_withoutUsingObservableVariable() {
    this.bookService.getFavBookFromStore(1).pipe(mergeMap(book => {
      let category = book.category;
      return this.bookService.getBooksByCategoryFromStore(category);
    })).subscribe(books => {
      this.allFavBooks = books;
    });
  }

  searchSimilarBooks(id: number) {
    this.similarBooks$ = this.bookService.getFavBookFromStore(id)
      .pipe(switchMap(book => {
        let category = book.category;
        return this.bookService.getBooksByCategoryFromStore(category);
      }));
  }

  callGetBooksFromArrayCreatedInService() {
    this.booksFromLocalStore$ = this.bookService.getBooksFromHere();
  }

}
