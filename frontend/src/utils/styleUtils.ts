/**
 * Styling utilities for the Layout Builder frontend
 * Provides reusable style combinations and common button styles
 */

/**
 * Common button styles
 */
export const buttonStyles = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200',
  secondary: 'bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200',
  success: 'bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200',
  danger: 'bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200',
  outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded transition-colors duration-200',
  ghost: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 font-medium py-2 px-4 rounded transition-colors duration-200',
  small: 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-2 rounded text-sm transition-colors duration-200',
  large: 'bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded text-lg transition-colors duration-200',
} as const;

/**
 * Common input styles
 */
export const inputStyles = {
  default: 'border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  error: 'border border-red-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent',
  success: 'border border-green-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent',
} as const;

/**
 * Common card styles
 */
export const cardStyles = {
  default: 'bg-white rounded-lg shadow-md p-6',
  hover: 'bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200',
  elevated: 'bg-white rounded-lg shadow-lg p-6',
  bordered: 'bg-white rounded-lg border border-gray-200 p-6',
} as const;

/**
 * Common layout styles
 */
export const layoutStyles = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  sidebar: 'w-64 bg-gray-50 border-r border-gray-200 h-screen overflow-y-auto',
  main: 'flex-1 overflow-hidden',
  header: 'bg-white border-b border-gray-200 px-6 py-4',
  content: 'p-6',
} as const;

/**
 * Common text styles
 */
export const textStyles = {
  heading: 'text-2xl font-bold text-gray-900',
  subheading: 'text-xl font-semibold text-gray-800',
  body: 'text-base text-gray-700',
  caption: 'text-sm text-gray-500',
  error: 'text-sm text-red-600',
  success: 'text-sm text-green-600',
  warning: 'text-sm text-yellow-600',
} as const;

/**
 * Common spacing styles
 */
export const spacingStyles = {
  section: 'mb-8',
  subsection: 'mb-6',
  item: 'mb-4',
  small: 'mb-2',
  none: 'mb-0',
} as const;

/**
 * Common flex styles
 */
export const flexStyles = {
  row: 'flex flex-row items-center',
  column: 'flex flex-col',
  center: 'flex items-center justify-center',
  between: 'flex items-center justify-between',
  start: 'flex items-center justify-start',
  end: 'flex items-center justify-end',
  wrap: 'flex flex-wrap',
  nowrap: 'flex flex-nowrap',
} as const;

/**
 * Common grid styles
 */
export const gridStyles = {
  cols1: 'grid grid-cols-1 gap-4',
  cols2: 'grid grid-cols-2 gap-4',
  cols3: 'grid grid-cols-3 gap-4',
  cols4: 'grid grid-cols-4 gap-4',
  responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
} as const;

/**
 * Combine multiple style classes
 * @param classes - Array of style classes to combine
 * @returns Combined style string
 */
export function combineStyles(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Create conditional styles
 * @param baseClass - Base style class
 * @param conditions - Object with conditional classes
 * @returns Combined style string
 */
export function conditionalStyles(
  baseClass: string,
  conditions: Record<string, boolean | undefined>
): string {
  const conditionalClasses = Object.entries(conditions)
    .filter(([, condition]) => condition)
    .map(([className]) => className);
  
  return combineStyles(baseClass, ...conditionalClasses);
}

/**
 * Create responsive styles
 * @param styles - Object with responsive breakpoint styles
 * @returns Combined responsive style string
 */
export function responsiveStyles(styles: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}): string {
  const { base, sm, md, lg, xl } = styles;
  
  return combineStyles(
    base,
    sm && `sm:${sm}`,
    md && `md:${md}`,
    lg && `lg:${lg}`,
    xl && `xl:${xl}`
  );
}

/**
 * Common button component styles
 */
export const componentStyles = {
  toolbar: combineStyles(
    layoutStyles.header,
    flexStyles.between,
    'bg-gray-50'
  ),
  sidebar: combineStyles(
    layoutStyles.sidebar,
    'fixed left-0 top-0 z-40'
  ),
  mainContent: combineStyles(
    layoutStyles.main,
    'ml-64'
  ),
  card: combineStyles(
    cardStyles.default,
    spacingStyles.item
  ),
  formGroup: combineStyles(
    flexStyles.column,
    spacingStyles.item
  ),
  formLabel: combineStyles(
    textStyles.body,
    'font-medium mb-1'
  ),
  formInput: combineStyles(
    inputStyles.default,
    'w-full'
  ),
  formError: combineStyles(
    textStyles.error,
    spacingStyles.small
  ),
} as const; 