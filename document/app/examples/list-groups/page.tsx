import './style.less';

import { ListGroup, ListGroupItem } from '../../../../source/Base/ListGroup';
import { Icon } from '../../../../source/Extension/Icon';
import { FormCheck } from '../../../../source/Form';
import { BaseLayout } from '../../../component/Document/BaseLayout';

const activityItems = [
    {
        title: 'List group item heading',
        text: 'Some placeholder content in a paragraph.',
        time: 'now'
    },
    {
        title: 'Another title here',
        text: 'Some placeholder content in a paragraph that goes a little longer so it wraps to a new line.',
        time: '3d'
    },
    { title: 'Third heading', text: 'Some placeholder content in a paragraph.', time: '1w' }
] as const;
const checkableItems = [
    {
        label: 'First checkbox',
        description: 'With support text underneath to add more detail',
        checked: true
    },
    { label: 'Second checkbox', description: 'Some other text goes here', checked: false },
    {
        label: 'Third checkbox',
        description: 'And we end with another snippet of text',
        checked: false
    }
] as const;
const radioItems = [
    {
        label: 'First radio',
        description: 'With support text underneath to add more detail',
        checked: true
    },
    { label: 'Second radio', description: 'Some other text goes here', checked: false },
    { label: 'Third radio', description: 'And we end with another snippet of text', checked: false }
] as const;
const taskItems = [
    {
        title: 'Finish sales report',
        icon: 'calendar-event',
        label: 'Schedule',
        detail: '1:00–2:00pm',
        checked: true
    },
    {
        title: 'Weekly All Hands',
        icon: 'calendar-event',
        label: 'Schedule',
        detail: '2:00–2:30pm',
        checked: false
    },
    { title: 'Out of office', icon: 'alarm', label: 'Reminder', detail: 'Tomorrow', checked: false }
] as const;

export default function ListGroupsPage() {
    return (
        <BaseLayout title="List groups">
            <div className="d-flex flex-column md:flex-row p-4 gap-4 md:py-5 align-items-center justify-content-center">
                <ListGroup as="div">
                    {activityItems.map(({ title, text, time }) => (
                        <ListGroupItem
                            key={title}
                            as="a"
                            href="#"
                            className="d-flex gap-3 py-3"
                            action
                            aria-current="true"
                        >
                            <img
                                className="rounded-circle flex-shrink-0"
                                width="32"
                                height="32"
                                src="https://github.com/twbs.png"
                                alt=""
                            />
                            <div className="d-flex gap-2 w-100 justify-content-between">
                                <div>
                                    <h6 className="mb-0">{title}</h6>
                                    <p className="mb-0 opacity-75">{text}</p>
                                </div>
                                <small className="opacity-50 text-nowrap">{time}</small>
                            </div>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </div>

            <div className="b-example-divider" />

            <div className="d-flex flex-column md:flex-row p-4 gap-4 md:py-5 align-items-center justify-content-center">
                <ListGroup as="div">
                    {checkableItems.map(({ label, description, checked }) => (
                        <ListGroupItem key={label} as="label" className="d-flex gap-2">
                            <FormCheck
                                type="checkbox"
                                value=""
                                className="flex-shrink-0"
                                checked={checked}
                            />
                            <span>
                                {label}
                                <small className="d-block fg-2">{description}</small>
                            </span>
                        </ListGroupItem>
                    ))}
                </ListGroup>

                <ListGroup as="div">
                    {radioItems.map(({ label, description, checked }, index) => (
                        <ListGroupItem key={label} as="label" className="d-flex gap-2">
                            <FormCheck
                                className="flex-shrink-0"
                                type="radio"
                                name="listGroupRadios"
                                id={`listGroupRadios${index + 1}`}
                                value=""
                                checked={checked}
                            />
                            <span>
                                {label}
                                <small className="d-block fg-2">{description}</small>
                            </span>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            </div>

            <div className="b-example-divider" />

            <div className="d-flex flex-column md:flex-row p-4 gap-4 md:py-5 align-items-center justify-content-center">
                <ListGroup as="div">
                    {taskItems.map(({ title, icon, label, detail, checked }) => (
                        <ListGroupItem key={title} as="label" className="d-flex gap-3">
                            <FormCheck
                                className="task-check flex-shrink-0"
                                type="checkbox"
                                value=""
                                checked={checked}
                            />
                            <span className="pt-1 form-checked-content">
                                <strong>{title}</strong>
                                <small className="d-block fg-2">
                                    <Icon
                                        name={icon}
                                        className="me-1"
                                        role="img"
                                        aria-label={label}
                                    />
                                    {detail}
                                </small>
                            </span>
                        </ListGroupItem>
                    ))}
                    <ListGroupItem as="label" className="d-flex gap-3 bg-1">
                        <FormCheck
                            className="task-check check-input-placeholder bg-1 flex-shrink-0 pe-none"
                            type="checkbox"
                            value=""
                            disabled
                        />
                        <span className="pt-1 form-checked-content">
                            <span contentEditable="true" className="w-100">
                                Add new task...
                            </span>
                            <small className="d-block fg-2">
                                <Icon name="list-check" className="me-1" />
                                <p>Choose list...</p>
                            </small>
                        </span>
                    </ListGroupItem>
                </ListGroup>
            </div>

            <div className="b-example-divider" />

            <div className="d-flex flex-column md:flex-row p-4 gap-4 md:py-5 align-items-center justify-content-center">
                <ListGroup as="div" checkable className="d-grid gap-2 border-0">
                    <FormCheck
                        listGroup
                        className="pe-none"
                        type="radio"
                        name="listGroupCheckableRadios"
                        id="listGroupCheckableRadios1"
                        value=""
                        checked
                    />
                    <ListGroupItem
                        as="label"
                        className="rounded-3 py-3"
                        htmlFor="listGroupCheckableRadios1"
                    >
                        First radio
                        <span className="d-block small opacity-50">
                            With support text underneath to add more detail
                        </span>
                    </ListGroupItem>

                    <FormCheck
                        listGroup
                        className="pe-none"
                        type="radio"
                        name="listGroupCheckableRadios"
                        id="listGroupCheckableRadios2"
                        value=""
                    />
                    <ListGroupItem
                        as="label"
                        className="rounded-3 py-3"
                        htmlFor="listGroupCheckableRadios2"
                    >
                        Second radio
                        <span className="d-block small opacity-50">Some other text goes here</span>
                    </ListGroupItem>

                    <FormCheck
                        listGroup
                        className="pe-none"
                        type="radio"
                        name="listGroupCheckableRadios"
                        id="listGroupCheckableRadios3"
                        value=""
                    />
                    <ListGroupItem
                        as="label"
                        className="rounded-3 py-3"
                        htmlFor="listGroupCheckableRadios3"
                    >
                        Third radio
                        <span className="d-block small opacity-50">
                            And we end with another snippet of text
                        </span>
                    </ListGroupItem>

                    <FormCheck
                        listGroup
                        className="pe-none"
                        type="radio"
                        name="listGroupCheckableRadios"
                        id="listGroupCheckableRadios4"
                        value=""
                        disabled
                    />
                    <ListGroupItem
                        as="label"
                        className="rounded-3 py-3"
                        htmlFor="listGroupCheckableRadios4"
                    >
                        Fourth disabled radio
                        <span className="d-block small opacity-50">This option is disabled</span>
                    </ListGroupItem>
                </ListGroup>
            </div>

            <div className="b-example-divider" />

            <div className="d-flex flex-column md:flex-row p-4 gap-4 md:py-5 align-items-center justify-content-center">
                <ListGroup as="div" radio className="d-grid gap-2 border-0">
                    <div className="position-relative">
                        <FormCheck
                            className="position-absolute top-50 end-0 me-3 fs-lg"
                            type="radio"
                            name="listGroupRadioGrid"
                            id="listGroupRadioGrid1"
                            value=""
                            checked
                        />
                        <ListGroupItem
                            as="label"
                            className="py-3 pe-5"
                            htmlFor="listGroupRadioGrid1"
                        >
                            <strong className="fw-semibold">First radio</strong>
                            <span className="d-block small opacity-75">
                                With support text underneath to add more detail
                            </span>
                        </ListGroupItem>
                    </div>

                    <div className="position-relative">
                        <FormCheck
                            className="position-absolute top-50 end-0 me-3 fs-lg"
                            type="radio"
                            name="listGroupRadioGrid"
                            id="listGroupRadioGrid2"
                            value=""
                        />
                        <ListGroupItem
                            as="label"
                            className="py-3 pe-5"
                            htmlFor="listGroupRadioGrid2"
                        >
                            <strong className="fw-semibold">Second radio</strong>
                            <span className="d-block small opacity-75">
                                Some other text goes here
                            </span>
                        </ListGroupItem>
                    </div>

                    <div className="position-relative">
                        <FormCheck
                            className="position-absolute top-50 end-0 me-3 fs-lg"
                            type="radio"
                            name="listGroupRadioGrid"
                            id="listGroupRadioGrid3"
                            value=""
                        />
                        <ListGroupItem
                            as="label"
                            className="py-3 pe-5"
                            htmlFor="listGroupRadioGrid3"
                        >
                            <strong className="fw-semibold">Third radio</strong>
                            <span className="d-block small opacity-75">
                                And we end with another snippet of text
                            </span>
                        </ListGroupItem>
                    </div>

                    <div className="position-relative">
                        <FormCheck
                            className="position-absolute top-50 end-0 me-3 fs-lg"
                            type="radio"
                            name="listGroupRadioGrid"
                            id="listGroupRadioGrid4"
                            value=""
                            disabled
                        />
                        <ListGroupItem
                            as="label"
                            className="py-3 pe-5"
                            htmlFor="listGroupRadioGrid4"
                        >
                            <strong className="fw-semibold">Fourth disabled radio</strong>
                            <span className="d-block small opacity-75">
                                This option is disabled
                            </span>
                        </ListGroupItem>
                    </div>
                </ListGroup>
            </div>
        </BaseLayout>
    );
}
