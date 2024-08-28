import { configure, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Button, Col, Collapse, Container, Row } from 'react-bootstrap';
import { createRoot } from 'react-dom/client';

import { Icon, PageNav } from '../source';
import { Content } from './content';

configure({ enforceActions: 'never' });

@observer
export class App extends PureComponent {
    constructor(props: {}) {
        super(props);

        this.updateMeta();
        window.addEventListener('resize', this.updateMeta);
    }

    @observable
    accessor screenPortrait = false;

    @observable
    accessor menuOpen = false;

    updateMeta = () =>
        (this.screenPortrait = window.innerWidth < window.innerHeight);

    renderMenu() {
        const { screenPortrait, menuOpen } = this;

        return (
            <>
                <Button
                    className="my-3 d-md-none"
                    onClick={() => (this.menuOpen = !menuOpen)}
                >
                    <Icon name="list" />
                </Button>
                <Collapse in={screenPortrait ? menuOpen : true}>
                    <PageNav
                        className="sticky-top"
                        onClick={() =>
                            screenPortrait && (this.menuOpen = false)
                        }
                    />
                </Collapse>
            </>
        );
    }

    render() {
        return (
            <div className="bg-light">
                <Container className="pb-3 py-md-5" fluid="md">
                    <Row>
                        <Col xs={12} sm={3} className="sticky-top bg-light">
                            {this.renderMenu()}
                        </Col>
                        <Col xs={12} sm={9}>
                            <Content />
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);
