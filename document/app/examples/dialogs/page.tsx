import { Button } from '../../../../source/Base/Button';
import { CloseButton } from '../../../../source/Base/CloseButton';
import {
    DialogBody,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    NativeDialog
} from '../../../../source/Base/NativeDialog';
import { Icon } from '../../../../source/Extension/Icon';
import { FormControl, FormFloatingLabel } from '../../../../source/Form';
import { BaseLayout } from '../../../component/Document/BaseLayout';
import styles from './style.module.less';

export default function DialogsPage() {
    return (
        <BaseLayout title="Dialogs">
            {/* Modal sheet style */}

            <div className="d-flex flex-column p-4 gap-4 md:py-5 align-items-center justify-content-center">
                <NativeDialog
                    className={`${styles['dialog-example']} rounded-4 shadow ${styles['w-340px']}`}
                    modal={false}
                    open
                >
                    <DialogHeader className="border-0">
                        <DialogTitle>Modal title</DialogTitle>
                        <CloseButton aria-label="Close" />
                    </DialogHeader>
                    <DialogBody className="pt-0">
                        <p>
                            This is a modal sheet, a variation of the modal that docs itself to the
                            bottom of the viewport like the newer share sheets in iOS.
                        </p>
                    </DialogBody>
                    <DialogFooter className="flex-column border-0 pt-0">
                        <Button variant="solid" theme="primary" className="w-100">
                            Save changes
                        </Button>
                        <Button variant="solid" theme="secondary" className="w-100">
                            Close
                        </Button>
                    </DialogFooter>
                </NativeDialog>
            </div>

            <div className="b-example-divider" />

            {/* Confirmation dialog */}

            <div className="d-flex flex-column p-4 gap-4 md:py-5 align-items-center justify-content-center">
                <NativeDialog
                    className={`${styles['dialog-example']} rounded-4 shadow ${styles['w-340px']}`}
                    modal={false}
                    open
                >
                    <DialogBody className="text-center py-4">
                        <h5 className="fw-bold mb-2">Enable this setting?</h5>
                        <p className="fg-2 mb-0">
                            You can always change your mind in your account settings.
                        </p>
                    </DialogBody>
                    <DialogFooter className="p-0 border-top">
                        <Button
                            variant="link"
                            className="fg-primary flex-fill py-3 m-0 rounded-0 border-end text-decoration-none fw-semibold"
                        >
                            Yes, enable
                        </Button>
                        <Button
                            variant="link"
                            className="fg-primary flex-fill py-3 m-0 rounded-0 text-decoration-none"
                        >
                            No thanks
                        </Button>
                    </DialogFooter>
                </NativeDialog>
            </div>

            <div className="b-example-divider" />

            {/* What's new dialog */}

            <div className="d-flex flex-column p-4 gap-4 md:py-5 align-items-center justify-content-center">
                <NativeDialog
                    className={`${styles['dialog-example']} rounded-4 shadow ${styles['w-340px']}`}
                    modal={false}
                    open
                >
                    <DialogHeader className="border-0 pt-4">
                        <DialogTitle className="fs-2xl fw-bold">What's new</DialogTitle>
                    </DialogHeader>
                    <DialogBody>
                        <ul className="list-unstyled mb-0">
                            {(
                                [
                                    {
                                        icon: 'grid-fill',
                                        color: '2',
                                        title: 'Grid view',
                                        description: 'Not into lists? Try the new grid view.'
                                    },
                                    {
                                        icon: 'bookmark-star',
                                        color: 'warning',
                                        title: 'Bookmarks',
                                        description: 'Save items you love for easy access later.'
                                    },
                                    {
                                        icon: 'film',
                                        color: 'primary',
                                        title: 'Video embeds',
                                        description: 'Share videos wherever you go.'
                                    }
                                ] as const
                            ).map(({ icon, color, title, description }, index) => (
                                <li
                                    key={title}
                                    className={`d-flex gap-3 ${index < 2 ? 'mb-3' : ''}`}
                                >
                                    <Icon
                                        name={icon}
                                        size={3}
                                        className={`fg-${color} flex-shrink-0`}
                                    />
                                    <div>
                                        <h6 className="mb-1 fw-bold">{title}</h6>
                                        <p className="mb-0 fg-2">{description}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </DialogBody>
                    <DialogFooter className="border-0 pt-3 pb-4">
                        <Button variant="solid" theme="primary" className="w-100 py-2">
                            Great, thanks!
                        </Button>
                    </DialogFooter>
                </NativeDialog>
            </div>

            <div className="b-example-divider" />

            {/* Sign up dialog */}

            <div className="d-flex flex-column p-4 gap-4 md:py-5 align-items-center justify-content-center">
                <NativeDialog
                    className={`${styles['dialog-example']} rounded-4 shadow ${styles['w-340px']}`}
                    modal={false}
                    open
                >
                    <DialogHeader className="border-0">
                        <DialogTitle className="fs-xl fw-bold">Sign up for free</DialogTitle>
                        <CloseButton aria-label="Close" />
                    </DialogHeader>
                    <DialogBody className="pt-0">
                        <form>
                            <FormFloatingLabel className="mb-3">
                                <label htmlFor="floatingEmail">Email address</label>
                                <FormControl
                                    type="email"
                                    className="rounded-3"
                                    id="floatingEmail"
                                    placeholder="name@example.com"
                                />
                            </FormFloatingLabel>
                            <FormFloatingLabel className="mb-3">
                                <label htmlFor="floatingPassword">Password</label>
                                <FormControl
                                    type="password"
                                    className="rounded-3"
                                    id="floatingPassword"
                                    placeholder="Password"
                                />
                            </FormFloatingLabel>
                            <Button
                                variant="solid"
                                theme="primary"
                                className="w-100 py-2 mb-2"
                                type="submit"
                            >
                                Sign up
                            </Button>
                            <small className="fg-2">
                                By clicking Sign up, you agree to the terms of use.
                            </small>
                            <hr className="my-4" />
                            <h6 className="fw-bold mb-3">Or use a third-party</h6>
                            {(
                                [
                                    { icon: 'google', label: 'Google', theme: 'inverse' },
                                    { icon: 'facebook', label: 'Facebook', theme: 'primary' },
                                    { icon: 'github', label: 'GitHub', theme: 'success' }
                                ] as const
                            ).map(({ icon, label, theme }, index) => (
                                <Button
                                    key={icon}
                                    variant="outline"
                                    theme={theme}
                                    className={`w-100 py-2 ${index < 2 ? 'mb-2' : ''}`}
                                >
                                    <Icon name={icon} size={1} />
                                    Sign up with {label}
                                </Button>
                            ))}
                        </form>
                    </DialogBody>
                </NativeDialog>
            </div>
        </BaseLayout>
    );
}
