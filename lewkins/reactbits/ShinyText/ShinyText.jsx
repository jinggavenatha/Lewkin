import './ShinyText.css';

const ShinyText = ({ text, disabled = false, speed = 5, className = '', color = '#b5b5b5a4' }) => {
  const animationDuration = `${speed}s`;

  return (
    <div
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{ 
        animationDuration,
        color: color
      }}
    >
      {text}
    </div>
  );
};

export default ShinyText;
