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
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
/>
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.1/font/bootstrap-icons.css"
/>
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/animate.css@4.1.1/animate.min.css"
/>
<link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/prismjs@1.28.0/themes/prism.min.css"
/>
```

## Components

1. [Time Distance](source/TimeDistance.tsx)
2. [Pagination Bar](source/PaginationBar.tsx)
3. [Icon](source/Icon.tsx)
4. [Avatar](source/Avatar.tsx)
5. [Nameplate](source/Nameplate.tsx)
6. [Type Echo](source/TypeEcho.tsx)
7. [Select](source/Select.tsx)
8. [Filter Input](source/FilterInput/index.tsx)
9. [File Picker](source/FilePicker/index.tsx)
10. [File Uploader](source/FileUploader/)
11. [Multiple File Uploader](source/MultipleFileUploader/)
12. [Code Block](source/CodeBlock.tsx)
13. [Editor](source/Editor.tsx)
14. [Editor HTML](source/EditorHTML.tsx)
15. [Address Picker](source/AddressPicker.tsx)
16. [Idea Info](source/IdeaInfo.tsx)
17. [Idea Table](source/IdeaTable.tsx)
18. [Table Spinner](source/TableSpinner.tsx)
19. [Loading](source/Loading.tsx)
20. [Pagination Bar](source/PaginationBar.tsx)
21. [Idea Form](source/IdeaForm.tsx)
22. [Idea Popover](source/IdeaPopover.tsx)
23. [Idea Dialog](source/IdeaDialog.tsx)

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
git tag vx.xx.x  # 0.23.0
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
