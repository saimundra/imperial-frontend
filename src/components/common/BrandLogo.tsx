interface BrandLogoProps {
  className?: string;
}

export default function BrandLogo({ className = '' }: BrandLogoProps) {
  return (
    <img
      src="/assets/images/imperialglowlogo.jpeg"
      alt="Imperial Glow Nepal"
      className={className}
      style={{ mixBlendMode: 'lighten' }}
    />
  );
}
