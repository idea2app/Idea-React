import { configure, makeObservable, observable } from 'mobx';
import { observer } from 'mobx-react';
import { PureComponent } from 'react';
import { Button, Col, Collapse, Container, Row } from 'react-bootstrap';
import { render } from 'react-dom';

import { Icon, PageNav } from '../source';
import { Content } from './content';

configure({ enforceActions: 'never' });

@observer
export class App extends PureComponent {
    constructor(props: {}) {
        super(props);
        makeObservable(this);

        this.updateMeta();
        window.addEventListener('resize', this.updateMeta);
    }

    @observable
    screenPortrait = false;

    @observable
    menuOpen = false;

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

render(<App />, document.querySelector('#app'));
