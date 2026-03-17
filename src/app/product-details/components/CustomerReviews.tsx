'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface Review {
  id: string;
  userName: string;
  userImage: string;
  userImageAlt: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
  helpful: number;
  images?: { url: string; alt: string }[];
}

interface CustomerReviewsProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { stars: number; count: number; percentage: number }[];
}

const CustomerReviews = ({
  reviews,
  averageRating,
  totalReviews,
  ratingDistribution,
}: CustomerReviewsProps) => {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful'>('recent');

  const renderStars = (rating: number, size: number = 20) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Icon
          key={i}
          name="StarIcon"
          size={size}
          variant={i < rating ? 'solid' : 'outline'}
          className={i < rating ? 'text-primary' : 'text-muted'}
        />
      );
    }
    return stars;
  };

  const filteredReviews = filterRating
    ? reviews.filter((review) => review.rating === filterRating)
    : reviews;

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === 'helpful') {
      return b.helpful - a.helpful;
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 bg-surface-elevated rounded-lg golden-border">
        <div className="space-y-4">
          <h3 className="font-heading text-2xl font-semibold text-foreground">Customer Reviews</h3>
          <div className="flex items-end space-x-4">
            <span className="font-heading text-5xl font-semibold text-primary">
              {averageRating.toFixed(1)}
            </span>
            <div className="space-y-1 pb-2">
              <div className="flex items-center space-x-1">{renderStars(Math.round(averageRating), 24)}</div>
              <p className="font-caption text-sm text-muted-foreground">
                Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map((dist) => (
            <button
              key={dist.stars}
              onClick={() => setFilterRating(filterRating === dist.stars ? null : dist.stars)}
              className={`w-full flex items-center space-x-3 p-2 rounded transition-luxury hover:bg-muted ${
                filterRating === dist.stars ? 'bg-muted' : ''
              }`}
            >
              <span className="font-data text-sm w-8">{dist.stars}</span>
              <Icon name="StarIcon" size={16} variant="solid" className="text-primary" />
              <div className="flex-1 h-2 bg-card rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${dist.percentage}%` }}
                />
              </div>
              <span className="font-data text-sm w-12 text-right text-muted-foreground">
                {dist.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <span className="font-body font-medium text-foreground">
            {filteredReviews.length} {filteredReviews.length === 1 ? 'Review' : 'Reviews'}
          </span>
          {filterRating && (
            <button
              onClick={() => setFilterRating(null)}
              className="flex items-center space-x-1 px-3 py-1 bg-primary/10 text-primary rounded-full font-caption text-sm transition-luxury hover:bg-primary/20"
            >
              <span>{filterRating} stars</span>
              <Icon name="XMarkIcon" size={16} />
            </button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-caption text-sm text-muted-foreground">Sort by:</span>
          <button
            onClick={() => setSortBy('recent')}
            className={`px-4 py-2 rounded-lg font-body text-sm transition-luxury ${
              sortBy === 'recent'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card golden-border hover:golden-border-hover'
            }`}
          >
            Most Recent
          </button>
          <button
            onClick={() => setSortBy('helpful')}
            className={`px-4 py-2 rounded-lg font-body text-sm transition-luxury ${
              sortBy === 'helpful'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card golden-border hover:golden-border-hover'
            }`}
          >
            Most Helpful
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {sortedReviews.length === 0 ? (
          <div className="p-8 bg-card rounded-lg golden-border text-center space-y-3">
            <Icon
              name="ChatBubbleLeftRightIcon"
              size={36}
              className="text-muted-foreground mx-auto"
            />
            <h4 className="font-body font-semibold text-foreground">No written reviews yet</h4>
            <p className="font-caption text-sm text-muted-foreground">
              Rating summary is available, but customer review comments have not been published for
              this product yet.
            </p>
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div key={review.id} className="p-6 bg-card rounded-lg golden-border space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden golden-border">
                    <AppImage
                      src={review.userImage}
                      alt={review.userImageAlt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-body font-medium text-foreground">{review.userName}</p>
                      {review.verified && (
                        <div className="flex items-center space-x-1 px-2 py-0.5 bg-success/10 text-success rounded-full">
                          <Icon name="CheckBadgeIcon" size={14} variant="solid" />
                          <span className="font-caption text-xs">Verified Purchase</span>
                        </div>
                      )}
                    </div>
                    <p className="font-caption text-sm text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">{renderStars(review.rating, 18)}</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-body font-semibold text-foreground">{review.title}</h4>
                <p className="font-body text-foreground leading-relaxed">{review.comment}</p>
              </div>

              {review.images && review.images.length > 0 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {review.images.map((image, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden golden-border"
                    >
                      <AppImage
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-4 pt-2">
                <button className="flex items-center space-x-2 text-muted-foreground transition-luxury hover:text-primary">
                  <Icon name="HandThumbUpIcon" size={18} />
                  <span className="font-caption text-sm">Helpful ({review.helpful})</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerReviews;
