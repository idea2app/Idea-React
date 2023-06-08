# Idea React

A **[React][1] advanced components library** based on [TypeScript][2] & [Bootstrap][3], built by **[idea2app][4] remote developers team**.

[![NPM Dependency](https://david-dm.org/idea2app/Idea-React.svg)][5]
[![CI & CD](https://github.com/idea2app/Idea-React/actions/workflows/main.yml/badge.svg)][6]

[![NPM](https://nodei.co/npm/idea-react.png?downloads=true&downloadRank=true&stars=true)][7]

-   API document: https://idea2app.github.io/Idea-React/
-   Preview site: https://idea-react.vercel.app/

## Content

### Components

1. [Time Distance](source/TimeDistance.tsx)
2. [Icon](source/Icon.tsx)
3. [Avatar](source/Avatar.tsx)
4. [Nameplate](source/Nameplate.tsx)
5. [Type Echo](source/TypeEcho.tsx)
6. [Click Boundary](source/ClickBoundary.tsx)
7. [Spinner Button](source/SpinnerButton.tsx)
8. [Select](source/Select.tsx)
9. [Code Block](source/CodeBlock.tsx)
10. [Editor](source/Editor.tsx)
11. [Editor HTML](source/EditorHTML.tsx)
12. [Open Map](source/OpenMap/index.tsx)
13. [Table Spinner](source/TableSpinner.tsx)
14. [Loading](source/Loading.tsx)
15. [Idea Popover](source/IdeaPopover.tsx)
16. [Idea Dialog](source/IdeaDialog.tsx)

#### Data components

Table, List & Form components around Data models, have been migrated to https://github.com/idea2app/MobX-RESTful-table, since Idea-React v1.0.0.

### Utilities

1. [`text2color`](source/color.ts)
2. [`animate()`](source/animate.ts)

## Usage

### Scaffolds

1. MobX: [demo][8] & [usage][9]
2. Next.js: [demo][10] & [usage][11]

### CSS on CDN

```html
<link
    rel="stylesheet"
    href="https://unpkg.com/bootstrap@5.3.0/dist/css/bootstrap.min.css"
/>
<link
    rel="stylesheet"
    href="https://unpkg.com/bootstrap-icons@1.10.4/font/bootstrap-icons.css"
/>
<link
    rel="stylesheet"
    href="https://unpkg.com/animate.css@4.1.1/animate.min.css"
/>
<link
    rel="stylesheet"
    href="https://unpkg.com/prismjs@1.29.0/themes/prism.min.css"
/>
<link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
/>
```

### Open Map

#### Common example

[China map in China Open-source Map project][12]

```tsx
import { FC } from 'react';
import { OpenMap, OpenMapProps } from 'idea-react';

export const ChinaMap: FC<OpenMapProps> = props => (
    <OpenMap center={[34.32, 108.55]} zoom={4} {...props} />
);
```

#### Use in Next.js

```tsx
import ChinaMap from '../../components/ChinaMap';

export default function ExampleMap() {
    return (
        typeof window !== 'undefined' && (
            <ChinaMap
                markers={[
                    {
                        position: [34.32, 108.55],
                        tooltip: 'Geo Center of China'
                    }
                ]}
                onMarkerClick={console.log}
            />
        )
    );
}
```

## Development

### Publish

1. update `version` in `package.json` file

2. add Git tag

```shell
git tag vx.xx.x  # such as v0.23.0
```

3. review tag

```shell
git tag
```

4. publish code with tag version

```shell
git push origin master --tags  # push all branches and tags on master
```

[1]: https://reactjs.org/
[2]: https://www.typescriptlang.org/
[3]: https://getbootstrap.com/
[4]: https://idea2app.github.io/
[5]: https://david-dm.org/idea2app/Idea-React
[6]: https://github.com/idea2app/Idea-React/actions/workflows/main.yml
[7]: https://nodei.co/npm/idea-react/
[8]: https://idea2app.github.io/React-MobX-Bootstrap-ts/
[9]: https://github.com/idea2app/React-MobX-Bootstrap-ts/blob/master/src/page/Component.tsx
[10]: https://next-bootstrap-ts.vercel.app/
[11]: https://github.com/idea2app/next-bootstrap-ts/blob/main/pages/component.tsx
[12]: https://github.com/kaiyuanshe/kaiyuanshe.github.io/blob/04d6311a6bd7f131e214034801a42f5044c87133/components/ChinaMap.tsx
