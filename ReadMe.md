# Idea React

A **[React][1] advanced components library** based on [TypeScript][2] & [Bootstrap][3], built by **[idea2app][4] remote developers team**.

[![MobX compatibility][47]][5]
[![NPM Dependency][48]][6]
[![CI & CD][49]][7]

[![NPM][50]][8]

- API document: https://idea2app.github.io/Idea-React/
- Preview site: https://idea2app.github.io/Idea-React/preview/

## Versions

| SemVer |    status    | ES decorator |    MobX     |
| :----: | :----------: | :----------: | :---------: |
| `>=2`  | ✅developing |   stage-3    |  `>=6.11`   |
|  `<2`  | ❌deprecated |   stage-2    | `>=4 <6.11` |

## Content

### Components

1. [Button][13]
2. [Badge][14]
3. [Navbar][15]
4. [Menu][16]
5. [Native Dialog][17]
6. [Time][18]
7. [Time Distance][19]
8. [Timeline][20]
9. [Countdown][21]
10. [Icon][22]
11. [Avatar][23]
12. [Nameplate][24]
13. [Text Truncate][25]
14. [Type Echo][26]
15. [Horizontal Marquee][27]
16. [Vertical Marquee][28]
17. [Click Boundary][29]
18. [Spinner Button][30]
19. [Select][31]
20. [Month Calendar][32]
21. [Code Block][33]
22. [Live TSX][34]
23. [Scroll Nav][35]
24. [Page Nav][36]
25. [Editor][37]
26. [Editor HTML][38]
27. [Table Spinner][39]
28. [Loading][40]
29. [Share Box][41]
30. [Overlay Box][42]
31. [Dialog][43]
32. [Toast][44]
33. [User Rank][45]
34. [Zodiac Bar][46]

#### Data components

Table, List & Form components around Data models, have been migrated to https://github.com/idea2app/MobX-RESTful-table, since Idea-React v1.0.0.

#### Map components

Open Map component & model, have been migrated to https://github.com/idea2app/OpenReactMap, since Idea-React v1.0.0.

### Utilities

1. [`text2color`][51]
2. [`animate()`][52]

## Usage

### Scaffolds

1. MobX: [demo][9] & [usage][10]
2. Next.js: [demo][11] & [usage][12]

### CSS on CDN

```html
<link rel="stylesheet" href="https://unpkg.com/bootstrap@5.3.8/dist/css/bootstrap.min.css" />
<link rel="stylesheet" href="https://unpkg.com/bootstrap-icons@1.13.1/font/bootstrap-icons.css" />
<link rel="stylesheet" href="https://unpkg.com/animate.css@4.1.1/animate.min.css" />
<link rel="stylesheet" href="https://unpkg.com/prismjs@1.30.0/themes/prism.min.css" />
<link rel="stylesheet" href="https://unpkg.com/idea-react/dist/index.css" />
```

### `tsconfig.json`

Compatible with MobX 6/7:

```json
{
    "compilerOptions": {
        "target": "ES6",
        "moduleResolution": "Node",
        "useDefineForClassFields": true,
        "experimentalDecorators": false,
        "jsx": "react-jsx"
    }
}
```

### Dialog

```tsx
import { formToJSON } from 'web-utility';
import { Component } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Dialog, DialogClose } from 'idea-react';

export class ExamplePage extends Component {
    inputDialog = new Dialog<Record<'a' | 'b', number>>(({ defer }) => (
        <Modal show={!!defer} onHide={() => defer?.reject(new DialogClose())}>
            <Modal.Header>Dialog</Modal.Header>
            <Modal.Body>
                <Form
                    id="input-dialog"
                    onSubmit={event => {
                        event.preventDefault();

                        defer?.resolve(formToJSON(event.currentTarget));
                    }}
                    onReset={() => defer?.reject(new DialogClose())}
                >
                    <Form.Group>
                        <Form.Label>A</Form.Label>
                        <Form.Control type="number" name="a" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>B</Form.Label>
                        <Form.Control type="number" name="b" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-end gap-3">
                <Button form="input-dialog" type="submit">
                    √
                </Button>
                <Button form="input-dialog" type="reset" variant="danger">
                    ×
                </Button>
            </Modal.Footer>
        </Modal>
    ));

    someLogic = async () => {
        try {
            const data = await this.inputDialog.open();

            alert(JSON.stringify(data, null, 4));
        } catch (error) {
            if (error instanceof DialogClose) console.warn(error.message);
        }
    };

    render() {
        return (
            <>
                <Button onClick={this.someLogic}>open Dialog</Button>

                <this.inputDialog.Component />
            </>
        );
    }
}
```

### Toast

```tsx
import { Component } from 'react';
import { Button } from 'react-bootstrap';
import { Toast } from 'idea-react';

export class ExamplePage extends Component {
    toast = new Toast();

    render() {
        return (
            <>
                <Button
                    onClick={() =>
                        this.toast
                            .open({
                                title: 'Notification',
                                body: 'Hello, world!',
                                variant: 'success'
                            })
                            .then(() => console.log('Toast closed'))
                    }
                >
                    Show Toast
                </Button>

                <this.toast.Component />
            </>
        );
    }
}
```

## Development

### Documentation

The [document workspace][53] builds a static website with MDX support
with ViNext and Vite. Its pages adapt the upstream website design to Idea React branding,
version, license, and project links.

```sh
pnpm install
pnpm --filter @idea-react/document dev
```

```sh
pnpm test:components
pnpm exec tsc --project test/tsconfig.json
pnpm --filter @idea-react/document test
pnpm --filter @idea-react/document build
pnpm --filter @idea-react/document start
```

The documentation `test` script runs TypeScript checks; `test:components` uses
the native Node.js test runner (Node.js 22.18+) to run the
public component unit tests in `test/ComponentName.test.tsx`, excluding
documentation-site-only components. Deploy only `document/dist/client/` to
a static host, without a Worker or Node.js runtime. Set `basePath` in
[document/next.config.ts][54] before building for a subdirectory
such as `/Idea-React`.

The root build and release deployment still use the legacy TypeDoc and preview
output in `docs/`. Build and deploy the MDX workspace separately.

### Publish

1. update `version` in `package.json` file

2. add Git tag

```shell
git tag vx.xx.x  # such as v2.0.0
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
[4]: https://idea2.app/
[5]: https://mobx.js.org/
[6]: https://libraries.io/npm/idea-react
[7]: https://github.com/idea2app/Idea-React/actions/workflows/main.yml
[8]: https://npm.im/idea-react/
[9]: https://idea2app.github.io/React-MobX-Bootstrap-ts/
[10]: https://github.com/idea2app/React-MobX-Bootstrap-ts/blob/master/src/page/Component.tsx
[11]: https://next-bootstrap-ts.vercel.app/
[12]: https://github.com/idea2app/next-bootstrap-ts/blob/main/pages/component.tsx
[13]: source/Button.tsx
[14]: source/Badge.tsx
[15]: source/Navbar.tsx
[16]: source/Menu.tsx
[17]: source/NativeDialog/index.tsx
[18]: source/Time.tsx
[19]: source/TimeDistance.tsx
[20]: source/Timeline/
[21]: source/Countdown.tsx
[22]: source/Icon.tsx
[23]: source/Avatar.tsx
[24]: source/Nameplate.tsx
[25]: source/TextTruncate.tsx
[26]: source/TypeEcho.tsx
[27]: source/HorizontalMarquee/
[28]: source/VerticalMarquee/
[29]: source/ClickBoundary.tsx
[30]: source/SpinnerButton.tsx
[31]: source/Select.tsx
[32]: source/MonthCalendar.tsx
[33]: source/CodeBlock.tsx
[34]: source/LiveTSX.tsx
[35]: source/ScrollNav/
[36]: source/PageNav.tsx
[37]: source/Editor.tsx
[38]: source/EditorHTML.tsx
[39]: source/TableSpinner.tsx
[40]: source/Loading.tsx
[41]: source/ShareBox.tsx
[42]: source/OverlayBox.tsx
[43]: source/Dialog.tsx
[44]: source/Toast.tsx
[45]: source/UserRank/
[46]: source/ZodiacBar.tsx
[47]: https://img.shields.io/badge/Compatible-1?logo=mobx&label=MobX%206%2F7
[48]: https://img.shields.io/librariesio/github/idea2app/Idea-React.svg
[49]: https://github.com/idea2app/Idea-React/actions/workflows/main.yml/badge.svg
[50]: https://nodei.co/npm/idea-react.png?downloads=true&downloadRank=true&stars=true
[51]: source/color.ts
[52]: source/animate.ts
[53]: document/README.md
[54]: document/next.config.ts
