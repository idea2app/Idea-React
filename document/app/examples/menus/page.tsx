import './style.less';

import { Button } from '../../../../source/Base/Button';
import { MenuDivider, MenuItem, MenuPanel } from '../../../../source/Base/Menu';
import { Icon } from '../../../../source/Extension/Icon';
import { FormControl } from '../../../../source/Form';
import { BaseLayout } from '../../../component/Document/BaseLayout';

const menuLinks = [
    { label: 'Documentation' },
    { label: 'Use cases' },
    { label: 'API status' },
    { label: 'Partners' },
    { label: 'Resources' }
] as const;

const productMenuItems = [
    { icon: 'image-fill', title: 'Main product', description: 'Take a tour through the product' },
    {
        icon: 'music-note-beamed',
        title: 'Another product',
        description: 'Explore this other product we offer'
    },
    { icon: 'question-circle', title: 'Support', description: 'Get help from our support crew' }
] as const;

const menuThemes = ['light', 'dark'] as const;
const menuItems = ['Action', 'Another action', 'Something else here'] as const;
const coloredMenuItems = [
    { label: 'Action', color: 'success' },
    { label: 'Another action', color: 'primary' },
    { label: 'Something else here', color: 'danger' },
    { label: 'Separated link', color: 'info' }
] as const;
const iconMenuItems = [
    { label: 'Documents', icon: 'files' },
    { label: 'Photos', icon: 'image-fill' },
    { label: 'Movies', icon: 'film' },
    { label: 'Music', icon: 'music-note-beamed' },
    { label: 'Games', icon: 'joystick' }
] as const;

export default function MenusPage() {
    return (
        <BaseLayout title="Menus">
            <div className="d-flex flex-column md:flex-row p-4 gap-4 md:py-5 align-items-center justify-content-center">
                {menuThemes.map(theme => (
                    <MenuPanel
                        key={theme}
                        theme={theme}
                        className="position-static d-flex p-2 mx-0 w-220px opacity-100"
                    >
                        {menuItems.map((label, index) => (
                            <MenuItem key={label} active={index === 0} href="#">
                                {label}
                            </MenuItem>
                        ))}
                        <MenuDivider />
                        <MenuItem href="#">Separated link</MenuItem>
                    </MenuPanel>
                ))}
            </div>

            <div className="b-example-divider" />

            <div className="d-flex flex-column md:flex-row p-4 gap-4 md:py-5 align-items-center justify-content-center">
                {menuThemes.map(theme => (
                    <MenuPanel
                        key={theme}
                        theme={theme}
                        className="d-block position-static mx-0 p-2 overflow-hidden w-280px opacity-100"
                    >
                        <form className="p-2 mb-2 mx--2 mt--2 bg-1 border-bottom">
                            <FormControl
                                type="search"
                                autoComplete="false"
                                placeholder="Type to filter..."
                            />
                        </form>
                        {coloredMenuItems.map(({ label, color }) => (
                            <MenuItem key={label} className="py-2" href="#">
                                <span className={`d-inline-block bg-${color} rounded-circle p-1`} />
                                {label}
                            </MenuItem>
                        ))}
                    </MenuPanel>
                ))}
            </div>

            <div className="b-example-divider" />

            <div className="d-flex flex-column md:flex-row p-4 gap-4 md:py-5 align-items-center justify-content-center">
                {menuThemes.map(theme => (
                    <MenuPanel
                        key={theme}
                        theme={theme}
                        className="d-flex position-static mx-0 w-220px opacity-100"
                    >
                        {iconMenuItems.map(({ label, icon }) => (
                            <MenuItem key={label} href="#">
                                <Icon name={icon} size={1} />
                                {label}
                            </MenuItem>
                        ))}
                        <MenuDivider />
                        <MenuItem className="theme-danger" href="#">
                            <Icon name="trash" size={1} />
                            Trash
                        </MenuItem>
                    </MenuPanel>
                ))}
            </div>

            <div className="b-example-divider" />

            <div className="d-flex flex-column md:flex-row p-4 gap-4 md:py-5 align-items-center justify-content-center">
                {menuThemes.map(theme => (
                    <MenuPanel
                        key={theme}
                        theme={theme}
                        className="position-static d-flex flex-column lg:flex-row align-items-stretch lg:align-items-center justify-content-start p-4 opacity-100"
                    >
                        <nav>
                            <ul className="list-unstyled d-flex flex-column gap-1 mb-0">
                                {productMenuItems.map(({ icon, title, description }) => (
                                    <li key={title}>
                                        <Button
                                            variant="text"
                                            theme="light"
                                            href="#"
                                            className="w-100 justify-content-start gap-3 p-3 px-4 lh-sm text-start"
                                        >
                                            <Icon name={icon} size={1.5} />
                                            <div>
                                                <strong className="d-block">{title}</strong>
                                                <small>{description}</small>
                                            </div>
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="d-none lg:d-block vr mx-4 bg-3">&nbsp;</div>
                        <hr className="lg:d-none" />
                        <div className="pe-3 py-2">
                            <nav>
                                <ul className="d-flex flex-column gap-1 list-unstyled">
                                    {menuLinks.map(({ label }) => (
                                        <li key={label}>
                                            <MenuItem href="#">{label}</MenuItem>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </MenuPanel>
                ))}
            </div>
        </BaseLayout>
    );
}
