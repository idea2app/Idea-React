# AGENTS.md

## 上游同步

[Bootstrap][1] 组件更新时，应遵循以下步骤更新本代码库：

1. 拉取 https://github.com/twbs/bootstrap/tree/main/site/src/components 目录下的最新代码
2. 将更新的组件文档同步到本库的 `document/app` 目录，可能需要转为 MDX 格式
3. 根据更新的组件文档，新增或修改本库中的对应组件，并将实现的组件应用回前面的 MDX 文档中
4. 根据更新的文档和组件，编写 `test` 目录的单元测试，以 `ComponentName.test.tsx` 规范命名文件

## 组件风格

### 只依赖 Props 的组件

```tsx
import { FC } from 'react';

export interface MyComponentProps {
    message: string;
}

export const MyComponent: FC<MyComponentProps> = ({ message }) => <div>{message}</div>;
```

### 依赖 State 的组件

```tsx
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';

@observer
export class MyComponent extends Component {
    @observable
    accessor count = 0;

    @action
    increment = () => {
        this.count++;
    };

    render() {
        return <button onClick={this.increment}>{this.count}</button>;
    }
}
```

### 依赖 Store 的组件

```tsx
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { Component } from 'react';

export class MyModel {
    @observable
    accessor count = 0;

    @action
    increment() {
        this.count++;
    }
}

@observer
export class MyComponent extends Component {
    store = new MyModel();

    handleIncrement = () => this.store.increment();

    render() {
        const { count } = this.store;

        return <button onClick={this.handleIncrement}>{count}</button>;
    }
}
```

### 依赖事件委托、监听数据变更的组件

```tsx
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { ObservedComponent, on, reaction } from 'mobx-react-helper';
import { Component, MouseEvent } from 'react';

export interface MyComponentProps {
    someKey: string;
}

@observer
export class MyComponent extends ObservedComponent<MyComponentProps> {
    componentDidMount() {
        super.componentDidMount();
        this.init();
    }

    @reaction(({ observedProps: { someKey } }) => someKey)
    init() {
        console.log('someKey changed', this.observedProps.someKey);
    }

    @on('click', 'td')
    handleClick(event: MouseEvent<HTMLTableCellElement>, target: HTMLTableCellElement) {
        console.log('TD clicked', event, target);
    }

    render() {
        const { someKey } = this.props;

        return (
            <table data-some-key={someKey}>
                <thead>
                    <tr>
                        <th>Header</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Cell</td>
                    </tr>
                </tbody>
            </table>
        );
    }
}
```

## 工作范围与组件边界

- 只实现用户要求的内容；不要擅自新增页面、组件规格文档、示例或其它功能。
- 文档站要用到的 [Bootstrap 官方组件][2] 必须先在 `source/` 封装为通用组件，
  再由文档站引用，不是将其专用组件放进组件库。
- 文档站专用布局、组件、模型和样式放在 `document/component/`，不得从组件库导出或混入发布包。
- 多个同前缀的文件归入同名文件夹，文件使用 `index.tsx`、`model.ts`、
  `style.module.css` 等短名，并同步调整所有引用。

## 状态与回调

- 遵循 AOP、单一职责与关注点分离，优先复用现有模型和框架组合机制，避免过度抽象。
- 业务行为、异步流程和状态集中在内聚的模型类中；组件负责展示、生命周期和事件转发，
  不要把这些逻辑集中到 React hooks 或零散工具函数里。
- 少量、仅供单个组件使用的状态直接写为类组件实例成员，不必独立状态类。
- 使用 MobX stage-3 装饰器（如 `@observable accessor`、`@computed`、`@action`）。
- 已有 `@action` 时不要再套 `runInAction()`。异步方法的 `await` 之后不继承 action
  边界，后续状态更新应调用独立的 `@action` 方法，不能直接删除包装后裸写状态。
- 回调函数的对象参数优先解构；需要把完整事件传给外部回调或保留事件方法调用上下文时，
  可以保留事件对象，在函数体中解构所需字段。
- 类组件的所有事件回调写成箭头函数形式的类实例方法，直接传给事件属性；
  不在 JSX 中内联事件处理函数，也不在渲染过程中创建事件包装函数。
- 类型兼容时直接传入已有函数作为回调，不添加只转发调用的包装函数。
- 只有返回语句的函数简化为箭头函数表达式；相邻的两个返回分支优先合为三目表达式。
- 返回前的最后一个语句不影响返回值时，可与 `return` 合并。
- 多个同类型字段使用 `type` 和 `Record` 简写；含子元素的属性优先使用 `PropsWithChildren`。
- 文本内容优先通过 `children` 传入，不另设重复用途的命名属性。
- 嵌套较深、行数较长的大型 JSX 功能块提取为类组件渲染方法或无状态函数组件。
- 所有图标通过 [Icon][3] 渲染，不另写图标组件或自绘 SVG；
  使用相应图标字体样式，并保留必要的无障碍标签。

## 文档站、样式与文案

- 文档站使用 ViNext，保留 MDX 支持并以纯 SSG 导出；部署静态文件，不依赖运行时服务器。
- 文档站页面参考上游设计，但品牌使用 **Idea React**，版本、许可证、安装命令、链接及其它文案
  均以本项目实际情况为准；保留必要的上游版权和许可证声明。
- 页面格式以简洁、可读为准：文档可用 MDX，非文档页（包括首页）在能减少缩进时也可用
  MDX，不强制非文档页只能使用 TSX 或 MDX。
- 跨页面共享的导航栏等结构放在公共布局中，不重复写入单个页面。
- MDX 中的大段静态文本优先使用 Markdown，而非嵌套的 JSX 文本块。
- 从 `unpkg.com` 引入 Bootstrap CSS，严禁使用 Tailwind CSS 及其插件、配置和工具类。
- 能用 [Bootstrap 6 CSS 工具类][4] 的样式不写自定义 CSS；
  剩余样式全部使用 CSS modules，不另建全局自定义样式；需要嵌套的样式使用 LESS modules。
- 所有 Read Me 都是入门文档，只介绍概况、启动、构建和部署等必要信息；
  不写成深入实现细节的规格文档。
- 代码和目录结构变化时同步更新相关 Markdown，移除失效的路径与描述。
- Markdown 链接统一采用文末数字引用：正文写 `[text][number]`，文末写 `[number]: URL`；
  图片链接同样使用引用形式。
- 组件目录优先列出上游标准组件，再列扩展组件。

## 测试与验证

- 使用 Node.js 原生 test runner、`node:assert/strict` 和原生 mock，不引入外部测试框架。
- 不同测试阶段的断言与后续操作之间留空行，区分准备、操作和验证。
- 通用组件单元测试放在 `test/`，遵循 `ComponentName.test.tsx` 命名；
  不为文档站专用组件和模型编写或保留单元测试。
- 按改动范围运行相关类型检查、Lint、测试和构建；页面交互与响应式布局通过浏览器验证。
- 纯 SSG 构建不仅要检查退出码，还要确认实际导出的 HTML 等静态文件及路由，
  避免将路由被跳过的构建误判为成功。

## Git 操作

- 未经用户明确要求，不创建提交、不推送、不 amend 或改写现有提交。
- “完成实现”“修复问题”“完成 PR”或“运行测试”均不等于提交或推送授权；
  完成验证后保留未提交改动供用户审阅。

[1]: https://getbootstrap.com/
[2]: https://getbootstrap.com/docs/6.0/components/
[3]: source/Icon.tsx
[4]: https://getbootstrap.com/docs/6.0/utilities/
