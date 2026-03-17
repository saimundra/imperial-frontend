import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface ProductDescriptionProps {
  description: string;
  features: string[];
  ingredients?: string[];
  howToUse?: string[];
  warnings?: string[];
}

const ProductDescription = ({
  description,
  features,
  ingredients,
  howToUse,
  warnings,
}: ProductDescriptionProps) => {
  return (
    <div className="space-y-8">
      {/* Main Description */}
      <div className="space-y-4">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Product Description
        </h2>
        <p className="font-body text-foreground leading-relaxed">{description}</p>
      </div>

      {/* Key Features */}
      {features.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-heading text-xl font-semibold text-foreground">Key Features</h3>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-3">
                <Icon
                  name="CheckCircleIcon"
                  size={20}
                  variant="solid"
                  className="text-primary flex-shrink-0 mt-0.5"
                />
                <span className="font-body text-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Ingredients */}
      {ingredients && ingredients.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-heading text-xl font-semibold text-foreground">Ingredients</h3>
          <div className="p-4 bg-surface-elevated rounded-lg golden-border">
            <p className="font-body text-sm text-foreground leading-relaxed">
              {ingredients.join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* How to Use */}
      {howToUse && howToUse.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-heading text-xl font-semibold text-foreground">How to Use</h3>
          <ol className="space-y-3">
            {howToUse.map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-primary text-primary-foreground rounded-full font-data text-sm font-medium">
                  {index + 1}
                </span>
                <span className="font-body text-foreground">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-heading text-xl font-semibold text-foreground flex items-center space-x-2">
            <Icon name="ExclamationTriangleIcon" size={24} className="text-warning" />
            <span>Important Information</span>
          </h3>
          <ul className="space-y-2">
            {warnings.map((warning, index) => (
              <li key={index} className="flex items-start space-x-3">
                <Icon
                  name="InformationCircleIcon"
                  size={20}
                  className="text-warning flex-shrink-0 mt-0.5"
                />
                <span className="font-body text-sm text-foreground">{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductDescription;