# Idea React

A **[React][1] advanced components library** based on [TypeScript][2] & [Bootstrap][3], built by **[idea2app][4] remote developers team**.

[![MobX compatibility][5]][6]
[![NPM Dependency][7]][8]
[![CI & CD][9]][10]

[![NPM][11]][12]

- API document: https://idea2app.github.io/Idea-React/
- Preview site: https://idea2app.github.io/Idea-React/preview/

## Versions

| SemVer |    status    | ES decorator |    MobX     |
| :----: | :----------: | :----------: | :---------: |
| `>=2`  | ✅developing |   stage-3    |  `>=6.11`   |
|  `<2`  | ❌deprecated |   stage-2    | `>=4 <6.11` |

## Content

### Components

1. [Button](source/Button.tsx)
2. [Badge](source/Badge.tsx)
3. [Navbar](source/Navbar.tsx)
4. [Menu](source/Menu.tsx)
5. [Native Dialog](source/NativeDialog/index.tsx)
6. [Nav](source/Nav.tsx)
7. [Card](source/Card.tsx)
8. [Grid](source/Grid.tsx)
9. [Image](source/Image.tsx)
10. [Table](source/Table.tsx)
11. [Popover](source/Popover.tsx)
12. [Tooltip](source/Tooltip.tsx)
13. [Time](source/Time.tsx)
14. [Time Distance](source/TimeDistance.tsx)
15. [Timeline](source/Timeline/)
16. [Countdown](source/Countdown.tsx)
17. [Icon](source/Icon.tsx)
18. [Avatar](source/Avatar.tsx)
19. [Nameplate](source/Nameplate.tsx)
20. [Text Truncate](source/TextTruncate/)
21. [Type Echo](source/TypeEcho/)
22. [Horizontal Marquee](source/HorizontalMarquee/)
23. [Vertical Marquee](source/VerticalMarquee/)
24. [Click Boundary](source/ClickBoundary.tsx)
25. [Spinner Button](source/SpinnerButton.tsx)
26. [Select](source/Select.tsx)
27. [Month Calendar](source/MonthCalendar.tsx)
28. [Code Block](source/CodeBlock.tsx)
29. [Live TSX](source/LiveTSX.tsx)
30. [Scroll Nav](source/ScrollNav/)
31. [Page Nav](source/PageNav.tsx)
32. [Editor](source/Editor.tsx)
33. [Editor HTML](source/EditorHTML.tsx)
34. [Table Spinner](source/TableSpinner.tsx)
35. [Loading](source/Loading.tsx)
36. [Share Box](source/ShareBox.tsx)
37. [Overlay Box](source/OverlayBox.tsx)
38. [Dialog](source/Dialog.tsx)
39. [Toast](source/Toast.tsx)
40. [User Rank](source/UserRank/)
41. [Zodiac Bar](source/ZodiacBar.tsx)

#### Data components

Table, List & Form components around Data models, have been migrated to https://github.com/idea2app/MobX-RESTful-table, since Idea-React v1.0.0.

#### Map components

Open Map component & model, have been migrated to https://github.com/idea2app/OpenReactMap, since Idea-React v1.0.0.

### Utilities

1. [`text2color`](source/color.ts)
2. [`animate()`](source/animate.ts)

## Usage

```sh
npm install idea-react mobx mobx-react react react-dom react-element-to-jsx-string
```

For the current alpha release, use `idea-react@next` instead of `idea-react`.

### Scaffolds

1. MobX: [demo][13] & [usage][14]
2. Next.js: [demo][15] & [usage][16]

### CSS on CDN

```html
<link
    rel="stylesheet"
    href="https://unpkg.com/bootstrap@6.0.0-alpha.1/dist/css/bootstrap.min.css"
/>
<link rel="stylesheet" href="https://unpkg.com/bootstrap-icons@1.13.1/font/bootstrap-icons.css" />
<link rel="stylesheet" href="https://unpkg.com/animate.css@4.1.1/animate.min.css" />
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
import { Button, Toast } from 'idea-react';

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
                                theme: 'success'
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

The [document workspace][17] provides a static website with MDX pages, theme switching,
and local search, adapting the upstream website to Idea React.

```sh
pnpm install
pnpm --filter @idea-react/document dev
```

For build and deployment quick start, see the document workspace guide above.
Contributor conventions, validation, and release instructions are in [AGENTS.md](AGENTS.md).

[1]: https://reactjs.org/
[2]: https://www.typescriptlang.org/
[3]: https://getbootstrap.com/
[4]: https://idea2.app/
[5]: https://img.shields.io/badge/Compatible-1?logo=mobx&label=MobX%206%2F7
[6]: https://mobx.js.org/
[7]: https://img.shields.io/librariesio/github/idea2app/Idea-React.svg
[8]: https://libraries.io/npm/idea-react
[9]: https://github.com/idea2app/Idea-React/actions/workflows/main.yml/badge.svg
[10]: https://github.com/idea2app/Idea-React/actions/workflows/main.yml
[11]: https://nodei.co/npm/idea-react.png?downloads=true&downloadRank=true&stars=true
[12]: https://npm.im/idea-react/
[13]: https://idea2app.github.io/React-MobX-Bootstrap-ts/
[14]: https://github.com/idea2app/React-MobX-Bootstrap-ts/blob/master/src/page/Component.tsx
[15]: https://next-bootstrap-ts.vercel.app/
[16]: https://github.com/idea2app/next-bootstrap-ts/blob/main/pages/component.tsx
[17]: document/README.md
