import React, { useState, useMemo } from 'react';
import getContrastTextColor, { ContrastColorOptions, ColorStrategy } from 'auto-contrast-color';
import tinycolor from 'tinycolor2'; // 引入 tinycolor 用于颜色验证和格式化
import './ColorDemo.css';

const STRATEGIES: ColorStrategy[] = [
  'accessibility',
  'complementary',
  'analogous',
  'adjacent',
  'contrast',
  'custom',
];

// 直接定义 Direction 类型
type Direction = 'clockwise' | 'counterClockwise';

const DIRECTIONS: Direction[] = ['clockwise', 'counterClockwise'];

function ColorDemo() {
  const [bgColorInput, setBgColorInput] = useState<string>('#800080'); // 初始紫色
  const [strategy, setStrategy] = useState<ColorStrategy>('accessibility');
  const [direction, setDirection] = useState<Direction>('clockwise');
  const [customDegree, setCustomDegree] = useState<number>(45);
  const [lightColor, setLightColor] = useState<string>('#FFFFFF');
  const [darkColor, setDarkColor] = useState<string>('#000000');
  const [threshold, setThreshold] = useState<number>(0.5);

  const isValidBgColor = useMemo(() => tinycolor(bgColorInput).isValid(), [bgColorInput]);
  const bgColor = useMemo(() => isValidBgColor ? tinycolor(bgColorInput).toRgbString() : 'transparent', [bgColorInput, isValidBgColor]);

  const options = useMemo<ContrastColorOptions>(() => ({
    strategy,
    direction,
    customDegree,
    lightColor,
    darkColor,
    threshold,
  }), [strategy, direction, customDegree, lightColor, darkColor, threshold]);

  const textColor = useMemo(() => {
    if (!isValidBgColor) {
      return darkColor; // 输入无效时返回默认暗色
    }
    try {
      return getContrastTextColor(bgColorInput, options);
    } catch (error) {
      console.error("Error calculating contrast color:", error);
      return darkColor; // 计算出错时返回默认暗色
    }
  }, [bgColorInput, options, isValidBgColor, darkColor]);

  const handleBgColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBgColorInput(event.target.value);
  };

  const handleStrategyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStrategy(event.target.value as ColorStrategy);
  };

  const handleDirectionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDirection(event.target.value as Direction);
  };

  const handleDegreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    setCustomDegree(isNaN(value) ? 0 : value);
  };

    const handleLightColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLightColor(event.target.value);
    };

    const handleDarkColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDarkColor(event.target.value);
    };

     const handleThresholdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(event.target.value);
        setThreshold(isNaN(value) ? 0.5 : Math.max(0, Math.min(1, value)));
     };


  return (
    <div className="color-demo">
      <h1>🎨 auto-contrast-color Demo</h1>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="bgColorInput">Background Color:</label>
          <input
            type="text"
            id="bgColorInput"
            value={bgColorInput}
            onChange={handleBgColorChange}
            placeholder="Enter color (e.g., #RRGGBB, rgb(), name)"
          />
           <input
             type="color"
             value={tinycolor(bgColorInput).isValid() ? tinycolor(bgColorInput).toHexString() : '#000000'}
             onChange={handleBgColorChange}
             className="color-picker-native"
             aria-label="Background Color Picker"
           />
          {!isValidBgColor && <span className="error-text">Invalid Color</span>}
        </div>

        <div className="control-group">
            <label htmlFor="strategySelect">Strategy:</label>
            <select id="strategySelect" value={strategy} onChange={handleStrategyChange}>
                {STRATEGIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
        </div>

         {strategy === 'accessibility' && (
             <>
                <div className="control-group">
                    <label htmlFor="lightColorInput">Light Color:</label>
                    <input type="color" id="lightColorInput" value={lightColor} onChange={handleLightColorChange} />
                    <span>{lightColor}</span>
                </div>
                <div className="control-group">
                    <label htmlFor="darkColorInput">Dark Color:</label>
                    <input type="color" id="darkColorInput" value={darkColor} onChange={handleDarkColorChange} />
                     <span>{darkColor}</span>
                </div>
                <div className="control-group">
                     <label htmlFor="thresholdInput">Threshold ({threshold.toFixed(2)}):</label>
                     <input type="range" id="thresholdInput" min="0" max="1" step="0.01" value={threshold} onChange={handleThresholdChange} />
                 </div>
             </>
         )}

        {strategy !== 'accessibility' && strategy !== 'complementary' && (
             <div className="control-group">
                 <label htmlFor="directionSelect">Direction:</label>
                 <select id="directionSelect" value={direction} onChange={handleDirectionChange}>
                     {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                 </select>
             </div>
         )}

        {strategy === 'custom' && (
            <div className="control-group">
                <label htmlFor="customDegreeInput">Custom Degree:</label>
                <input
                    type="number"
                    id="customDegreeInput"
                    value={customDegree}
                    onChange={handleDegreeChange}
                />
            </div>
        )}
      </div>

      <div className="output-area">
        <h2>Result</h2>
        <div
          className="color-preview"
          style={{
              backgroundColor: bgColor,
              color: textColor,
              border: isValidBgColor ? '1px solid #ccc' : '2px dashed red'
          }}
        >
          <span>This text uses the calculated color ({textColor})</span>
           <p>Based on '{strategy}' strategy.</p>
           {/* 显示一些计算细节 */}
           <small>
               Input Bg: {bgColorInput} (Valid: {isValidBgColor ? 'Yes' : 'No'})<br/>
               Calculated Text: {textColor}<br/>
               {strategy !== 'accessibility' && isValidBgColor && tinycolor(bgColorInput).toHsl().s === 0 && 'Note: Hue rotation strategy ineffective on achromatic color, fallback to accessibility.'}
           </small>
        </div>
         <div className="explanation">
             <h3>Strategy Explanation</h3>
             <p>
                 {strategy === 'accessibility' && `Calculates brightness. If > ${threshold.toFixed(2)}, uses Dark Color (${darkColor}), else Light Color (${lightColor}). Ensures WCAG contrast.`}
                 {strategy === 'analogous' && `Rotates hue by ±15° (${direction}). Good for subtle harmony.`}
                 {strategy === 'adjacent' && `Rotates hue by ±60° (${direction}). Creates gentle contrast.`}
                 {strategy === 'contrast' && `Rotates hue by ±120° (${direction}). Stronger visual contrast.`}
                 {strategy === 'complementary' && `Rotates hue by 180°. Maximum hue contrast (opposite on color wheel).`}
                 {strategy === 'custom' && `Rotates hue by ${customDegree}° (${direction}). Your custom rotation.`}
             </p>
             {strategy !== 'accessibility' && <p className="warning">Note: Hue rotation strategies do not guarantee WCAG compliance.</p>}
         </div>
      </div>
    </div>
  );
}

export default ColorDemo; 