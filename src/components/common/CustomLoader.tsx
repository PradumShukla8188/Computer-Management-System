import React from 'react';
import styles from './CustomLoader.module.css';

interface CustomLoaderProps {
  /**
   * If true, the loader will take the full screen height and width
   * If false, it will fit the parent container
   * @default false
   */
  fullScreen?: boolean;
  
  /**
   * Size of the spinner
   * @default "default"
   */
  size?: 'small' | 'default' | 'large';
  
  /**
   * Custom height when not in fullScreen mode
   * Examples: "200px", "50vh", "100%"
   */
  height?: string;
  
  /**
   * Show spinner with blur backdrop effect
   * @default true
   */
  withBackdrop?: boolean;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({
  fullScreen = false,
  size = 'default',
  height,
  withBackdrop = true,
}) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center'
    : 'flex items-center justify-center w-full';

  const backdropClasses = withBackdrop
    ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
    : 'bg-transparent';

  const containerStyle: React.CSSProperties = {
    ...(height && !fullScreen ? { height } : {}),
    ...(fullScreen ? { minHeight: '100vh' } : { minHeight: height || '300px' }),
  };

  const spinnerSizeClass = size === 'small' ? styles.small : size === 'large' ? styles.large : styles.default;

  return (
    <div className={`${containerClasses} ${backdropClasses}`} style={containerStyle}>
      <div className={`${styles.spinner} ${spinnerSizeClass}`} />
    </div>
  );
};

export default CustomLoader;
