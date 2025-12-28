import React, { useState } from "react";
import "./focus-cards.css";

export interface Card {
  title: string;
  src: string;
  description?: string;
  badges?: React.ReactNode;
  meta?: React.ReactNode;
  tags?: string[];
  actions?: React.ReactNode;
}

export const FocusCards = ({ cards }: { cards: Card[] }) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="focus-cards-grid">
      {cards.map((card, index) => (
        <div
          key={index}
          onMouseEnter={() => setHovered(index)}
          onMouseLeave={() => setHovered(null)}
          className={`focus-card ${hovered !== null && hovered !== index ? "blurred" : ""}`}
        >
          <div className="focus-card-image-wrapper">
            <img
              src={card.src}
              alt={card.title}
              className="focus-card-image"
            />
            <div className="focus-card-overlay" />
          </div>
          <div className="focus-card-content">
            {card.badges && (
              <div className="focus-card-badges">{card.badges}</div>
            )}
            <h3 className="focus-card-title">{card.title}</h3>
            {card.description && (
              <p className="focus-card-description">{card.description}</p>
            )}
            {card.meta && (
              <div className="focus-card-meta">{card.meta}</div>
            )}
            {card.tags && card.tags.length > 0 && (
              <div className="focus-card-tags">
                {card.tags.map((tag, idx) => (
                  <span key={idx} className="focus-tag">{tag}</span>
                ))}
              </div>
            )}
            {card.actions && (
              <div className="focus-card-actions">{card.actions}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
