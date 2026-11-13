# Idea React

A **[React][1] advanced components library** based on [TypeScript][2] & [Bootstrap][3], built by **[idea2app][4] remote developers team**.

[![MobX compatibility][5]][6]
[![NPM Dependency][7]][8]
[![CI & CD][9]][10]

[![NPM][11]][12]

- API document: https://idea2app.github.io/Idea-React/

## Versions

|  SemVer  |    status    | ES decorator |    MobX     | Bootstrap |
| :------: | :----------: | :----------: | :---------: | :-------: |
|  `>=3`   | ✅developing |   stage-3    |  `>=6.11`   |    v6     |
| `>=2 <3` | ❌deprecated |   stage-3    |  `>=6.11`   |    v5     |
|   `<2`   | ❌deprecated |   stage-2    | `>=4 <6.11` |    v5     |

## Content

### Basic components

1. [Accordion](source/Base/Accordion.tsx)
2. [Alert](source/Base/Alert.tsx)
3. [Avatar](source/Base/Avatar.tsx)
4. [Badge](source/Base/Badge.tsx)
5. [Breadcrumb](source/Base/Breadcrumb.tsx)
6. [Button](source/Base/Button.tsx)
7. [Button Group](source/Base/ButtonGroup.tsx)
8. [Card](source/Base/Card.tsx)
9. [Carousel](source/Base/Carousel)
10. [Close Button](source/Base/CloseButton.tsx)
11. [Collapse](source/Base/Collapse.tsx)
12. [Dialog](source/Base/Dialog)
13. [Drawer](source/Base/Drawer.tsx)
14. [List Group](source/Base/ListGroup.tsx)
15. [Menu](source/Base/Menu.tsx)
16. [Nav](source/Base/Nav.tsx)
17. [Nav Overflow](source/Base/NavOverflow)
18. [Navbar](source/Base/Navbar.tsx)
19. [Pagination](source/Base/Pagination.tsx)
20. [Placeholder](source/Base/Placeholder.tsx)
21. [Popover](source/Base/Popover.tsx)
22. [Progress](source/Base/Progress/)
23. [Scrollspy](source/Base/ScrollSpy)
24. [Spinner](source/Base/Spinner.tsx)
25. [Stepper](source/Base/Stepper.tsx)
26. [Tab](source/Base/Tab.tsx)
27. [Toast](source/Base/Toast.tsx)
28. [Toggler](source/Base/Toggler.tsx)
29. [Tooltip](source/Base/Tooltip.tsx)
30. [Toggle Button](source/Base/ToggleButton.tsx)

### Layout components

1. [Grid](source/Layout/Grid.tsx)

### Content components

1. [Images](source/Content/Image.tsx)
2. [Tables](source/Content/Tables.tsx)

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
10. [Chip](source/Form/Chip.tsx)
11. [Chip Input](source/Form/ChipInput.tsx)
12. [Combobox](source/Form/Combobox.tsx)
13. [Date Picker](source/Form/DatePicker.tsx)
14. [OTP Input](source/Form/OTP.tsx)
15. [Password Strength](source/Form/PasswordStrength.tsx)
16. [Form Feedback & Text](source/Form/Feedback.tsx)

### Extension components

1. [Click Boundary](source/Extension/ClickBoundary.tsx)
2. [Code Block](source/Extension/CodeBlock.tsx)
3. [Countdown](source/Extension/Countdown.tsx)
4. [DialogBox](source/Extension/Dialog.tsx)
5. [Markdown View](source/Extension/MarkdownView.tsx)
6. [Horizontal Marquee](source/Extension/HorizontalMarquee/)
7. [Icon](source/Extension/Icon.tsx)
8. [Live TSX](source/Extension/LiveTSX.tsx)
9. [Loading](source/Extension/Loading.tsx)
10. [Month Calendar](source/Extension/MonthCalendar.tsx)
11. [Nameplate](source/Extension/Nameplate.tsx)
12. [Overlay Box](source/Extension/OverlayBox.tsx)
13. [Page Nav](source/Extension/PageNav.tsx)
14. [Scroll Nav](source/Extension/ScrollNav/)
15. [Share Box](source/Extension/ShareBox.tsx)
16. [Spinner Button](source/Extension/SpinnerButton.tsx)
17. [Table Spinner](source/Extension/TableSpinner.tsx)
18. [Text Truncate](source/Extension/TextTruncate/)
19. [Time](source/Extension/Time.tsx)
20. [Time Distance](source/Extension/TimeDistance.tsx)
21. [Timeline](source/Extension/Timeline/)
22. [Type Echo](source/Extension/TypeEcho/)
23. [User Rank](source/Extension/UserRank/)
24. [Vertical Marquee](source/Extension/VerticalMarquee/)
25. [Zodiac Bar](source/Extension/ZodiacBar.tsx)

### Data components

Table, List & Form components around Data models, have been migrated to https://github.com/idea2app/MobX-RESTful-table, since Idea-React v1.0.0.

### Map components

Open Map component & model, have been migrated to https://github.com/idea2app/OpenReactMap, since Idea-React v1.0.0.

### Utilities

1. [`text2color`](source/Helper/color.ts)
2. [`animate()`](source/Helper/animate.ts)

## Usage

```sh
npm install idea-react mobx mobx-react react react-dom react-element-to-jsx-string web-utility
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
<link rel="stylesheet" href="https://unpkg.com/bootstrap-icons@1.13.2/font/bootstrap-icons.css" />
<link rel="stylesheet" href="https://unpkg.com/animate.css@4.1.1/animate.min.css" />
<link rel="stylesheet" href="https://unpkg.com/github-markdown-css@5.9.0/github-markdown.css" />
<link rel="stylesheet" href="https://unpkg.com/idea-react/dist/style.css" />
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

### Polymorphic roots

Components with a single root support `as`, accepting an HTML tag or another React component:

```tsx
import { ComponentPropsWithRef, FC } from 'react';
import { Button, Card, PolymorphicProps } from 'idea-react';

const RouterLink: FC<ComponentPropsWithRef<'a'> & { to: string }> = ({ to, ...props }) => (
    <a {...props} href={to} />
);

type LinkCardProps = PolymorphicProps<typeof RouterLink, { theme?: 'primary' }>;

<Card as="article">Article content</Card>;

<Button as={RouterLink} to="/docs" variant="solid" theme="primary">
    Documentation
</Button>;
```

The target's additional props are inferred and forwarded, including required props and compatible
refs. Component-specific props keep their existing meaning and take precedence on name collisions.
Without `as`, the default markup and props stay unchanged. Class component refs still refer to the
component instance. Behavioral components require compatible root elements; custom roots must forward
their DOM props and refs. Components that render fragments or multiple roots do not support `as`.

### DialogBox model

```tsx
import { formToJSON } from 'web-utility';
import { Component, FormEvent } from 'react';
import {
    Button,
    Dialog,
    DialogBody,
    DialogBox,
    DialogBoxClose,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Form,
    FormControl,
    FormField,
    FormLabel
} from 'idea-react';

export class ExamplePage extends Component {
    inputDialog = new DialogBox<{}, Record<'a' | 'b', number>>(({ defer }) => (
        <Dialog open={!!defer} onClose={() => defer?.reject(new DialogBoxClose())}>
            <DialogHeader>
                <DialogTitle>Dialog</DialogTitle>
            </DialogHeader>
            <DialogBody>
                <Form
                    className="d-flex flex-column gap-3"
                    id="input-dialog"
                    onSubmit={this.handleSubmit}
                    onReset={() => defer?.reject(new DialogBoxClose())}
                >
                    <FormField>
                        <FormLabel htmlFor="input-dialog-a">A</FormLabel>
                        <FormControl id="input-dialog-a" type="number" name="a" />
                    </FormField>
                    <FormField>
                        <FormLabel htmlFor="input-dialog-b">B</FormLabel>
                        <FormControl id="input-dialog-b" type="number" name="b" />
                    </FormField>
                </Form>
            </DialogBody>
            <DialogFooter>
                <Button form="input-dialog" type="submit" variant="solid" theme="primary">
                    √
                </Button>
                <Button form="input-dialog" type="reset" variant="solid" theme="danger">
                    ×
                </Button>
            </DialogFooter>
        </Dialog>
    ));

    handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const data = formToJSON<Record<'a' | 'b', number>>(event.currentTarget);

        this.inputDialog.defer?.resolve(data);
    };

    someLogic = async () => {
        try {
            const data = await this.inputDialog.open();

            alert(JSON.stringify(data, null, 4));
        } catch (error) {
            if (error instanceof DialogBoxClose) console.warn(error.message);
        }
    };

    render() {
        return (
            <>
                <Button onClick={this.someLogic}>Open dialog</Button>

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
