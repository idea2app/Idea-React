import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-typescript';

import { observable } from 'mobx';
import { observer } from 'mobx-react';
import {
    Component,
    ComponentProps,
    FC,
    HTMLAttributes,
    isValidElement
} from 'react';
import { Button, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import reactElementToJSXString from 'react-element-to-jsx-string';
import { LiveEditor, LiveError, LivePreview, LiveProvider } from 'react-live';

import {
    Avatar,
    CodeBlock,
    Dialog,
    DialogClose,
    Icon,
    Loading,
    MonthCalendar,
    Nameplate,
    Option,
    OverlayBox,
    PageNav,
    Select,
    ShareBox,
    SpinnerButton,
    TimeDistance,
    TypeEcho
} from '../source';

const scope = {
    Avatar,
    CodeBlock,
    Dialog,
    DialogClose,
    Icon,
    Loading,
    MonthCalendar,
    Nameplate,
    Option,
    OverlayBox,
    PageNav,
    Select,
    ShareBox,
    SpinnerButton,
    TimeDistance,
    TypeEcho,
    Button,
    OverlayTrigger,
    Popover,
    Tooltip
};

@observer
export class CodeExample extends Component<
    ComponentProps<typeof LiveProvider>
> {
    @observable
    accessor preCode = reactElementToJSXString(
        isValidElement(this.props.children) ? (
            this.props.children
        ) : (
            <>{this.props.children}</>
        )
    );

    render() {
        const { preCode } = this,
            { ...rest } = this.props;

        return (
            <LiveProvider code={preCode} scope={scope} language="tsx" {...rest}>
                <LivePreview />
                <LiveEditor />
                <LiveError />
            </LiveProvider>
        );
    }
}

export const Section: FC<HTMLAttributes<HTMLDivElement>> = ({
    className = '',
    title,
    children
}) => (
    <section className={`border bg-white mt-3 p-3 ${className}`}>
        <h2 className="h3" id={title}>
            {title}
        </h2>

        {children}
    </section>
);
