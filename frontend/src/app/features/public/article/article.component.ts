import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, NgStyle, NgClass } from '@angular/common';
import { ArticleService, Article } from '../../../core/services/article.service';
import { TranslationService } from '../../../core/services/translation.service';
import { ArticleCoverComponent } from '../../../shared/components/article-cover/article-cover.component';

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [RouterLink, NgFor, NgIf, NgStyle, NgClass, ArticleCoverComponent],
  template: `
    <section class="na-hero">
      <div class="na-container">
        <span class="na-eyebrow">Blog & Insights</span>
        <h1>{{ ts.isEn() ? 'News & analyses' : 'Actualités & analyses' }}<br/><span class="na-accent">{{ ts.isEn() ? 'of intelligent credit' : 'du crédit intelligent' }}</span></h1>
        <p>{{ ts.isEn() ? 'Practical guides, feedback and analyses on the digital transformation of credit in Africa.' : "Guides pratiques, retours d'expérience et analyses sur la transformation digitale du crédit en Afrique." }}</p>
      </div>
    </section>

    <!-- Filtres -->
    <div class="na-filters-bar">
      <div class="na-container">
        <div class="na-filters">
          <button class="na-filter" [class.active]="activeFilter==='tous'" (click)="activeFilter='tous'">{{ ts.isEn() ? 'All' : 'Tous' }}</button>
          <button *ngFor="let cat of categories"
            class="na-filter" [class.active]="activeFilter===cat"
            (click)="activeFilter=cat">{{ cat }}</button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div class="na-loading" *ngIf="loading">
      <div class="na-spinner"></div>
      <span>{{ ts.isEn() ? 'Loading articles...' : 'Chargement des articles...' }}</span>
    </div>

    <!-- Featured -->
    <section class="na-section" *ngIf="!loading && featured">
      <div class="na-container">
        <div class="na-featured">
          <!-- Cover image -->
          <div class="na-feat-cover" [style.background]="featured.coverGradient">
            <app-article-cover [variant]="featured.coverVariant || 1" class="na-feat-cover-img"></app-article-cover>
            <div class="na-feat-cover-scrim"></div>
            <div class="na-feat-cover-content">
              <div class="na-feat-cover-badge">{{ ts.isEn() ? 'Featured article' : 'Article à la une' }}</div>
              <div class="na-feat-cover-meta">
                <div class="na-feat-av" [style.background]="featured.author.color">{{ featured.author.initials }}</div>
                <span class="na-feat-author-name">{{ featured.author.name }}</span>
                <span class="na-feat-read">{{ featured.readTime }} {{ ts.isEn() ? 'read' : 'de lecture' }}</span>
              </div>
            </div>
          </div>
          <!-- Body -->
          <div class="na-feat-body">
            <span class="na-cat" [style.background]="featured.categoryColor + '18'" [style.color]="featured.categoryColor">
              {{ ts.isEn() ? (featured.categoryEn || featured.category) : featured.category }}
            </span>
            <h2>{{ ts.isEn() ? (featured.titleEn || featured.title) : featured.title }}</h2>
            <p>{{ ts.isEn() ? (featured.excerptEn || featured.excerpt) : featured.excerpt }}</p>
            <div class="na-meta">
              <div class="na-author">
                <div class="na-av" [style.background]="featured.author.color">{{ featured.author.initials }}</div>
                <div>
                  <div class="na-author-name">{{ featured.author.name }}</div>
                  <div class="na-author-role">{{ ts.isEn() ? (featured.author.roleEn || featured.author.role) : featured.author.role }}</div>
                </div>
              </div>
              <div class="na-meta-right">
                <span><i class="bi bi-calendar3"></i> {{ ts.isEn() ? (featured.dateEn || featured.date) : featured.date }}</span>
                <span><i class="bi bi-clock"></i> {{ featured.readTime }}</span>
              </div>
            </div>
            <a [routerLink]="['/article', featured.slug]" class="na-read-btn">
              {{ ts.isEn() ? 'Read full article' : "Lire l'article complet" }} <i class="bi bi-arrow-right"></i>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Grille articles -->
    <section class="na-section" style="padding-top:0; background:#f8faff;" *ngIf="!loading">
      <div class="na-container">
        <div class="na-grid-header">
          <h3 class="na-grid-title">
            {{ activeFilter === 'tous' ? (ts.isEn() ? 'All articles' : 'Tous les articles') : activeFilter }}
            <span class="na-grid-count">{{ filteredArticles.length }}</span>
          </h3>
        </div>
        <div class="na-articles-grid">
          <article class="na-card" *ngFor="let art of filteredArticles">
            <!-- Cover image card -->
            <a [routerLink]="['/article', art.slug]" class="na-card-cover-link">
              <div class="na-card-cover" [style.background]="art.coverGradient">
                <app-article-cover [variant]="art.coverVariant || 1" class="na-card-cover-img"></app-article-cover>
                <div class="na-card-cover-scrim"></div>
                <div class="na-card-cover-time">
                  <i class="bi bi-clock"></i> {{ art.readTime }}
                </div>
              </div>
            </a>
            <div class="na-card-body">
              <span class="na-cat" [style.background]="art.categoryColor + '18'" [style.color]="art.categoryColor">
                {{ ts.isEn() ? (art.categoryEn || art.category) : art.category }}
              </span>
              <h4><a [routerLink]="['/article', art.slug]">{{ ts.isEn() ? (art.titleEn || art.title) : art.title }}</a></h4>
              <p>{{ ts.isEn() ? (art.excerptEn || art.excerpt) : art.excerpt }}</p>
              <div class="na-meta">
                <div class="na-author">
                  <div class="na-av" [style.background]="art.author.color">{{ art.author.initials }}</div>
                  <div>
                    <div class="na-author-name">{{ art.author.name }}</div>
                    <div class="na-author-date">{{ ts.isEn() ? (art.dateEn || art.date) : art.date }}</div>
                  </div>
                </div>
              </div>
              <div class="na-card-footer">
                <div class="na-tags-row">
                  <span class="na-tag-sm" *ngFor="let tag of (ts.isEn() ? (art.tagsEn || art.tags) : art.tags).slice(0,2)">{{ tag }}</span>
                </div>
                <a [routerLink]="['/article', art.slug]" class="na-link">
                  {{ ts.isEn() ? 'Read' : 'Lire' }} <i class="bi bi-arrow-right"></i>
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="na-newsletter">
      <div class="na-container">
        <div class="na-nl-box">
          <div class="na-nl-text">
            <h3>{{ ts.isEn() ? 'Stay informed of the latest trends' : 'Restez informé des dernières tendances' }}</h3>
            <p>{{ ts.isEn() ? 'Receive our best articles every week in your inbox.' : 'Recevez nos meilleurs articles chaque semaine dans votre boîte mail.' }}</p>
          </div>
          <div class="na-nl-form">
            <input type="email" [placeholder]="ts.isEn() ? 'your@email.com' : 'votre@email.com'" class="na-nl-input"/>
            <button class="na-nl-btn">{{ ts.isEn() ? 'Subscribe' : "S'abonner" }} <i class="bi bi-send-fill"></i></button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; }

    .na-hero { background: linear-gradient(135deg, #152247, #1a3f7a); padding: 100px 0 72px; text-align: center; color: #fff; }
    .na-container { max-width: 1280px; margin: 0 auto; padding: 0 28px; }
    .na-eyebrow {
      display: inline-block; font-size: 11.5px; font-weight: 700;
      color: #89B4E8; background: rgba(137,180,232,.15); border: 1px solid rgba(137,180,232,.3);
      padding: 5px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: .07em; margin-bottom: 16px;
    }
    .na-hero h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: clamp(32px,4vw,50px); line-height: 1.15; margin-bottom: 18px; }
    .na-accent { color: #89B4E8; }
    .na-hero p { font-size: 16px; color: rgba(255,255,255,.72); max-width: 540px; margin: 0 auto; line-height: 1.7; }

    .na-filters-bar { background: #fff; border-bottom: 1px solid #e8edf6; position: sticky; top: 72px; z-index: 100; }
    .na-filters { display: flex; gap: 8px; padding: 14px 0; overflow-x: auto; }
    .na-filter {
      background: none; border: 1px solid #e8edf6; border-radius: 20px;
      padding: 7px 16px; font-size: 13.5px; font-weight: 500; color: #6b7488;
      cursor: pointer; white-space: nowrap; transition: all .18s; font-family: 'Inter', sans-serif;
    }
    .na-filter:hover { border-color: #1E6FD9; color: #1E6FD9; }
    .na-filter.active { background: #1E6FD9; border-color: #1E6FD9; color: #fff; }

    .na-loading { display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 80px 0; color: #6b7488; }
    .na-spinner { width: 40px; height: 40px; border: 3px solid #e8edf6; border-top-color: #1E6FD9; border-radius: 50%; animation: spin .7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Featured ── */
    .na-section { padding: 72px 0; background: #fff; }
    .na-featured {
      display: grid; grid-template-columns: 1.1fr 1fr; gap: 0;
      background: #fff; border-radius: 28px; overflow: hidden;
      border: 1px solid #e8edf6; box-shadow: 0 12px 48px rgba(21,34,71,.09);
    }
    .na-feat-cover {
      position: relative; min-height: 400px; display: flex; flex-direction: column;
      justify-content: space-between; padding: 0; overflow: hidden; background: #152247;
    }
    .na-feat-cover-img {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
      transition: transform .4s ease;
    }
    .na-featured:hover .na-feat-cover-img { transform: scale(1.04); }
    .na-feat-cover-scrim {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(21,34,71,.15) 0%, rgba(21,34,71,.35) 55%, rgba(21,34,71,.88) 100%);
    }
    .na-feat-cover-content { position: relative; z-index: 2; padding: 36px; display: flex; flex-direction: column; justify-content: flex-end; height: 100%; }
    .na-feat-cover-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(255,255,255,.18); backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,.25); color: #fff;
      font-size: 11.5px; font-weight: 700; padding: 5px 14px; border-radius: 20px;
      text-transform: uppercase; letter-spacing: .07em; width: fit-content; margin-bottom: auto;
    }
    .na-feat-cover-meta { display: flex; align-items: center; gap: 10px; }
    .na-feat-av { width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #fff; border: 2px solid rgba(255,255,255,.4); flex-shrink: 0; }
    .na-feat-author-name { font-size: 13px; font-weight: 600; color: rgba(255,255,255,.9); }
    .na-feat-read { margin-left: auto; font-size: 12px; color: rgba(255,255,255,.65); background: rgba(255,255,255,.12); padding: 4px 10px; border-radius: 10px; }

    .na-feat-body { padding: 44px 40px; display: flex; flex-direction: column; justify-content: center; gap: 14px; }
    .na-cat { display: inline-block; font-size: 11.5px; font-weight: 700; padding: 4px 12px; border-radius: 12px; margin-bottom: 2px; text-transform: uppercase; letter-spacing: .06em; }
    .na-feat-body h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: clamp(18px,2vw,24px); color: #152247; line-height: 1.3; }
    .na-feat-body p { font-size: 14px; color: #6b7488; line-height: 1.7; }

    .na-meta { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .na-author { display: flex; align-items: center; gap: 10px; }
    .na-av { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
    .na-author-name { font-size: 13px; color: #152247; font-weight: 600; }
    .na-author-role { font-size: 11.5px; color: #9aa1b3; }
    .na-author-date { font-size: 11.5px; color: #9aa1b3; }
    .na-meta-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; font-size: 12.5px; color: #9aa1b3; }
    .na-meta-right i { margin-right: 4px; }
    .na-read-btn {
      display: inline-flex; align-items: center; gap: 8px; width: fit-content;
      background: #152247; color: #fff; padding: 12px 24px; border-radius: 14px;
      font-weight: 700; font-size: 14px; text-decoration: none; transition: background .2s, transform .15s;
      font-family: 'Plus Jakarta Sans', sans-serif; margin-top: 4px;
    }
    .na-read-btn:hover { background: #1E6FD9; transform: translateY(-1px); color: #fff; }

    /* ── Grid ── */
    .na-grid-header { display: flex; align-items: center; gap: 12px; margin-bottom: 32px; padding-top: 56px; }
    .na-grid-title { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 20px; color: #152247; display: flex; align-items: center; gap: 10px; }
    .na-grid-count { background: #1E6FD9; color: #fff; font-size: 12px; padding: 2px 9px; border-radius: 20px; font-weight: 700; }

    .na-articles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; padding-bottom: 72px; }
    .na-card { background: #fff; border-radius: 22px; border: 1px solid #e8edf6; overflow: hidden; transition: transform .25s, box-shadow .25s; }
    .na-card:hover { transform: translateY(-6px); box-shadow: 0 20px 48px rgba(21,34,71,.11); }

    .na-card-cover-link { display: block; }
    .na-card-cover {
      height: 200px; position: relative; overflow: hidden;
      display: flex; align-items: center; justify-content: center; background: #152247;
    }
    .na-card-cover-img {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
      transition: transform .35s ease;
    }
    .na-card:hover .na-card-cover-img { transform: scale(1.08); }
    .na-card-cover-scrim {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(21,34,71,0) 45%, rgba(21,34,71,.55) 100%);
    }
    .na-card-cover-time {
      position: absolute; bottom: 12px; right: 12px; z-index: 3;
      background: rgba(0,0,0,.35); backdrop-filter: blur(4px);
      color: rgba(255,255,255,.9); font-size: 11.5px; padding: 4px 10px;
      border-radius: 10px; display: flex; align-items: center; gap: 5px;
    }

    .na-card-body { padding: 20px 22px 22px; }
    .na-card-body h4 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 15px; color: #152247; line-height: 1.4; margin: 10px 0 8px; }
    .na-card-body h4 a { color: inherit; text-decoration: none; }
    .na-card-body h4 a:hover { color: #1E6FD9; }
    .na-card-body p { font-size: 13px; color: #6b7488; line-height: 1.65; margin-bottom: 14px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
    .na-card-footer { display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #e8edf6; padding-top: 12px; margin-top: 12px; }
    .na-tags-row { display: flex; gap: 6px; flex-wrap: wrap; }
    .na-tag-sm { background: #f0f4ff; color: #6b7488; font-size: 11px; padding: 3px 9px; border-radius: 8px; font-weight: 500; }
    .na-link { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: #1E6FD9; text-decoration: none; white-space: nowrap; }
    .na-link:hover { text-decoration: underline; }

    .na-newsletter { background: #f8faff; padding: 56px 0; }
    .na-nl-box {
      background: linear-gradient(135deg, #152247, #1E6FD9); border-radius: 24px;
      padding: 48px 56px; display: flex; align-items: center; justify-content: space-between; gap: 40px;
    }
    .na-nl-text h3 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: 22px; color: #fff; margin-bottom: 8px; }
    .na-nl-text p { font-size: 14px; color: rgba(255,255,255,.72); }
    .na-nl-form { display: flex; gap: 10px; flex-shrink: 0; }
    .na-nl-input { background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.25); border-radius: 12px; padding: 12px 18px; color: #fff; font-size: 14px; width: 260px; outline: none; }
    .na-nl-input::placeholder { color: rgba(255,255,255,.45); }
    .na-nl-btn { display: inline-flex; align-items: center; gap: 8px; background: #fff; color: #152247; padding: 12px 22px; border-radius: 12px; font-weight: 700; font-size: 14px; border: none; cursor: pointer; transition: transform .15s; font-family: 'Plus Jakarta Sans', sans-serif; }
    .na-nl-btn:hover { transform: translateY(-1px); color: #1E6FD9; }

    @media (max-width: 1024px) { .na-articles-grid { grid-template-columns: repeat(2,1fr); } }
    @media (max-width: 900px) { .na-featured { grid-template-columns: 1fr; } .na-feat-cover { min-height: 260px; } }
    @media (max-width: 768px) { .na-feat-body { padding: 28px 24px; } .na-nl-box { flex-direction: column; padding: 32px 24px; text-align: center; } .na-nl-form { flex-direction: column; width: 100%; } .na-nl-input { width: 100%; } }
    @media (max-width: 640px) { .na-articles-grid { grid-template-columns: 1fr; } }
  `]
})
export class ArticleComponent implements OnInit {
  articles: Article[] = [];
  loading = true;
  activeFilter = 'tous';

  constructor(private articleService: ArticleService, public ts: TranslationService) {}

  ngOnInit() {
    this.articleService.getAll().subscribe(data => {
      this.articles = data;
      this.loading = false;
    });
  }

  get categories(): string[] {
    return [...new Set(this.articles.map(a => a.category))];
  }

  get featured(): Article | undefined {
    return this.articles[0];
  }

  get filteredArticles(): Article[] {
    if (this.activeFilter === 'tous') return this.articles;
    return this.articles.filter(a => a.category === this.activeFilter);
  }
}
