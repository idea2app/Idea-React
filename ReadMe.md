# Idea React

A **[React][1] advanced components library** based on [TypeScript][2] & [Bootstrap][3], built by **[idea2app][4] remote developers team**.

[![NPM Dependency](https://david-dm.org/idea2app/Idea-React.svg)][5]
[![CI & CD](https://github.com/idea2app/Idea-React/actions/workflows/main.yml/badge.svg)][6]

[![NPM](https://nodei.co/npm/idea-react.png?downloads=true&downloadRank=true&stars=true)][7]

-   API document: https://ideapp.dev/Idea-React/
-   Preview site: https://idea-react-stevending1st.vercel.app/

## CSS on CDN

```html
<link
    rel="stylesheet"
    href="https://unpkg.com/bootstrap@5.2.1/dist/css/bootstrap.min.css"
/>
<link
    rel="stylesheet"
    href="https://unpkg.com/bootstrap-icons@1.9.1/font/bootstrap-icons.css"
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
    href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
/>
<link
    rel="stylesheet"
    href="https://unpkg.com/idea-react@0.27.0/dist/index.umd.css"
/>
```

## Components

1. [Time Distance](source/TimeDistance.tsx)
2. [Pagination Bar](source/PaginationBar.tsx)
3. [Icon](source/Icon.tsx)
4. [Avatar](source/Avatar.tsx)
5. [Nameplate](source/Nameplate.tsx)
6. [Type Echo](source/TypeEcho.tsx)
7. [Click Boundary](source/ClickBoundary.tsx)
8. [Scroll Boundary](source/ScrollBoundary.tsx)
9. [Spinner Button](source/SpinnerButton.tsx)
10. [Select](source/Select.tsx)
11. [Filter Input](source/FilterInput/index.tsx)
12. [File Picker](source/FilePicker/index.tsx)
13. [File Uploader](source/FileUploader/)
14. [Multiple File Uploader](source/MultipleFileUploader/)
15. [Code Block](source/CodeBlock.tsx)
16. [Editor](source/Editor.tsx)
17. [Editor HTML](source/EditorHTML.tsx)
18. [Open Map](source/OpenMap.tsx)
19. [Address Picker](source/AddressPicker.tsx)
20. [Idea Info](source/IdeaInfo.tsx)
21. [Idea Table](source/IdeaTable.tsx)
22. [Table Spinner](source/TableSpinner.tsx)
23. [Loading](source/Loading.tsx)
24. [Pagination Bar](source/PaginationBar.tsx)
25. [Idea Form](source/IdeaForm.tsx)
26. [Idea Popover](source/IdeaPopover.tsx)
27. [Idea Dialog](source/IdeaDialog.tsx)

## Utilities

1. [`text2color`](source/color.ts)
2. [`animate()`](source/animate.ts)

## Scaffolds

1. MobX: [demo][8] & [usage][9]
2. Next.js: [demo][10] & [usage][11]

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
[4]: https://ideapp.dev/
[5]: https://david-dm.org/idea2app/Idea-React
[6]: https://github.com/idea2app/Idea-React/actions/workflows/main.yml
[7]: https://nodei.co/npm/idea-react/
[8]: https://ideapp.dev/React-MobX-Bootstrap-ts/
[9]: https://github.com/idea2app/React-MobX-Bootstrap-ts/blob/master/src/page/Component.tsx
[10]: https://next-bootstrap-ts.vercel.app/
[11]: https://github.com/idea2app/next-bootstrap-ts/blob/main/pages/component.tsx
