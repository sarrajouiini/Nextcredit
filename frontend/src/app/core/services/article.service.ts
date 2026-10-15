import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface ArticleAuthor {
  name: string;
  initials: string;
  color: string;
  role: string;
  roleEn?: string;
}

export interface Article {
  id: number;
  slug: string;
  category: string;
  categoryEn?: string;
  categoryColor: string;
  coverGradient: string;
  coverIcon: string;
  coverAccent: string;
  coverVariant?: number;
  title: string;
  titleEn?: string;
  excerpt: string;
  excerptEn?: string;
  author: ArticleAuthor;
  date: string;
  dateEn?: string;
  readTime: string;
  tags: string[];
  tagsEn?: string[];
  content: string;
  contentEn?: string;
}

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly url = '/assets/data/articles.json';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Article[]> {
    return this.http.get<Article[]>(this.url);
  }

  getBySlug(slug: string): Observable<Article | undefined> {
    return this.getAll().pipe(
      map(articles => articles.find(a => a.slug === slug))
    );
  }
}
