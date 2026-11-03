import assert from 'node:assert/strict';
import { it } from 'node:test';

import { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
    AccordionToggle,
    Alert,
    AlertHeading,
    AlertLink,
    Avatar,
    AvatarImage,
    AvatarStack,
    Badge,
    Breadcrumb,
    BreadcrumbDivider,
    BreadcrumbItem,
    BreadcrumbLink,
    Button,
    ButtonGroup,
    ButtonInput,
    ButtonToolbar,
    Card,
    CardBody,
    CardFooter,
    CardGroup,
    CardHeader,
    CardImage,
    CardImageOverlay,
    CardSubtitle,
    CardText,
    CardTitle,
    Carousel,
    CarouselSlide,
    Checkbox,
    Chip,
    ChipDismiss,
    ChipIcon,
    ChipImage,
    ChipInput,
    ChipInputLabel,
    ChipToken,
    ClickBoundary,
    CloseButton,
    CodeBlock,
    Col,
    Collapse,
    CollapseToggle,
    Combobox,
    ComboboxGroup,
    ComboboxOption,
    Container,
    Countdown,
    DatePicker,
    DatePickerButton,
    DatePickerInline,
    DialogBody,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    Editor,
    EditorHTML,
    Form,
    FormAdornment,
    FormAdornmentIcon,
    FormAdornmentText,
    FormCheck,
    FormControl,
    FormFeedback,
    FormField,
    FormFieldContent,
    FormFieldset,
    FormFloatingLabel,
    FormGhost,
    FormGroup,
    FormLabel,
    FormLegend,
    FormRange,
    FormSelect,
    FormSwitch,
    FormText,
    FormTextArea,
    HorizontalMarquee,
    HorizontalMarqueeBox,
    Icon,
    Image,
    InputGroup,
    InputGroupButton,
    InputGroupIgnore,
    InputGroupText,
    ListGroup,
    ListGroupItem,
    Loading,
    Menu,
    MenuDivider,
    MenuHeader,
    MenuItem,
    MenuItemCheck,
    MenuItemContent,
    MenuItemDescription,
    MenuItemIcon,
    MenuPanel,
    MenuSubmenu,
    MenuText,
    MonthCalendar,
    NativeDialog,
    Nav,
    Navbar,
    NavbarBrand,
    NavbarNav,
    NavbarText,
    NavbarToggler,
    NavItem,
    NavLink,
    NavOverflow,
    Option,
    OTPInput,
    OverlayBox,
    PageItem,
    PageLink,
    PageNav,
    PageText,
    Pagination,
    Placeholder,
    PlaceholderAnimation,
    PlaceholderButton,
    Popover,
    Progress,
    ProgressStack,
    Radio,
    Row,
    ScrollNav,
    ScrollSpy,
    Spinner,
    SpinnerButton,
    SpinnerIcon,
    Stepper,
    StepperButton,
    StepperItem,
    StepperLink,
    StepperNav,
    StepperOverflow,
    Tab,
    Table,
    TableSpinner,
    TextTruncate,
    Time,
    TimeDistance,
    Timeline,
    ToastBody,
    ToastContainer,
    ToastHeader,
    ToastItem,
    ToggleButton,
    Toggler,
    Tooltip,
    TypeEcho,
    UserRankView,
    VerticalMarquee,
    ZodiacBar
} from '../source';

interface TargetProps extends HTMLAttributes<HTMLElement> {
    payload: { value: number };
    'data-example'?: string;
}

const payload = { value: 42 };
const captures: TargetProps[] = [];

const Target = (props: TargetProps): ReactNode => {
    captures.push(props);
    return null;
};

const examples: [string, ReactElement][] = [
    ['Button', <Button as={Target} payload={payload} data-example="polymorphic" />],
    ['ButtonInput', <ButtonInput as={Target} payload={payload} data-example="polymorphic" />],
    ['Icon', <Icon name="check" as={Target} payload={payload} data-example="polymorphic" />],
    ['Accordion', <Accordion as={Target} payload={payload} data-example="polymorphic" />],
    ['AccordionItem', <AccordionItem as={Target} payload={payload} data-example="polymorphic" />],
    [
        'AccordionHeader',
        <AccordionHeader as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['AccordionBody', <AccordionBody as={Target} payload={payload} data-example="polymorphic" />],
    [
        'AccordionToggle',
        <AccordionToggle
            target="#polymorphic-accordion"
            as={Target}
            payload={payload}
            data-example="polymorphic"
        />
    ],
    ['CloseButton', <CloseButton as={Target} payload={payload} data-example="polymorphic" />],
    ['Alert', <Alert as={Target} payload={payload} data-example="polymorphic" />],
    ['AlertLink', <AlertLink as={Target} payload={payload} data-example="polymorphic" />],
    ['AlertHeading', <AlertHeading as={Target} payload={payload} data-example="polymorphic" />],
    ['Avatar', <Avatar as={Target} payload={payload} data-example="polymorphic" />],
    ['AvatarImage', <AvatarImage as={Target} payload={payload} data-example="polymorphic" />],
    ['AvatarStack', <AvatarStack as={Target} payload={payload} data-example="polymorphic" />],
    ['Badge', <Badge as={Target} payload={payload} data-example="polymorphic" />],
    ['Breadcrumb', <Breadcrumb as={Target} payload={payload} data-example="polymorphic" />],
    ['BreadcrumbItem', <BreadcrumbItem as={Target} payload={payload} data-example="polymorphic" />],
    ['BreadcrumbLink', <BreadcrumbLink as={Target} payload={payload} data-example="polymorphic" />],
    [
        'BreadcrumbDivider',
        <BreadcrumbDivider as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['ButtonGroup', <ButtonGroup as={Target} payload={payload} data-example="polymorphic" />],
    ['ButtonToolbar', <ButtonToolbar as={Target} payload={payload} data-example="polymorphic" />],
    ['Card', <Card as={Target} payload={payload} data-example="polymorphic" />],
    ['CardImage', <CardImage as={Target} payload={payload} data-example="polymorphic" />],
    ['CardSubtitle', <CardSubtitle as={Target} payload={payload} data-example="polymorphic" />],
    ['CardGroup', <CardGroup as={Target} payload={payload} data-example="polymorphic" />],
    [
        'CardImageOverlay',
        <CardImageOverlay as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['CardHeader', <CardHeader as={Target} payload={payload} data-example="polymorphic" />],
    ['CardBody', <CardBody as={Target} payload={payload} data-example="polymorphic" />],
    ['CardFooter', <CardFooter as={Target} payload={payload} data-example="polymorphic" />],
    ['CardTitle', <CardTitle as={Target} payload={payload} data-example="polymorphic" />],
    ['CardText', <CardText as={Target} payload={payload} data-example="polymorphic" />],
    ['Collapse', <Collapse as={Target} payload={payload} data-example="polymorphic" />],
    [
        'CollapseToggle',
        <CollapseToggle
            target="#polymorphic-collapse"
            as={Target}
            payload={payload}
            data-example="polymorphic"
        />
    ],
    ['Container', <Container as={Target} payload={payload} data-example="polymorphic" />],
    ['Row', <Row as={Target} payload={payload} data-example="polymorphic" />],
    ['Col', <Col as={Target} payload={payload} data-example="polymorphic" />],
    ['DialogHeader', <DialogHeader as={Target} payload={payload} data-example="polymorphic" />],
    ['DialogTitle', <DialogTitle as={Target} payload={payload} data-example="polymorphic" />],
    ['DialogBody', <DialogBody as={Target} payload={payload} data-example="polymorphic" />],
    ['DialogFooter', <DialogFooter as={Target} payload={payload} data-example="polymorphic" />],
    ['NativeDialog', <NativeDialog as={Target} payload={payload} data-example="polymorphic" />],
    ['DrawerHeader', <DrawerHeader as={Target} payload={payload} data-example="polymorphic" />],
    ['DrawerTitle', <DrawerTitle as={Target} payload={payload} data-example="polymorphic" />],
    ['DrawerBody', <DrawerBody as={Target} payload={payload} data-example="polymorphic" />],
    ['DrawerFooter', <DrawerFooter as={Target} payload={payload} data-example="polymorphic" />],
    ['Drawer', <Drawer as={Target} payload={payload} data-example="polymorphic" />],
    ['Image', <Image as={Target} payload={payload} data-example="polymorphic" />],
    ['ListGroup', <ListGroup as={Target} payload={payload} data-example="polymorphic" />],
    ['ListGroupItem', <ListGroupItem as={Target} payload={payload} data-example="polymorphic" />],
    ['MenuItem', <MenuItem as={Target} payload={payload} data-example="polymorphic" />],
    ['MenuPanel', <MenuPanel as={Target} payload={payload} data-example="polymorphic" />],
    [
        'MenuItemIcon',
        <MenuItemIcon name="check" as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['MenuItemCheck', <MenuItemCheck as={Target} payload={payload} data-example="polymorphic" />],
    ['MenuText', <MenuText as={Target} payload={payload} data-example="polymorphic" />],
    ['MenuHeader', <MenuHeader as={Target} payload={payload} data-example="polymorphic" />],
    ['MenuDivider', <MenuDivider as={Target} payload={payload} data-example="polymorphic" />],
    [
        'MenuItemContent',
        <MenuItemContent as={Target} payload={payload} data-example="polymorphic" />
    ],
    [
        'MenuItemDescription',
        <MenuItemDescription as={Target} payload={payload} data-example="polymorphic" />
    ],
    [
        'MenuSubmenu',
        <MenuSubmenu label="Submenu" as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['Menu', <Menu label="Menu" as={Target} payload={payload} data-example="polymorphic" />],
    ['Nav', <Nav as={Target} payload={payload} data-example="polymorphic" />],
    ['NavItem', <NavItem as={Target} payload={payload} data-example="polymorphic" />],
    ['NavLink', <NavLink as={Target} payload={payload} data-example="polymorphic" />],
    ['Navbar', <Navbar as={Target} payload={payload} data-example="polymorphic" />],
    ['NavbarBrand', <NavbarBrand as={Target} payload={payload} data-example="polymorphic" />],
    ['NavbarNav', <NavbarNav as={Target} payload={payload} data-example="polymorphic" />],
    ['NavbarText', <NavbarText as={Target} payload={payload} data-example="polymorphic" />],
    ['NavbarToggler', <NavbarToggler as={Target} payload={payload} data-example="polymorphic" />],
    ['Pagination', <Pagination as={Target} payload={payload} data-example="polymorphic" />],
    ['PageItem', <PageItem as={Target} payload={payload} data-example="polymorphic" />],
    ['PageLink', <PageLink as={Target} payload={payload} data-example="polymorphic" />],
    ['PageText', <PageText as={Target} payload={payload} data-example="polymorphic" />],
    ['Placeholder', <Placeholder as={Target} payload={payload} data-example="polymorphic" />],
    [
        'PlaceholderAnimation',
        <PlaceholderAnimation as={Target} payload={payload} data-example="polymorphic" />
    ],
    [
        'PlaceholderButton',
        <PlaceholderButton as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['Popover', <Popover as={Target} payload={payload} data-example="polymorphic" />],
    ['Progress', <Progress value={50} as={Target} payload={payload} data-example="polymorphic" />],
    ['ProgressStack', <ProgressStack as={Target} payload={payload} data-example="polymorphic" />],
    ['Spinner', <Spinner as={Target} payload={payload} data-example="polymorphic" />],
    [
        'SpinnerIcon',
        <SpinnerIcon name="check" as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['Stepper', <Stepper as={Target} payload={payload} data-example="polymorphic" />],
    ['StepperNav', <StepperNav as={Target} payload={payload} data-example="polymorphic" />],
    ['StepperItem', <StepperItem as={Target} payload={payload} data-example="polymorphic" />],
    ['StepperLink', <StepperLink as={Target} payload={payload} data-example="polymorphic" />],
    ['StepperButton', <StepperButton as={Target} payload={payload} data-example="polymorphic" />],
    [
        'StepperOverflow',
        <StepperOverflow as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['Table', <Table as={Target} payload={payload} data-example="polymorphic" />],
    ['ToastContainer', <ToastContainer as={Target} payload={payload} data-example="polymorphic" />],
    ['ToastItem', <ToastItem as={Target} payload={payload} data-example="polymorphic" />],
    ['ToastHeader', <ToastHeader as={Target} payload={payload} data-example="polymorphic" />],
    ['ToastBody', <ToastBody as={Target} payload={payload} data-example="polymorphic" />],
    ['ToggleButton', <ToggleButton as={Target} payload={payload} data-example="polymorphic" />],
    ['Toggler', <Toggler as={Target} payload={payload} data-example="polymorphic" />],
    ['Tooltip', <Tooltip as={Target} payload={payload} data-example="polymorphic" />],
    ['CarouselSlide', <CarouselSlide as={Target} payload={payload} data-example="polymorphic" />],
    ['Carousel', <Carousel as={Target} payload={payload} data-example="polymorphic" />],
    ['ClickBoundary', <ClickBoundary as={Target} payload={payload} data-example="polymorphic" />],
    [
        'CodeBlock',
        <CodeBlock
            children="const value = 1;"
            language="tsx"
            as={Target}
            payload={payload}
            data-example="polymorphic"
        />
    ],
    [
        'Countdown',
        <Countdown
            units={[]}
            endTime={0}
            as={Target}
            payload={payload}
            data-example="polymorphic"
        />
    ],
    ['Editor', <Editor as={Target} payload={payload} data-example="polymorphic" />],
    [
        'EditorHTML',
        <EditorHTML
            data={{ blocks: [] }}
            as={Target}
            payload={payload}
            data-example="polymorphic"
        />
    ],
    [
        'HorizontalMarquee',
        <HorizontalMarquee as={Target} payload={payload} data-example="polymorphic" />
    ],
    [
        'HorizontalMarqueeBox',
        <HorizontalMarqueeBox as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['Loading', <Loading as={Target} payload={payload} data-example="polymorphic" />],
    [
        'OverlayBox',
        <OverlayBox
            children={<button>Trigger</button>}
            title="Hint"
            as={Target}
            payload={payload}
            data-example="polymorphic"
        />
    ],
    [
        'MonthCalendar',
        <MonthCalendar value={[]} as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['PageNav', <PageNav as={Target} payload={payload} data-example="polymorphic" />],
    ['ScrollNav', <ScrollNav as={Target} payload={payload} data-example="polymorphic" />],
    ['Option', <Option as={Target} payload={payload} data-example="polymorphic" />],
    ['SpinnerButton', <SpinnerButton as={Target} payload={payload} data-example="polymorphic" />],
    [
        'TableSpinner',
        <TableSpinner colSpan={3} as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['TextTruncate', <TextTruncate as={Target} payload={payload} data-example="polymorphic" />],
    ['Time', <Time dateTime={0} as={Target} payload={payload} data-example="polymorphic" />],
    [
        'TimeDistance',
        <TimeDistance date={0} as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['Timeline', <Timeline events={[]} as={Target} payload={payload} data-example="polymorphic" />],
    [
        'TypeEcho',
        <TypeEcho text="Hello" as={Target} payload={payload} data-example="polymorphic" />
    ],
    [
        'UserRankView',
        <UserRankView
            title="Rank"
            rank={[]}
            as={Target}
            payload={payload}
            data-example="polymorphic"
        />
    ],
    [
        'VerticalMarquee',
        <VerticalMarquee as={Target} payload={payload} data-example="polymorphic" />
    ],
    [
        'ZodiacBar',
        <ZodiacBar startYear={2000} as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['Form', <Form as={Target} payload={payload} data-example="polymorphic" />],
    ['FormFieldset', <FormFieldset as={Target} payload={payload} data-example="polymorphic" />],
    ['FormField', <FormField as={Target} payload={payload} data-example="polymorphic" />],
    ['FormGroup', <FormGroup as={Target} payload={payload} data-example="polymorphic" />],
    [
        'FormFieldContent',
        <FormFieldContent as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['FormLabel', <FormLabel as={Target} payload={payload} data-example="polymorphic" />],
    ['FormLegend', <FormLegend as={Target} payload={payload} data-example="polymorphic" />],
    ['FormAdornment', <FormAdornment as={Target} payload={payload} data-example="polymorphic" />],
    [
        'FormAdornmentText',
        <FormAdornmentText as={Target} payload={payload} data-example="polymorphic" />
    ],
    [
        'FormAdornmentIcon',
        <FormAdornmentIcon name="check" as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['FormGhost', <FormGhost as={Target} payload={payload} data-example="polymorphic" />],
    ['Checkbox', <Checkbox as={Target} payload={payload} data-example="polymorphic" />],
    ['Chip', <Chip as={Target} payload={payload} data-example="polymorphic" />],
    [
        'ChipIcon',
        <ChipIcon name="check" as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['ChipImage', <ChipImage as={Target} payload={payload} data-example="polymorphic" />],
    ['ChipDismiss', <ChipDismiss as={Target} payload={payload} data-example="polymorphic" />],
    ['ChipToken', <ChipToken as={Target} payload={payload} data-example="polymorphic" />],
    ['ChipInputLabel', <ChipInputLabel as={Target} payload={payload} data-example="polymorphic" />],
    ['ChipInput', <ChipInput as={Target} payload={payload} data-example="polymorphic" />],
    [
        'ComboboxOption',
        <ComboboxOption value="option" as={Target} payload={payload} data-example="polymorphic" />
    ],
    [
        'ComboboxGroup',
        <ComboboxGroup label="Options" as={Target} payload={payload} data-example="polymorphic" />
    ],
    [
        'Combobox',
        <Combobox name="selection" as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['FormControl', <FormControl as={Target} payload={payload} data-example="polymorphic" />],
    ['FormTextArea', <FormTextArea as={Target} payload={payload} data-example="polymorphic" />],
    ['FormSelect', <FormSelect as={Target} payload={payload} data-example="polymorphic" />],
    ['DatePicker', <DatePicker as={Target} payload={payload} data-example="polymorphic" />],
    [
        'DatePickerButton',
        <DatePickerButton as={Target} payload={payload} data-example="polymorphic" />
    ],
    [
        'DatePickerInline',
        <DatePickerInline as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['FormText', <FormText as={Target} payload={payload} data-example="polymorphic" />],
    ['FormFeedback', <FormFeedback as={Target} payload={payload} data-example="polymorphic" />],
    [
        'FormFloatingLabel',
        <FormFloatingLabel as={Target} payload={payload} data-example="polymorphic" />
    ],
    ['InputGroup', <InputGroup as={Target} payload={payload} data-example="polymorphic" />],
    ['InputGroupText', <InputGroupText as={Target} payload={payload} data-example="polymorphic" />],
    [
        'InputGroupButton',
        <InputGroupButton as={Target} payload={payload} data-example="polymorphic" />
    ],
    [
        'InputGroupIgnore',
        <InputGroupIgnore
            children={<span />}
            as={Target}
            payload={payload}
            data-example="polymorphic"
        />
    ],
    ['OTPInput', <OTPInput length={4} as={Target} payload={payload} data-example="polymorphic" />],
    ['Radio', <Radio as={Target} payload={payload} data-example="polymorphic" />],
    ['FormCheck', <FormCheck as={Target} payload={payload} data-example="polymorphic" />],
    ['FormRange', <FormRange as={Target} payload={payload} data-example="polymorphic" />],
    ['FormSwitch', <FormSwitch as={Target} payload={payload} data-example="polymorphic" />],
    [
        'NavOverflow',
        <NavOverflow
            children={<span />}
            id="polymorphic-nav"
            as={Target}
            payload={payload}
            data-example="polymorphic"
        />
    ],
    [
        'ScrollSpy',
        <ScrollSpy children={<span />} as={Target} payload={payload} data-example="polymorphic" />
    ],
    [
        'Tab',
        <Tab
            id="polymorphic-tab"
            tabs={[]}
            as={Target}
            payload={payload}
            data-example="polymorphic"
        />
    ]
];

for (const [name, element] of examples)
    it(`${name} replaces its root and forwards target props`, () => {
        captures.length = 0;

        renderToStaticMarkup(element);

        const [captured] = captures;

        assert.ok(captured, `${name} did not render its selected root`);
        assert.equal(captured.payload, payload);
        assert.equal(captured['data-example'], 'polymorphic');
        assert.ok(!('as' in captured), 'as must not leak to the target');
    });
