import React, { type ReactNode } from 'react';
import { UtensilsCrossed } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Items Discovered",
  description = "There are currently no items matching your criteria in our reserve cellar.",
  action,
  icon,
}) => {
  return (
    <div className="bg-[#211B16] rounded-2xl p-10 text-center max-w-md mx-auto my-8 flex flex-col items-center justify-center border border-[#3A3027] shadow-sm">
      <div className="w-14 h-14 rounded-full bg-[#B84A32]/10 border border-[#B84A32]/25 flex items-center justify-center mb-4 text-[#B84A32]">
        {icon || <UtensilsCrossed className="w-7 h-7" />}
      </div>
      <h3 className="font-serif text-xl font-semibold text-[#F5EFE5] mb-2">{title}</h3>
      <p className="text-[#B8AEA1] text-sm leading-relaxed mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};
