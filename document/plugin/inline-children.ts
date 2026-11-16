import { MdastNode } from './types';

const inlineElements = new Set([
    'a',
    'p',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'AccordionHeader',
    'AccordionToggle',
    'AlertLink',
    'AlertHeading',
    'Avatar',
    'Badge',
    'BreadcrumbLink',
    'Button',
    'button',
    'CardTitle',
    'CardSubtitle',
    'CardText',
    'CarouselImage',
    'ChipDismiss',
    'ChipInputLabel',
    'Chip',
    'CloseButton',
    'CollapseToggle',
    'ComboboxOption',
    'DatePickerButton',
    'DialogTitle',
    'DrawerTitle',
    'label',
    'FormLabel',
    'FormLegend',
    'FormAdornment',
    'FormAdornmentText',
    'FormSwitch',
    'FormText',
    'FormFeedback',
    'InputGroupText',
    'InputGroupButton',
    'ListGroupItem',
    'MenuItem',
    'MenuItemContent',
    'NavbarBrand',
    'NavLink',
    'PageLink',
    'PageText',
    'PlaceholderButton',
    'Popover',
    'Progress',
    'span',
    'SpinnerButton',
    'StepperButton',
    'StepperLink',
    'ToggleButton',
    'Toggler',
    'Tooltip',
    'th',
    'td'
]);

const visit = (node: MdastNode) => {
    for (const child of node.children || []) {
        if (child.type === 'mdxJsxFlowElement' && child.children && inlineElements.has(child.name!))
            child.children = child.children.flatMap(grandChild =>
                grandChild.type === 'paragraph' ? grandChild.children || [] : [grandChild]
            );
        visit(child);
    }
};

export const remarkInlineButtonChildren = () => (tree: MdastNode) => visit(tree);
