# Idea React

A **[React][1] advanced components library** based on [TypeScript][2] & [Bootstrap][3], built by **[idea2app][4] remote developers team**.

[![MobX compatibility][5]][6]
[![NPM Dependency][7]][8]
[![CI & CD][9]][10]

[![NPM][11]][12]

- API document: https://idea2app.github.io/Idea-React/

## Versions

| SemVer |    status    | ES decorator |    MobX     |
| :----: | :----------: | :----------: | :---------: |
| `>=2`  | ✅developing |   stage-3    |  `>=6.11`   |
|  `<2`  | ❌deprecated |   stage-2    | `>=4 <6.11` |

## Content

### Basic components

1. [Avatar](source/Avatar.tsx)
2. [Badge](source/Badge.tsx)
3. [Button](source/Button.tsx)
4. [Button Group](source/ButtonGroup.tsx)
5. [Card](source/Card.tsx)
6. [Close Button](source/CloseButton.tsx)
7. [Drawer](source/Drawer.tsx)
8. [Grid](source/Grid.tsx)
9. [Image](source/Image.tsx)
10. [List Group](source/ListGroup.tsx)
11. [Menu](source/Menu.tsx)
12. [Native Dialog](source/NativeDialog/)
13. [Nav](source/Nav.tsx)
14. [Navbar](source/Navbar.tsx)
15. [Popover](source/Popover.tsx)
16. [Spinner](source/Spinner.tsx)
17. [Table](source/Table.tsx)
18. [Toast](source/Toast.tsx)
19. [Toggle Button](source/ToggleButton.tsx)
20. [Tooltip](source/Tooltip.tsx)

### Form components

1. [Form, Fieldset, Field, Group, Field Content & Label](source/Form/Primitives.tsx)
2. [Form Control, Text Area & Select](source/Form/Control.tsx)
3. [Checkbox](source/Form/Checkbox.tsx)
4. [Radio & Form Check](source/Form/Radio.tsx)
5. [Switch](source/Form/Switch.tsx)
6. [Range](source/Form/Range.tsx)
7. [Input Group](source/Form/InputGroup.tsx)
8. [Floating Label](source/Form/FloatingLabel.tsx)
9. [Form Adornment & Ghost](source/Form/Adorn.tsx)
10. [Chip & Chip Input](source/Form/Chips.tsx)
11. [Combobox](source/Form/Combobox.tsx)
12. [Date Picker](source/Form/DatePicker.tsx)
13. [OTP Input](source/Form/OTP.tsx)
14. [Password Strength](source/Form/PasswordStrength.tsx)
15. [Form Feedback & Text](source/Form/Feedback.tsx)

### Advanced components

1. [Click Boundary](source/ClickBoundary.tsx)
2. [Code Block](source/CodeBlock.tsx)
3. [Countdown](source/Countdown.tsx)
4. [Dialog](source/Dialog.tsx)
5. [Editor](source/Editor.tsx)
6. [Editor HTML](source/EditorHTML.tsx)
7. [Horizontal Marquee](source/HorizontalMarquee/)
8. [Icon](source/Icon.tsx)
9. [Live TSX](source/LiveTSX.tsx)
10. [Loading](source/Loading.tsx)
11. [Month Calendar](source/MonthCalendar.tsx)
12. [Nameplate](source/Nameplate.tsx)
13. [Overlay Box](source/OverlayBox.tsx)
14. [Page Nav](source/PageNav.tsx)
15. [Scroll Nav](source/ScrollNav/)
16. [Select](source/Select.tsx)
17. [Share Box](source/ShareBox.tsx)
18. [Spinner Button](source/SpinnerButton.tsx)
19. [Table Spinner](source/TableSpinner.tsx)
20. [Text Truncate](source/TextTruncate/)
21. [Time](source/Time.tsx)
22. [Time Distance](source/TimeDistance.tsx)
23. [Timeline](source/Timeline/)
24. [Type Echo](source/TypeEcho/)
25. [User Rank](source/UserRank/)
26. [Vertical Marquee](source/VerticalMarquee/)
27. [Zodiac Bar](source/ZodiacBar.tsx)

### Data components

Table, List & Form components around Data models, have been migrated to https://github.com/idea2app/MobX-RESTful-table, since Idea-React v1.0.0.

### Map components

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
