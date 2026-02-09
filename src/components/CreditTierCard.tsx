
import { Star, Lock, CheckCircle2 } from 'lucide-react'; 
import React from 'react'; 
import { useLanguage } from '@/contexts/LanguageContext';
import { formatCurrency } from '@/lib/currency';

interface CreditTierCardProps { 
  level: number; 
  title: string; 
  description: string; 
  priceCap: number; // Changed from string to number
  coreProcess: string; 
  recommendationStars: number; 
  guideSuggestion?: string;
  isCurrent: boolean; 
  isCompleted: boolean;
  isLocked: boolean; 
  onUpgradeClick?: () => void; 
} 

const CreditTierCard: React.FC<CreditTierCardProps> = ({ 
  level, 
  title, 
  description, 
  priceCap, 
  coreProcess,
  recommendationStars, 
  guideSuggestion,
  isCurrent, 
  isCompleted,
  isLocked, 
  onUpgradeClick, 
}) => { 
  const { t, language } = useLanguage();
  
  // Dynamic styling based on level 
  let cardClasses = "relative p-6 rounded-xl border flex flex-col justify-between h-full transition-all duration-300"; 
  let titleClasses = "text-xl font-bold mb-2"; 
  let priceClasses = "text-3xl font-extrabold mt-4 mb-2"; 

  switch (level) { 
    case 0:
      cardClasses += " bg-gray-50/50 border-gray-200 text-gray-800 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400";
      break;
    case 1: 
      cardClasses += " bg-gray-50 border-gray-200 text-gray-800 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-300"; 
      break; 
    case 2: 
      cardClasses += " bg-blue-50 border-blue-200 text-blue-900 shadow-md dark:bg-blue-900/10 dark:border-blue-800 dark:text-blue-100"; 
      break; 
    case 3: 
      cardClasses += " bg-gradient-to-br from-gray-100 to-white border-gray-300 text-gray-900 shadow-lg dark:from-zinc-800 dark:to-zinc-900 dark:border-zinc-600 dark:text-zinc-100"; 
      titleClasses += " text-gray-900 dark:text-white"; 
      priceClasses += " text-gray-900 dark:text-white"; 
      break; 
    case 4: 
      cardClasses += " bg-gradient-to-br from-amber-100 to-amber-50 border-amber-300 text-amber-900 shadow-xl ring-2 ring-amber-400 dark:from-amber-900/30 dark:to-amber-900/10 dark:border-amber-600 dark:text-amber-100 dark:ring-amber-600"; 
      titleClasses += " text-amber-900 dark:text-amber-100"; 
      priceClasses += " text-amber-900 dark:text-amber-100"; 
      break; 
    default: 
      break; 
  } 

  return ( 
    <div className={cardClasses}> 
      {isCurrent && ( 
        <span className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full shadow-md z-10"> 
          {t("credit.current_level")}
        </span> 
      )}
      {isCompleted && (
        <span className="absolute top-3 right-3 px-3 py-1 bg-zinc-400 text-white text-xs font-semibold rounded-full shadow-md z-10 flex items-center">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          {t("credit.completed") || "Completed"}
        </span>
      )}
      {(level === 3 || level === 4) && !isCurrent && !isCompleted && ( 
        <span className="absolute top-3 left-3 px-3 py-1 bg-indigo-600 text-white text-xs font-semibold rounded-full shadow-md z-10"> 
          {level === 3 ? t("credit.recommended") : t("credit.high_conversion")} 
        </span> 
      )}  

      <div> 
        <h3 className={titleClasses}>{title}</h3> 
        <p className="text-sm mb-4 opacity-80 min-h-[40px]">{description}</p> 

        <div className="flex items-center mb-4"> 
          {[...Array(5)].map((_, i) => ( 
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < recommendationStars ? 'text-amber-400 fill-current' : 'text-gray-300 dark:text-zinc-700'}`} 
            /> 
          ))} 
          <span className="ml-2 text-xs font-medium opacity-70">{t("credit.trust_score")}</span> 
        </div> 

        {/* Pricing Cap */}
        <div className={priceClasses}> 
          <p className="text-xs font-medium opacity-70 mb-0.5">{t("credit.max_price")}</p>
          {priceCap === Infinity ? (
            <span>{t("credit.uncapped")}</span>
          ) : (
            <span className="flex items-baseline">
              {formatCurrency(priceCap, language)}
              <span className="text-sm font-normal ml-1 opacity-70">/hr</span>
            </span>
          )}
        </div> 

        {/* Core Process */}
        <div className="mb-6 flex items-start gap-2 text-xs bg-white/40 dark:bg-black/20 p-2 rounded border border-current border-opacity-10">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
                <p className="font-semibold opacity-70">{t("credit.requirement")}:</p>
                <p>{coreProcess}</p>
            </div>
        </div>

        {guideSuggestion && (
          <div className="mb-6 p-3 bg-orange-50/50 dark:bg-orange-900/20 rounded-lg border border-orange-100 dark:border-orange-800">
            <p className="text-xs font-semibold text-orange-800 dark:text-orange-300 mb-1">
              {t("credit.suggestion") || "Suggested Activities"}
            </p>
            <p className="text-xs text-orange-700/80 dark:text-orange-400/80 leading-relaxed">
              {guideSuggestion}
            </p>
          </div>
        )}

      </div> 

      {!isCurrent && !isCompleted && ( 
        <button 
          onClick={onUpgradeClick} 
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-white transition-all duration-200 shadow-sm ${ 
            isLocked
              ? 'bg-gray-400 cursor-not-allowed dark:bg-zinc-700' 
              : 'bg-indigo-600 hover:bg-indigo-700' 
          }`} 
          disabled={isLocked} 
        > 
          {isLocked ? ( 
            <span className="flex items-center justify-center"> 
              <Lock className="w-4 h-4 mr-2" /> {level === 4 ? (t("credit.invitation_only") || "Invitation Only") : t("credit.locked")}
            </span> 
          ) : ( 
            t("credit.upgrade_now") 
          )} 
        </button> 
      )}
      
      {isCompleted && (
        <button 
          className="w-full py-2.5 px-4 rounded-lg font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-400 cursor-default"
          disabled
        >
          <span className="flex items-center justify-center">
             <CheckCircle2 className="w-4 h-4 mr-2" /> {t("credit.completed") || "Completed"}
          </span>
        </button>
      )}
    </div> 
  ); 
}; 

export default CreditTierCard;
