import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const ArticleCard = ({ article, featured = false }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${article.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className={`article-card cursor-pointer bg-white border border-slate-200 hover:border-slate-300 group ${
        featured ? 'bento-item-featured' : ''
      }`}
      data-testid={`article-card-${article.id}`}
    >
      <div className="relative h-full">
        <img
          src={article.image_url}
          alt={article.title}
          className="article-image"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wider bg-[#D90429] px-2 py-1 rounded-sm font-medium" data-testid={`article-category-${article.id}`}>
              {article.category}
            </span>
            <span className="text-xs text-slate-300" data-testid={`article-time-${article.id}`}>
              {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
            </span>
          </div>
          <h3 className={`font-serif font-bold leading-tight ${
            featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
          }`} data-testid={`article-title-${article.id}`}>
            {article.title}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;