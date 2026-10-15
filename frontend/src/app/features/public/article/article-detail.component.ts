import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { ArticleService, Article } from '../../../core/services/article.service';
import { TranslationService } from '../../../core/services/translation.service';
import { ArticleCoverComponent } from '../../../shared/components/article-cover/article-cover.component';

@Component({
  selector: 'app-article-detail',
  standalone: true,
  imports: [RouterLink, NgIf, NgFor, NgClass, ArticleCoverComponent],
  template: `
    <!-- Loading -->
    <div class="ad-loading" *ngIf="loading">
      <div class="ad-spinner"></div>
    </div>

    <!-- Not found -->
    <div class="ad-notfound" *ngIf="!loading && !article">
      <i class="bi bi-file-earmark-x"></i>
      <h2>{{ ts.isEn() ? 'Article not found' : 'Article introuvable' }}</h2>
      <p>{{ ts.isEn() ? 'This article does not exist or has been removed.' : "Cet article n'existe pas ou a été supprimé." }}</p>
      <a routerLink="/article" class="ad-btn-back">← {{ ts.isEn() ? 'Back to articles' : 'Retour aux articles' }}</a>
    </div>

    <!-- Article -->
    <div *ngIf="!loading && article">

      <!-- Hero -->
      <section class="ad-hero">
        <div class="ad-container">
          <a routerLink="/article" class="ad-back">
            <i class="bi bi-arrow-left"></i> {{ ts.isEn() ? 'Back to articles' : 'Retour aux articles' }}
          </a>
          <div class="ad-meta-top">
            <span class="ad-cat" [style.background]="article!.categoryColor + '22'" [style.color]="article!.categoryColor">
              {{ ts.isEn() ? (article!.categoryEn || article!.category) : article!.category }}
            </span>
            <span class="ad-read-time"><i class="bi bi-clock"></i> {{ article!.readTime }} {{ ts.isEn() ? 'read' : 'de lecture' }}</span>
          </div>
          <h1>{{ ts.isEn() ? (article!.titleEn || article!.title) : article!.title }}</h1>
          <div class="ad-author-row">
            <div class="ad-av" [style.background]="article!.author.color">{{ article!.author.initials }}</div>
            <div>
              <div class="ad-author-name">{{ article!.author.name }}</div>
              <div class="ad-author-role">{{ ts.isEn() ? (article!.author.roleEn || article!.author.role) : article!.author.role }}</div>
            </div>
            <span class="ad-sep">·</span>
            <span class="ad-date">{{ ts.isEn() ? (article!.dateEn || article!.date) : article!.date }}</span>
          </div>
        </div>
      </section>

      <!-- Cover image -->
      <div class="ad-cover" [style.background]="article!.coverGradient">
        <app-article-cover [variant]="article!.coverVariant || 1" class="ad-cover-img"></app-article-cover>
        <div class="ad-cover-scrim"></div>
        <div class="ad-cover-content">
          <div class="ad-cover-labels">
            <span class="ad-cover-tag" [style.background]="article!.categoryColor">{{ article!.category }}</span>
            <span class="ad-cover-time"><i class="bi bi-clock"></i> {{ article!.readTime }} de lecture</span>
          </div>
        </div>
      </div>

      <!-- Contenu -->
      <section class="ad-content-section">
        <div class="ad-container">
          <div class="ad-layout">
            <!-- Article body -->
            <article class="ad-body">
              <p class="ad-lead">{{ ts.isEn() ? (article!.excerptEn || article!.excerpt) : article!.excerpt }}</p>
              <div class="ad-content" [innerHTML]="ts.isEn() ? (article!.contentEn || article!.content) : article!.content"></div>
            </article>

            <!-- Sidebar -->
            <aside class="ad-sidebar">
              <div class="ad-sidebar-card">
                <h4>Tags</h4>
                <div class="ad-tags">
                  <span class="ad-tag" *ngFor="let tag of (ts.isEn() ? (article!.tagsEn || article!.tags) : article!.tags)">{{ tag }}</span>
                </div>
              </div>
              <div class="ad-sidebar-card ad-author-card">
                <h4>{{ ts.isEn() ? 'About the author' : "À propos de l'auteur" }}</h4>
                <div class="ad-av-big" [style.background]="article!.author.color">{{ article!.author.initials }}</div>
                <div class="ad-author-name-big">{{ article!.author.name }}</div>
                <div class="ad-author-role-big">{{ ts.isEn() ? (article!.author.roleEn || article!.author.role) : article!.author.role }}</div>
              </div>
              <div class="ad-sidebar-card ad-cta-card">
                <i class="bi bi-calendar-check ad-cta-ico"></i>
                <h4>{{ ts.isEn() ? 'Discover NextCredit' : 'Découvrez NextCredit' }}</h4>
                <p>{{ ts.isEn() ? 'See our platform in action during a personalized demo.' : "Voyez notre plateforme en action lors d'une démo personnalisée." }}</p>
                <a [routerLink]="['/entreprise']" fragment="demo" class="ad-cta-btn">
                  {{ ts.isEn() ? 'Book a demo' : 'Réserver une démo' }} <i class="bi bi-arrow-right"></i>
                </a>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <!-- Articles similaires -->
      <section class="ad-related" *ngIf="related.length">
        <div class="ad-container">
          <h2>{{ ts.isEn() ? 'Related articles' : 'Articles similaires' }}</h2>
          <div class="ad-related-grid">
            <a class="ad-rel-card" *ngFor="let rel of related" [routerLink]="['/article', rel.slug]">
              <div class="ad-rel-img" [style.background]="rel.coverGradient">
                <app-article-cover [variant]="rel.coverVariant || 1"></app-article-cover>
              </div>
              <div class="ad-rel-body">
                <span class="ad-cat" [style.background]="rel.categoryColor + '18'" [style.color]="rel.categoryColor">{{ ts.isEn() ? (rel.categoryEn || rel.category) : rel.category }}</span>
                <h4>{{ ts.isEn() ? (rel.titleEn || rel.title) : rel.title }}</h4>
                <span class="ad-rel-meta">{{ rel.author.name }} · {{ ts.isEn() ? (rel.dateEn || rel.date) : rel.date }}</span>
              </div>
            </a>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    :host { display: block; }

    .ad-loading { display: flex; align-items: center; justify-content: center; min-height: 60vh; }
    .ad-spinner { width: 44px; height: 44px; border: 3px solid #e8edf6; border-top-color: #1E6FD9; border-radius: 50%; animation: spin .7s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .ad-notfound { text-align: center; padding: 120px 24px; color: #6b7488; }
    .ad-notfound i { font-size: 56px; color: #e8edf6; display: block; margin-bottom: 20px; }
    .ad-notfound h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; color: #152247; margin-bottom: 10px; }
    .ad-btn-back { display: inline-flex; align-items: center; gap: 8px; margin-top: 20px; background: #1E6FD9; color: #fff; padding: 12px 22px; border-radius: 12px; text-decoration: none; font-weight: 600; }

    .ad-hero { background: linear-gradient(135deg, #152247, #1a3f7a); padding: 60px 0 40px; color: #fff; }
    .ad-container { max-width: 1100px; margin: 0 auto; padding: 0 28px; }
    .ad-back { display: inline-flex; align-items: center; gap: 8px; color: rgba(255,255,255,.65); text-decoration: none; font-size: 13.5px; font-weight: 500; margin-bottom: 28px; transition: color .18s; }
    .ad-back:hover { color: #fff; }
    .ad-meta-top { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
    .ad-cat { display: inline-block; font-size: 11.5px; font-weight: 700; padding: 4px 12px; border-radius: 12px; text-transform: uppercase; letter-spacing: .06em; }
    .ad-read-time { font-size: 13px; color: rgba(255,255,255,.65); display: flex; align-items: center; gap: 5px; }
    .ad-hero h1 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 800; font-size: clamp(24px, 3.5vw, 40px); line-height: 1.2; margin-bottom: 24px; max-width: 800px; }
    .ad-author-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
    .ad-av { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #fff; flex-shrink: 0; }
    .ad-author-name { font-size: 14px; font-weight: 600; color: #fff; }
    .ad-author-role { font-size: 12px; color: rgba(255,255,255,.6); }
    .ad-sep { color: rgba(255,255,255,.3); }
    .ad-date { font-size: 13px; color: rgba(255,255,255,.65); }

    .ad-cover {
      height: 340px; position: relative; overflow: hidden; background: #152247;
      display: flex; align-items: center; justify-content: center;
    }
    .ad-cover-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
    .ad-cover-scrim {
      position: absolute; inset: 0;
      background: linear-gradient(180deg, rgba(21,34,71,.25) 0%, rgba(21,34,71,.5) 100%);
    }
    .ad-cover-content {
      position: relative; z-index: 2;
      display: flex; flex-direction: column; align-items: center; gap: 24px;
    }
    .ad-cover-labels { display: flex; align-items: center; gap: 12px; }
    .ad-cover-tag { display: inline-block; padding: 5px 14px; border-radius: 20px; color: #fff; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; }
    .ad-cover-time { display: flex; align-items: center; gap: 5px; background: rgba(0,0,0,.35); backdrop-filter: blur(4px); color: rgba(255,255,255,.9); font-size: 12.5px; padding: 5px 14px; border-radius: 20px; }

    .ad-content-section { padding: 56px 0 72px; background: #fff; }
    .ad-layout { display: grid; grid-template-columns: 1fr 320px; gap: 56px; align-items: start; }
    .ad-lead { font-size: 17px; color: #4b5568; line-height: 1.75; font-weight: 400; margin-bottom: 32px; padding-bottom: 28px; border-bottom: 2px solid #e8edf6; }

    .ad-content { font-size: 15.5px; color: #374151; line-height: 1.8; }
    .ad-content :global(h2) { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 22px; color: #152247; margin: 36px 0 14px; }
    .ad-content :global(p)  { margin-bottom: 18px; }
    .ad-content :global(ul) { list-style: disc; padding-left: 24px; margin-bottom: 18px; display: flex; flex-direction: column; gap: 8px; }
    .ad-content :global(li) { font-size: 15px; color: #374151; line-height: 1.7; }
    .ad-content :global(strong) { color: #152247; font-weight: 600; }

    /* Sidebar */
    .ad-sidebar { display: flex; flex-direction: column; gap: 20px; position: sticky; top: 90px; }
    .ad-sidebar-card { background: #f8faff; border-radius: 18px; padding: 22px; border: 1px solid #e8edf6; }
    .ad-sidebar-card h4 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 14px; color: #152247; margin-bottom: 14px; }
    .ad-tags { display: flex; flex-wrap: wrap; gap: 8px; }
    .ad-tag { background: #fff; border: 1px solid #e8edf6; border-radius: 8px; padding: 4px 12px; font-size: 12.5px; color: #6b7488; }
    .ad-author-card { text-align: center; }
    .ad-av-big { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: #fff; margin: 0 auto 10px; }
    .ad-author-name-big { font-weight: 700; font-size: 14px; color: #152247; }
    .ad-author-role-big { font-size: 12.5px; color: #6b7488; margin-top: 2px; }
    .ad-cta-card { background: linear-gradient(135deg, #152247, #1E6FD9); border: none; color: #fff; text-align: center; }
    .ad-cta-ico { font-size: 32px; color: rgba(255,255,255,.4); display: block; margin-bottom: 10px; }
    .ad-cta-card h4 { color: #fff; }
    .ad-cta-card p { font-size: 13px; color: rgba(255,255,255,.72); margin-bottom: 14px; }
    .ad-cta-btn { display: inline-flex; align-items: center; gap: 6px; background: #fff; color: #152247; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 13.5px; text-decoration: none; transition: transform .15s; font-family: 'Plus Jakarta Sans', sans-serif; }
    .ad-cta-btn:hover { transform: translateY(-1px); color: #1E6FD9; }

    /* Related */
    .ad-related { background: #f8faff; padding: 72px 0; }
    .ad-related h2 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 22px; color: #152247; margin-bottom: 28px; }
    .ad-related-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 20px; }
    .ad-rel-card { background: #fff; border-radius: 18px; border: 1px solid #e8edf6; overflow: hidden; text-decoration: none; transition: transform .2s, box-shadow .2s; display: block; }
    .ad-rel-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(21,34,71,.08); }
    .ad-rel-img { height: 120px; overflow: hidden; }
    .ad-rel-img app-article-cover { display: block; width: 100%; height: 100%; transition: transform .3s ease; }
    .ad-rel-card:hover .ad-rel-img app-article-cover { transform: scale(1.06); }
    .ad-rel-body { padding: 16px; }
    .ad-rel-body h4 { font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 700; font-size: 14px; color: #152247; line-height: 1.35; margin: 8px 0 6px; }
    .ad-rel-meta { font-size: 11.5px; color: #9aa1b3; }

    @media (max-width: 900px) {
      .ad-layout { grid-template-columns: 1fr; }
      .ad-sidebar { position: static; }
      .ad-related-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ArticleDetailComponent implements OnInit {
  article?: Article;
  related: Article[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private articleService: ArticleService,
    public ts: TranslationService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug') ?? '';
      this.loading = true;
      this.articleService.getAll().subscribe(all => {
        this.article = all.find(a => a.slug === slug);
        this.related = all.filter(a => a.slug !== slug && a.category === this.article?.category).slice(0, 3);
        if (this.related.length < 3) {
          const others = all.filter(a => a.slug !== slug && !this.related.includes(a));
          this.related = [...this.related, ...others].slice(0, 3);
        }
        this.loading = false;
      });
    });
  }
}
