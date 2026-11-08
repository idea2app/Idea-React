import { Component, ComponentPropsWithRef, createRef, FC } from 'react';

import { Alert } from '../source/Base/Alert';
import { Button } from '../source/Base/Button';
import { Card } from '../source/Base/Card';
import { Carousel } from '../source/Base/Carousel';
import { ListGroup, ListGroupProps } from '../source/Base/ListGroup';
import { NativeDialog } from '../source/Base/NativeDialog';
import { NavLink } from '../source/Base/Nav';
import { NavbarBrand, NavbarBrandProps } from '../source/Base/Navbar';
import { Stack } from '../source/Base/Stack';
import { Toggler, TogglerProps } from '../source/Base/Toggler';
import { LiveTSX } from '../source/Extension/LiveTSX';
import { Loading } from '../source/Extension/Loading';
import { MarkdownView } from '../source/Extension/MarkdownView';
import { Nameplate } from '../source/Extension/Nameplate';
import { Select } from '../source/Extension/Select';
import { ShareBox } from '../source/Extension/ShareBox';
import { Checkbox } from '../source/Form/Checkbox';
import { FormControl } from '../source/Form/Control';
import { PasswordStrength } from '../source/Form/PasswordStrength';
import { polymorphic, PolymorphicClassProps, PolymorphicProps } from '../source/Helper/Polymorphic';
import { Col } from '../source/Layout/Grid';

interface RouterLinkProps extends Omit<ComponentPropsWithRef<'a'>, 'href'> {
    to: string;
    replace?: boolean;
}

const RouterLink: FC<RouterLinkProps> = ({ to, ...props }) => <a {...props} href={to} />;
const RequiredLink: FC<ComponentPropsWithRef<'a'> & { href: string }> = props => <a {...props} />;
const RequiredTitle: FC<ComponentPropsWithRef<'div'> & { title: string }> = props => (
    <div {...props} />
);
const VariantRoot: FC<{ kind: 'link'; to: string } | { kind: 'button'; label: string }> = props =>
    props.kind === 'link' ? <a href={props.to} /> : <button>{props.label}</button>;

class TargetClass extends Component<{ destination: string }> {
    render() {
        return <a href={this.props.destination}>Destination</a>;
    }
}

const Surface = polymorphic<ComponentPropsWithRef<'span'> & { tone?: 'warning' }>(
    ({ as: Root = 'span', tone, ...props }) => <Root {...props} data-tone={tone} />
);

export const polymorphicTypeExamples = [
    <Card ref={createRef<HTMLAnchorElement>()} as="a" href="/docs" />,
    <Card as={RouterLink} to="/docs" replace />,
    <Button as={RouterLink} to="/docs" theme="primary" />,
    <Button as={RequiredLink} href="/docs" />,
    <Button ref={createRef<HTMLAnchorElement>()} as="a" href="/docs" />,
    <Button as="div" role="button" />,
    <Loading as="section" aria-label="Loading" opacity={100} />,
    <MarkdownView ref={createRef<HTMLElement>()}># Markdown</MarkdownView>,
    <MarkdownView ref={createRef<HTMLDivElement>()} as="div">
        **Markdown**
    </MarkdownView>,
    // @ts-expect-error MarkdownView only accepts string children
    <MarkdownView>{123}</MarkdownView>,
    // @ts-expect-error the rendered HTML is owned by MarkdownView
    <MarkdownView dangerouslySetInnerHTML={{ __html: '<b>HTML</b>' }}>Markdown</MarkdownView>,
    <Col as="a" href="/docs" xs={6} />,
    <FormControl as="textarea" rows={4} />,
    <Checkbox ref={createRef<HTMLInputElement>()} as="input" />,
    <ListGroup as="ol" start={3} />,
    <NavbarBrand as={RouterLink} to="/" />,
    <Toggler as={RouterLink} to="/" value="active" />,
    <Alert as={RouterLink} to="/docs" />,
    <Alert as={RequiredTitle} title="Notice" />,
    <NativeDialog ref={createRef<NativeDialog>()} as="dialog" />,
    <Button as={NavLink} href="/docs" active />,
    <Stack as={RouterLink} to="/docs" direction="horizontal" />,
    <Card ref={createRef<TargetClass>()} as={TargetClass} destination="/docs" />,
    <Alert ref={createRef<Alert<'section'>>()} as="section" />,
    <Carousel ref={createRef<Carousel<'section'>>()} as="section" />,
    <Surface as={RouterLink} to="/docs" tone="warning" />,
    <Card as={VariantRoot} kind="link" to="/docs" />,
    <Alert as={VariantRoot} kind="button" label="Notice" />,
    // @ts-expect-error target component's required props must be present
    <Card as={RouterLink} />,
    // @ts-expect-error required overlapping target props must remain required
    <Button as={RequiredLink} />,
    // @ts-expect-error target component's own props retain their types
    <Button as={RouterLink} to={42} />,
    // @ts-expect-error selecting a root must not weaken component-specific props
    <Button as={RouterLink} to="/" theme="unknown" />,
    // @ts-expect-error default roots do not accept target-only props
    <Card href="/docs" />,
    // @ts-expect-error undefined selects the default root, not an arbitrary component
    <Card as={undefined} href="/docs" />,
    // @ts-expect-error unknown root props must not be accepted
    <Card as="a" unknownProp />,
    // @ts-expect-error target refs must match the selected root
    <Card ref={createRef<HTMLButtonElement>()} as="a" />,
    // @ts-expect-error a fragment-root component has no single root to replace
    <Nameplate as="div" avatar="avatar.png" name="Name" />,
    // @ts-expect-error a fragment-root component has no single root to replace
    <Select as="section" />,
    // @ts-expect-error a fragment-root component has no single root to replace
    <ShareBox as="section" />,
    // @ts-expect-error context-only providers with multiple roots have no single root to replace
    <LiveTSX as="section" />,
    // @ts-expect-error optional secondary text makes this a fragment-root component
    <PasswordStrength as="section" />,
    // @ts-expect-error target class props must also remain required
    <Card as={TargetClass} />,
    // @ts-expect-error required props in discriminated target unions must not disappear
    <Card as={VariantRoot} kind="link" />,
    // @ts-expect-error required discriminated target props also apply to class components
    <Alert as={VariantRoot} kind="button" />,
    // @ts-expect-error another target union branch cannot substitute for required props
    <Card as={VariantRoot} kind="link" label="Wrong branch" />,
    // @ts-expect-error arbitrary strings are not valid component or tag names
    <Card as="unknown-tag" />,
    // @ts-expect-error target component's required props also apply to class components
    <Alert as={RouterLink} />,
    // @ts-expect-error overlapping required target props also apply to class components
    <Alert as={RequiredTitle} />,
    // @ts-expect-error unknown intrinsic props also fail on class components
    <Alert as="section" href="/" />,
    // @ts-expect-error undefined must also retain a class component's default root
    <Alert as={undefined} href="/" />
];

export const mergedProps: PolymorphicProps<typeof RouterLink, { theme?: 'primary' }> = {
    as: RouterLink,
    to: '/docs',
    theme: 'primary'
};

export const legacyProps: [ListGroupProps, NavbarBrandProps, TogglerProps] = [
    { as: 'ol', start: 2 },
    { as: 'span' },
    { as: 'div' }
];

type VariantOwnProps = { mode: 'icon'; icon: string } | { mode: 'text'; text: string };

export const ownUnionProps: PolymorphicClassProps<'a', VariantOwnProps> = {
    as: 'a',
    mode: 'icon',
    icon: 'check',
    href: '/'
};

// @ts-expect-error merging target props must not collapse required component-specific union fields
export const missingOwnUnionProps: PolymorphicClassProps<'a', VariantOwnProps> = { mode: 'icon' };

export function assertReadonlyAlert(instance: Alert<typeof VariantRoot>) {
    // @ts-expect-error explicit class props declarations must retain React's readonly contract
    instance.props.className = 'changed';

    if (instance.props.kind === 'button')
        // @ts-expect-error target props must also remain readonly after narrowing a union
        instance.props.label = 'changed';
}
