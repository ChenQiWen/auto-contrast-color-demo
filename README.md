# 🎨 auto-contrast-color 功能演示 (React + Ant Design)

[![npm version](https://img.shields.io/npm/v/auto-contrast-color.svg?style=flat-square)](https://www.npmjs.com/package/auto-contrast-color)

这是一个使用 React 和 Ant Design 构建的交互式 Web 应用，旨在演示 [auto-contrast-color](https://www.npmjs.com/package/auto-contrast-color) 这个 npm 库的功能。

`auto-contrast-color` 能够根据给定的背景色，智能地计算出具有良好对比度（符合 WCAG 标准）或符合特定色彩理论（如互补色、邻近色等）的前景文本颜色。

本 Demo 通过一个直观的界面，让你可以实时调整背景色、选择不同的颜色策略，并观察文本颜色的动态变化。

## ✨ 主要技术栈

*   **核心库**: [auto-contrast-color](https://www.npmjs.com/package/auto-contrast-color)
*   **颜色处理**: [tinycolor2](https://github.com/bgrins/TinyColor)
*   **前端框架**: [React](https://reactjs.org/) (v19)
*   **UI 库**: [Ant Design](https://ant.design/) (v5)
*   **构建工具**: [Vite](https://vitejs.dev/)
*   **语言**: [TypeScript](https://www.typescriptlang.org/)
*   **颜色选择器组件**: [@uiw/react-color](https://uiwjs.github.io/react-color/) (用于色相滑块)

## 🚀 功能演示

*   **背景色实时输入**: 支持文本输入（颜色名称、HEX、RGB等）和 Ant Design 的 `ColorPicker`。
*   **多种颜色策略**:
    *   `无障碍优先 (黑/白)`: 保证 WCAG AA/AAA 级别的对比度，可自定义亮/暗色及阈值。
    *   `互补色 (180°)`
    *   `同类色 (±15°)`
    *   `邻近色 (±60°)`
    *   `对比色 (±120°)`
    *   `自定义目标色相`: 使用 `@uiw/react-color` 的 `Hue` 滑块选择目标色相，动态计算最短旋转角度。
*   **方向控制**: 对比色、邻近色、同类色支持顺时针/逆时针旋转。
*   **实时预览**: 在色块中实时显示背景色和计算出的文本颜色。
*   **策略说明**: 对当前选择的策略进行解释。
*   **边缘情况提示**: 处理无效颜色输入，并提示无彩色（灰度色）对色相旋转策略的影响。

## 🛠️ 本地运行

1.  **克隆仓库**:
    ```bash
    git clone <your-repository-url>
    cd auto-contrast-color-demo
    ```

2.  **安装依赖**:
    ```bash
    npm install
    # 或者
    # yarn install
    ```

3.  **启动开发服务器**:
    ```bash
    npm run dev
    # 或者
    # yarn dev
    ```

4.  在浏览器中打开显示的本地地址 (通常是 `http://localhost:5173` 或类似地址)。

## 🔗 相关链接

*   **auto-contrast-color npm 包**: [https://www.npmjs.com/package/auto-contrast-color](https://www.npmjs.com/package/auto-contrast-color)
*   **auto-contrast-color GitHub 仓库**: [https://github.com/ChenQiWen/auto-contrast-color](https://github.com/ChenQiWen/auto-contrast-color) 

---

*你可以考虑在此处添加一张项目运行截图。*
