import { getInitials, generateRandomColor } from '@/utils/helpers';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void; // make optional if you want
}

export const Avatar = ({ name, size = 'md', className = '', onClick }: AvatarProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const bgColor = generateRandomColor(name);

  return (
    <div
      onClick={onClick}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white cursor-pointer ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {getInitials(name)}
    </div>
  );
};
