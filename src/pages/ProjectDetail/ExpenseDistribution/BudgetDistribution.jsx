import * as React from 'react';
import { budgetCategories } from './BudgetDistributionData';

const BudgetDistribution = () => {
  return (
    <div className="w-full flex overflow-hidden flex-col px-9 py-5 bg-white rounded-lg border shadow-sm border-zinc-200 max-md:px-5">
      <div className="text-sm font-bold leading-loose text-zinc-500" role="heading" aria-level="2">
        Distribution of Budget
      </div>
      <div className="flex flex-col mt-2.5 w-full max-md:max-w-full">
        <div className="flex overflow-hidden flex-wrap gap-px w-full rounded-2xl bg-stone-900 bg-opacity-0 min-h-[32px] max-md:max-w-full" role="group" aria-label="Budget distribution chart">
          {budgetCategories.map((category, index) => (
            <div
              key={`bar-${category.name}-${index}`}
              className={`flex shrink-0 h-8 ${category.color} ${category.width}`}
              role="img"
              aria-label={`${category.name} budget: ${category.percentage}%`}
            />
          ))}
        </div>
        <div className="flex gap-4 items-center self-start mt-4 text-xs font-medium leading-loose whitespace-nowrap text-zinc-500 max-md:max-w-full">
          {budgetCategories.map((category, index) => (
            <div 
              key={`legend-${category.name}-${index}`}
              className="flex gap-2 items-center self-stretch my-auto"
            >
              <div 
                className={`flex shrink-0 self-stretch my-auto w-4 h-4 ${category.color} rounded-full`}
                role="img"
                aria-hidden="true"
              />
              <div className="self-stretch my-auto">{category.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BudgetDistribution;