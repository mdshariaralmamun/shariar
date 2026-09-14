// Shared project/blog category presentation metadata
export const CATEGORY_META: Record<string, { label: string; icon: string; gradient: string }> = {
  'gas-piping': {
    label: 'UHP Gas Piping',
    icon: '🔥',
    gradient: 'from-cyan-500/30 via-blue-500/20 to-blue-700/30',
  },
  cleanroom: {
    label: 'Cleanroom',
    icon: '🏥',
    gradient: 'from-teal-500/30 via-emerald-500/20 to-emerald-700/30',
  },
  equipment: {
    label: 'Equipment',
    icon: '📦',
    gradient: 'from-amber-500/30 via-orange-500/20 to-orange-700/30',
  },
  software: {
    label: 'Software',
    icon: '💻',
    gradient: 'from-violet-500/30 via-purple-500/20 to-purple-700/30',
  },
  coordination: {
    label: 'Coordination',
    icon: '🧭',
    gradient: 'from-rose-500/30 via-pink-500/20 to-pink-700/30',
  },
  research: {
    label: 'Research',
    icon: '🔬',
    gradient: 'from-indigo-500/30 via-blue-500/20 to-indigo-700/30',
  },
};

export function categoryMeta(category: string): { label: string; icon: string; gradient: string } {
  return CATEGORY_META[category] ?? { label: category, icon: '📁', gradient: 'from-slate-500/30 via-slate-500/20 to-slate-700/30' };
}
