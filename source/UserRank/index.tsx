import { PureComponent } from 'react';
import { Badge, Col, Image, Row, RowProps, Table } from 'react-bootstrap';

import { UserAddress, UserAddressProps } from './Address';
import * as style from './index.module.less';

export interface UserRank extends UserAddressProps {
    id: number | string;
    name: string;
    avatar?: string;
    score: number;
}

export interface UserRankViewProps extends RowProps {
    title: string;
    rank: UserRank[];
    linkOf?: (user: UserRank) => string;
}

export class UserRankView extends PureComponent<UserRankViewProps> {
    static displayName = 'UserRankView';

    renderMedal = (user: UserRank) => (
        <Col key={user.id} as="li">
            <div className={`shadow-lg overflow-hidden rounded-circle m-auto ${style.image}`}>
                <Image src={user.avatar} alt={user.name} loading="lazy" fluid />
            </div>
            <div className={`position-relative overflow-hidden ${style.topUser}`}>
                <div className="position-relative">
                    <i className="d-block overflow-hidden m-auto mb-1 rounded-circle" />
                    <a
                        className="d-block mb-0 stretched-link"
                        href={this.props.linkOf?.(user) || '#'}
                    >
                        {user.name}
                    </a>
                    <strong>{user.score}</strong>
                </div>
                <UserAddress {...user} />
            </div>
        </Col>
    );

    renderRow = (user: UserRank, index: number, { length }: UserRank[]) => (
        <tr key={user.id} className="position-relative">
            <td className="align-middle">
                <Badge className="fw-bold fst-italic">
                    {(index + 4 + '').padStart((length + '').length, '0')}
                </Badge>
            </td>
            <td className={`position-relative mw-50 text-truncate ${style.name}`}>
                <div
                    className={`d-inline-block overflow-hidden align-middle rounded-circle ${style.image}`}
                >
                    <Image src={user.avatar} alt={user.name} loading="lazy" fluid />
                </div>
                <a
                    className="ms-2 d-inline-block align-middle stretched-link"
                    style={{
                        color: `rgb(248, ${(index + 2) * 15}, ${(index + 2) * 35})`
                    }}
                    href={this.props.linkOf?.(user) || '#'}
                >
                    {user.name}
                </a>
            </td>
            <td className="align-middle">{user.score}</td>
            <td className="align-middle">
                <UserAddress {...user} />
            </td>
        </tr>
    );

    render() {
        const { className = '', title, rank = [], linkOf, ...props } = this.props;

        return (
            <Row className={`${style.rankBox} ${className}`} {...props}>
                <Col sm={12} xs={12} lg={7}>
                    <div className={`shadow rounded-3 ${style.title}`}>
                        <div className={style.medal}>
                            <i className="d-inline-block ms-1 overflow-hidden rounded-circle" />
                            <i className="d-inline-block ms-1 overflow-hidden rounded-circle" />
                            <i className="d-inline-block ms-1 overflow-hidden rounded-circle" />
                        </div>
                        <h3
                            data-text={title}
                            className="position-relative m-auto mb-0 fw-bold text-center"
                        >
                            {title}
                        </h3>
                    </div>
                    <Row
                        as="ul"
                        className={`mt-2 g-0 align-items-end text-center ps-0 pt-2 list-unstyled ${style.topUsers}`}
                    >
                        {rank.slice(0, 3).map(this.renderMedal)}
                    </Row>
                </Col>
                <Col xs={12} sm={12} lg={5}>
                    <Table className={`my-3 pt-2 ${style.restUsers}`} responsive>
                        <tbody>{rank.slice(3, 10).map(this.renderRow)}</tbody>
                    </Table>
                </Col>
            </Row>
        );
    }
}
