import React, { useState, useMemo } from 'react';
import {
    Input, Select, Slider, ColorPicker, Radio, Card, Space, Typography,
    Alert, Form, Row, Col, Divider
} from 'antd';
import { Hue } from '@uiw/react-color';
import type { ColorPickerProps, GetProp } from 'antd';
import getContrastTextColor, { ContrastColorOptions, ColorStrategy } from 'auto-contrast-color';
import tinycolor from 'tinycolor2';
import './ColorDemo.css'; // 保留部分自定义样式

const { Title, Text, Paragraph, Link } = Typography;

// 定义策略选项（中文）
const STRATEGIES: { value: ColorStrategy; label: string }[] = [
    { value: 'accessibility', label: '无障碍优先 (黑/白)' },
    { value: 'complementary', label: '互补色 (180°)' },
    { value: 'analogous', label: '同类色 (±15°)' },
    { value: 'adjacent', label: '邻近色 (±60°)' },
    { value: 'contrast', label: '对比色 (±120°)' },
    { value: 'custom', label: '自定义目标色相' },
];

// 定义方向类型和选项（中文）
type Direction = 'clockwise' | 'counterClockwise';
const DIRECTIONS: { value: Direction; label: string }[] = [
    { value: 'clockwise', label: '顺时针' },
    { value: 'counterClockwise', label: '逆时针' },
];

// Antd ColorPicker 类型
type Color = GetProp<ColorPickerProps, 'value'>;

// Helper function to convert Antd Color object/string to HEX string
const toHexString = (color: Color | null): string => {
    if (!color) return '#000000';
    if (typeof color === 'string') return color;
    // Check if it's an Ant Design Color object with toHexString method
    if (typeof color === 'object' && color !== null && 'toHexString' in color && typeof color.toHexString === 'function') {
        return color.toHexString();
    }
    // Try creating tinycolor instance more safely
    try {
      // Check if color object looks like a format tinycolor understands (e.g., RGB or HSL)
      if (typeof color === 'object' && color !== null && (('r' in color && 'g' in color && 'b' in color) || ('h' in color && 's' in color && 'l' in color))) {
         const tcInstance = tinycolor(color as tinycolor.ColorInput);
         if (tcInstance.isValid()) {
             return tcInstance.toHexString();
         }
      } else if (typeof color === 'string') { // Already handled above, but for clarity
         const tcInstance = tinycolor(color);
         if (tcInstance.isValid()) {
           return tcInstance.toHexString();
         }
      }
    } catch (e) {
      console.error("Error converting color with tinycolor:", e);
    }
    // Fallback if conversion fails or type is unexpected
    console.warn("Could not convert Antd Color type to HEX string, falling back:", color);
    return '#000000';
};

// Function to calculate the shortest rotation angle
function calculateShortestRotation(currentHue: number, targetHue: number): number {
    const diff = targetHue - currentHue;
    if (diff > 180) {
        return diff - 360;
    } else if (diff <= -180) {
        return diff + 360;
    }
    return diff;
}

function ColorDemo() {
    const [form] = Form.useForm();
    const [bgColorInput, setBgColorInput] = useState<string>('#800080'); // 初始紫色
    const [bgColorPicker, setBgColorPicker] = useState<Color>(tinycolor('#800080').toHexString());
    const [strategy, setStrategy] = useState<ColorStrategy>('accessibility');
    const [direction, setDirection] = useState<Direction>('clockwise');
    const [targetHue, setTargetHue] = useState<number>(() => {
        // Initialize targetHue based on initial bg color + 45 deg
        const initialHue = tinycolor('#800080').toHsl().h;
        return (initialHue + 45) % 360;
    }); // State for target hue (0-360)
    const [lightColor, setLightColor] = useState<string>('#FFFFFF');
    const [darkColor, setDarkColor] = useState<string>('#000000');
    const [threshold, setThreshold] = useState<number>(0.5);

    const isValidBgColor = useMemo(() => tinycolor(bgColorInput).isValid(), [bgColorInput]);
    const bgCssColor = useMemo(() => isValidBgColor ? tinycolor(bgColorInput).toRgbString() : 'transparent', [bgColorInput, isValidBgColor]);

    // Calculate customDegree dynamically based on targetHue
    const calculatedCustomDegree = useMemo(() => {
        if (strategy !== 'custom' || !isValidBgColor) {
            return 0; // Or a default/previous value if needed
        }
        const currentHue = tinycolor(bgColorInput).toHsl().h;
        return calculateShortestRotation(currentHue, targetHue);
    }, [strategy, bgColorInput, targetHue, isValidBgColor]);

    const options = useMemo<ContrastColorOptions>(() => ({
        strategy,
        direction, // Direction is now only used for non-custom strategies
        customDegree: strategy === 'custom' ? calculatedCustomDegree : 0, // Use calculated degree for custom
        lightColor,
        darkColor,
        threshold,
    }), [strategy, direction, calculatedCustomDegree, lightColor, darkColor, threshold]);

    // textColor calculation useMemo remains the same, but options will update based on calculatedCustomDegree
    const textColor = useMemo(() => {
        console.log("--- Recalculating textColor ---"); // Log entry
        console.log("bgColorInput:", bgColorInput); // Log input state
        console.log("options:", options); // Log options state
        console.log("isValidBgColor:", isValidBgColor); // Log validity

        if (!isValidBgColor) {
            console.log("Result: Invalid background color, returning darkColor:", darkColor);
            return darkColor; // 输入无效时返回默认暗色
        }
        try {
            const hexBgColor = tinycolor(bgColorInput).toHexString();
            console.log("Calculated hexBgColor:", hexBgColor); // Log hex value passed
            const resultColor = getContrastTextColor(hexBgColor, options);
            console.log("getContrastTextColor result:", resultColor); // Log result from library
            return resultColor;
        } catch (error) {
            console.error("计算对比色时出错:", error);
            console.log("Result: Error occurred, returning darkColor:", darkColor);
            return darkColor; // 计算出错时返回默认暗色
        }
        // 确保 useMemo 依赖数组包含所有实际影响计算的输入状态
        // options 对象本身是 memoized 的，其依赖项变化会改变 options 引用
        // 所以 [bgColorInput, options, isValidBgColor, darkColor] 是正确的
    }, [bgColorInput, options, isValidBgColor, darkColor]);

    // --- 事件处理 ---
    const handleBgColorInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = event.target.value;
        setBgColorInput(newColor);
        if (tinycolor(newColor).isValid()) {
            setBgColorPicker(tinycolor(newColor).toHexString());
        } else {
            // Keep the input value, but maybe reset picker visually or show error
            // setBgColorPicker(null); // Setting to null might clear it, which could be confusing
        }
    };

    const handleBgColorPickerChange = (color: Color) => {
        const hexColor = toHexString(color);
        setBgColorPicker(color);
        setBgColorInput(hexColor);
    };

    const handleLightColorChange = (color: Color) => {
        setLightColor(toHexString(color));
    };

    const handleDarkColorChange = (color: Color) => {
       setDarkColor(toHexString(color));
    };

    const handleTargetHueChange = (hueData: { h: number }) => {
        setTargetHue(hueData.h);
    };

    // --- 渲染 ---
    const renderAccessibilityOptions = () => (
        <>
            <Form.Item label="亮色文字">
                <Space>
                    <ColorPicker value={lightColor} onChange={handleLightColorChange} showText />
                </Space>
            </Form.Item>
            <Form.Item label="暗色文字">
                 <Space>
                    <ColorPicker value={darkColor} onChange={handleDarkColorChange} showText />
                 </Space>
            </Form.Item>
            <Form.Item label={`亮度阈值 (${threshold.toFixed(2)})`}>
                <Slider min={0} max={1} step={0.01} value={threshold} onChange={setThreshold} />
            </Form.Item>
        </>
    );

    const renderRotationOptions = () => (
        <>
            {strategy !== 'complementary' && strategy !== 'custom' && (
                <Form.Item label="旋转方向">
                    <Radio.Group
                        options={DIRECTIONS}
                        onChange={(e) => setDirection(e.target.value)}
                        value={direction}
                        optionType="button"
                        buttonStyle="solid"
                    />
                </Form.Item>
            )}
            {strategy === 'custom' && (
                <Form.Item label={`目标色相 (${targetHue.toFixed(0)}°)`}>
                    <Hue
                        hue={targetHue}
                        onChange={handleTargetHueChange}
                        height={12}
                        style={{ width: '100%' }}
                    />
                </Form.Item>
            )}
        </>
    );

    // 获取当前策略的解释文本
    const getStrategyExplanation = (): React.ReactNode => {
         switch (strategy) {
            case 'accessibility': return `根据背景色的相对亮度计算。如果亮度 > ${threshold.toFixed(2)}，则使用上方定义的"暗色文字" (${darkColor})，否则使用"亮色文字" (${lightColor})。此策略旨在确保 WCAG 对比度要求。`;
            case 'analogous': return `基于背景色的 HSL 色相值，旋转 ±15° (${DIRECTIONS.find(d => d.value === direction)?.label})。适用于创建柔和、和谐的色彩搭配。`;
            case 'adjacent': return `基于背景色的 HSL 色相值，旋转 ±60° (${DIRECTIONS.find(d => d.value === direction)?.label})。产生温和的视觉对比。`;
            case 'contrast': return `基于背景色的 HSL 色相值，旋转 ±120° (${DIRECTIONS.find(d => d.value === direction)?.label})。产生较强的视觉对比。`;
            case 'complementary': return `基于背景色的 HSL 色相值，旋转 180°。在色轮上选取正对面的颜色，产生最大的色相对比。`;
            case 'custom': return `根据下方滑块选择的目标色相 (${targetHue.toFixed(0)}°)，计算从当前背景色到目标色相所需的最短旋转角度 (${calculatedCustomDegree.toFixed(1)}°)。`;
            default: return '';
         }
     };

     // 检查背景色是否为无色相 (灰度)
     const isAchromatic = isValidBgColor && tinycolor(bgColorInput).toHsl().s === 0;

    return (
        <div className="color-demo-antd">
            <Title level={2} style={{ textAlign: 'center', marginBottom: '30px' }}>🎨 auto-contrast-color 功能演示</Title>
            <Row gutter={[24, 24]}>
                {/* 控制区域 */}
                <Col xs={24} md={10}>
                    <Card title="参数配置">
                        <Form layout="vertical" form={form}>
                            <Form.Item
                                label="背景颜色"
                                validateStatus={isValidBgColor ? '' : 'error'}
                                help={!isValidBgColor ? '请输入有效的颜色值（名称、HEX、RGB等）' : ''}
                            >
                                <Input
                                    placeholder="例如: lightblue, #f0f0f0, rgba(0,0,0,0.5)"
                                    value={bgColorInput}
                                    onChange={handleBgColorInputChange}
                                    addonAfter={<ColorPicker value={bgColorPicker} onChange={handleBgColorPickerChange} allowClear />}
                                />
                            </Form.Item>

                            <Form.Item label="颜色策略">
                                <Select value={strategy} onChange={setStrategy} options={STRATEGIES} />
                            </Form.Item>

                            {strategy === 'accessibility' && renderAccessibilityOptions()}
                            {strategy !== 'accessibility' && renderRotationOptions()}

                        </Form>
                    </Card>
                </Col>

                {/* 结果展示区域 */}
                <Col xs={24} md={14}>
                    <Card title="结果预览与说明">
                        <div
                            className="color-preview-antd"
                            style={{
                                backgroundColor: bgCssColor,
                                border: isValidBgColor ? '1px solid #eee' : '2px dashed red'
                            }}
                        >
                            <Text strong style={{ fontSize: '1.2em', display: 'block', marginBottom: '10px', color: textColor }}>
                                这段文字使用了计算出的颜色
                            </Text>
                            <Paragraph style={{ color: textColor }}>
                                当前背景色: <Text code style={{ color: 'inherit' }}>{bgColorInput || 'N/A'}</Text> (有效: {isValidBgColor ? '是' : '否'}) <br />
                                计算文本色: <Text code style={{ color: 'inherit' }}>{textColor}</Text> <br />
                                使用策略: <Text strong style={{ color: 'inherit' }}>{STRATEGIES.find(s => s.value === strategy)?.label}</Text>
                                {strategy === 'custom' && <> <br />计算角度: <Text code style={{ color: 'inherit' }}>{calculatedCustomDegree.toFixed(1)}°</Text></>}
                            </Paragraph>
                              {isAchromatic && strategy !== 'accessibility' && (
                                <Alert message="提示" description={`当前背景色为无彩色（黑/白/灰），色相旋转策略将回退为"无障碍优先"模式。`} type="info" showIcon style={{ marginTop: 10, fontSize: '0.9em' }}/>
                              )}
                        </div>

                        <Divider />

                        <Title level={4}>策略说明</Title>
                        <Paragraph>{getStrategyExplanation()}</Paragraph>
                        {strategy !== 'accessibility' && (
                            <Alert message="重要提示" description={`除"无障碍优先"外，其他色彩策略不保证计算出的文本颜色符合 WCAG 可访问性对比度标准。`} type="warning" showIcon />
                        )}
                         <Paragraph style={{ marginTop: '20px', fontSize: '0.9em', color: '#888' }}>
                             本 Demo 使用 <Link href="https://www.npmjs.com/package/auto-contrast-color" target="_blank">auto-contrast-color</Link> 库计算文本颜色。
                         </Paragraph>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default ColorDemo; 