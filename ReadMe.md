# Idea React

A **[React][1] advanced components library** based on [TypeScript][2] & [Bootstrap][3], built by **[idea2app][4] remote developers team**.

[![MobX compatibility](https://img.shields.io/badge/Compatible-1?logo=mobx&label=MobX%206%2F7)][5]
[![NPM Dependency](https://img.shields.io/librariesio/github/idea2app/Idea-React.svg)][6]
[![CI & CD](https://github.com/idea2app/Idea-React/actions/workflows/main.yml/badge.svg)][7]

[![NPM](https://nodei.co/npm/idea-react.png?downloads=true&downloadRank=true&stars=true)][8]

-   API document: https://idea2app.github.io/Idea-React/
-   Preview site: https://idea2app.github.io/Idea-React/preview/
-   Storybook playground: https://idea-react.vercel.app/

## Versions

| SemVer |    status    | ES decorator |    MobX     |
| :----: | :----------: | :----------: | :---------: |
| `>=2`  | ✅developing |   stage-3    |  `>=6.11`   |
|  `<2`  | ❌deprecated |   stage-2    | `>=4 <6.11` |

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
9. [Month Calendar](source/MonthCalendar.tsx)
10. [Code Block](source/CodeBlock.tsx)
11. [Page Nav](source/PageNav.tsx)
12. [Editor](source/Editor.tsx)
13. [Editor HTML](source/EditorHTML.tsx)
14. [Table Spinner](source/TableSpinner.tsx)
15. [Loading](source/Loading.tsx)
16. [Overlay Box](source/OverlayBox.tsx)
17. [Dialog](source/Dialog.tsx)

#### Data components

Table, List & Form components around Data models, have been migrated to https://github.com/idea2app/MobX-RESTful-table, since Idea-React v1.0.0.

#### Map components

Open Map component & model, have been migrated to https://github.com/idea2app/OpenMap, since Idea-React v1.0.0.

### Utilities

1. [`text2color`](source/color.ts)
2. [`animate()`](source/animate.ts)

## Usage

### Scaffolds

1. MobX: [demo][9] & [usage][10]
2. Next.js: [demo][11] & [usage][12]

### CSS on CDN

```html
<link
    rel="stylesheet"
    href="https://unpkg.com/bootstrap@5.3.2/dist/css/bootstrap.min.css"
/>
<link
    rel="stylesheet"
    href="https://unpkg.com/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
/>
<link
    rel="stylesheet"
    href="https://unpkg.com/animate.css@4.1.1/animate.min.css"
/>
<link
    rel="stylesheet"
    href="https://unpkg.com/prismjs@1.29.0/themes/prism.min.css"
/>
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
import { PureComponent } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { Dialog, DialogClose } from 'idea-react';

export class ExamplePage extends PureComponent {
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

## Development

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
[4]: https://idea2app.github.io/
[5]: https://mobx.js.org/
[6]: https://libraries.io/npm/idea-react
[7]: https://github.com/idea2app/Idea-React/actions/workflows/main.yml
[8]: https://nodei.co/npm/idea-react/
[9]: https://idea2app.github.io/React-MobX-Bootstrap-ts/
[10]: https://github.com/idea2app/React-MobX-Bootstrap-ts/blob/master/src/page/Component.tsx
[11]: https://next-bootstrap-ts.vercel.app/
[12]: https://github.com/idea2app/next-bootstrap-ts/blob/main/pages/component.tsx
