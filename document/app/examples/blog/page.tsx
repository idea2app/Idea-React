import './style.less';

import { Fragment } from 'react';

import { Button } from '../../../../source/Base/Button';
import { CardText } from '../../../../source/Base/Card';
import { NavLink } from '../../../../source/Base/Nav';
import { Table } from '../../../../source/Content/Tables';
import { Icon } from '../../../../source/Extension/Icon';
import { ScrollNav } from '../../../../source/Extension/ScrollNav';
import { Col, Container, Row } from '../../../../source/Layout/Grid';
import { BaseLayout } from '../../../component/Document/BaseLayout';
import { Placeholder as ExamplePlaceholder } from '../../../component/Examples/Placeholder';

const sampleListItems = [
    'First list item',
    'Second list item with a longer description',
    'Third list item to close it out'
] as const;

const recentPosts = [
    { title: 'Example blog post title', date: 'January 15, 2024' },
    { title: 'This is another blog post title', date: 'January 14, 2024' },
    { title: 'Longer blog post title: This one has multiple lines!', date: 'January 13, 2024' }
] as const;

const tableRows = [
    ['Alice', '10', '11'],
    ['Bob', '4', '3'],
    ['Charlie', '7', '9']
] as const;

const exampleLinks1 = [
    { label: 'March 2021' },
    { label: 'February 2021' },
    { label: 'January 2021' },
    { label: 'December 2020' },
    { label: 'November 2020' },
    { label: 'October 2020' },
    { label: 'September 2020' },
    { label: 'August 2020' },
    { label: 'July 2020' },
    { label: 'June 2020' },
    { label: 'May 2020' },
    { label: 'April 2020' }
] as const;

const blogCategories = [
    'World',
    'U.S.',
    'Technology',
    'Design',
    'Culture',
    'Business',
    'Politics',
    'Opinion',
    'Science',
    'Health',
    'Style',
    'Travel'
] as const;

export default function BlogPage() {
    return (
        <BaseLayout title="Blog Template">
            <Container>
                <header className="border-bottom lh-1 py-3">
                    <Row className="flex-nowrap justify-content-between align-items-center">
                        <Col xs={4} className="pt-1">
                            <a className="theme-secondary" href="#">
                                Subscribe
                            </a>
                        </Col>
                        <Col xs={4} className="text-center">
                            <a
                                className="blog-header-logo fg-emphasis-inverse text-decoration-none"
                                href="#"
                            >
                                Large
                            </a>
                        </Col>
                        <Col xs={4} className="d-flex justify-content-end align-items-center">
                            <a className="theme-secondary" href="#" aria-label="Search">
                                <Icon
                                    name="search"
                                    size={1.25}
                                    className="mx-3"
                                    role="img"
                                    aria-label="Search"
                                />
                            </a>
                            <Button variant="outline" theme="secondary" size="sm" href="#">
                                Sign up
                            </Button>
                        </Col>
                    </Row>
                </header>

                <ScrollNav
                    variant="underline"
                    className="py-1 mb-3 border-bottom"
                    navClassName="justify-content-between"
                >
                    {blogCategories.map((category, index) => (
                        <NavLink
                            key={category}
                            active={index === 0}
                            className="theme-inverse"
                            href="#"
                        >
                            {category}
                        </NavLink>
                    ))}
                </ScrollNav>
            </Container>

            <Container>
                <div className="p-4 md:p-5 mb-4 rounded fg-emphasis-inverse bg-2">
                    <Col lg={6} className="px-0">
                        <h1 className="fs-5xl fw-light fst-italic">
                            Title of a longer featured blog post
                        </h1>
                        <p className="fs-lg fw-light my-3">
                            Multiple lines of text that form the lede, informing new readers quickly
                            and efficiently about what’s most interesting in this post’s contents.
                        </p>
                        <p className="fs-lg fw-light mb-0">
                            <a href="#" className="fg-emphasis-inverse fw-bold">
                                Continue reading...
                            </a>
                        </p>
                    </Col>
                </div>

                <Row className="mb-2">
                    <Col md={6}>
                        <Row className="g-0 border rounded overflow-hidden md:flex-row mb-4 shadow-sm h-md-250 position-relative">
                            <Col className="p-4 d-flex flex-column position-static">
                                <strong className="d-inline-block mb-2 fg-emphasis-primary">
                                    World
                                </strong>
                                <h3 className="mb-0">Featured post</h3>
                                <div className="mb-1 fg-2">Nov 12</div>
                                <CardText className="mb-auto">
                                    This is a wider card with supporting text below as a natural
                                    lead-in to additional content.
                                </CardText>
                                <a
                                    href="#"
                                    className="icon-link gap-1 icon-link-hover stretched-link"
                                >
                                    Continue reading
                                    <Icon name="chevron-right" />
                                </a>
                            </Col>
                            <Col xs="auto" className="d-none lg:d-block">
                                <ExamplePlaceholder
                                    width="200"
                                    height="250"
                                    background="#55595c"
                                    color="#eceeef"
                                >
                                    Thumbnail
                                </ExamplePlaceholder>
                            </Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <Row className="g-0 border rounded overflow-hidden md:flex-row mb-4 shadow-sm h-md-250 position-relative">
                            <Col className="p-4 d-flex flex-column position-static">
                                <strong className="d-inline-block mb-2 fg-emphasis-success">
                                    Design
                                </strong>
                                <h3 className="mb-0">Post title</h3>
                                <div className="mb-1 fg-2">Nov 11</div>
                                <p className="mb-auto">
                                    This is a wider card with supporting text below as a natural
                                    lead-in to additional content.
                                </p>
                                <a
                                    href="#"
                                    className="icon-link gap-1 icon-link-hover stretched-link"
                                >
                                    Continue reading
                                    <Icon name="chevron-right" />
                                </a>
                            </Col>
                            <Col xs="auto" className="d-none lg:d-block">
                                <ExamplePlaceholder
                                    width="200"
                                    height="250"
                                    background="#55595c"
                                    color="#eceeef"
                                >
                                    Thumbnail
                                </ExamplePlaceholder>
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row className="g-5">
                    <Col md={8}>
                        <h3 className="pb-4 mb-4 fst-italic border-bottom">From the Firehose</h3>

                        <article className="blog-post">
                            <h2 className="fs-4xl fw-light fg-emphasis-inverse mb-1">
                                Sample blog post
                            </h2>
                            <p className="blog-post-meta">
                                January 1, 2021 by <a href="#">Mark</a>
                            </p>

                            <p>
                                This blog post shows a few different types of content that’s
                                supported and styled with Bootstrap. Basic typography, lists,
                                tables, images, code, and more are all supported as expected.
                            </p>
                            <hr />
                            <p>
                                This is some additional paragraph placeholder content. It has been
                                written to fill the available space and show how a longer snippet of
                                text affects the surrounding content. We'll repeat it often to keep
                                the demonstration flowing, so be on the lookout for this exact same
                                string of text.
                            </p>
                            <h2>Blockquotes</h2>
                            <p>This is an example blockquote in action:</p>
                            <blockquote className="blockquote">
                                <p>Quoted text goes here.</p>
                            </blockquote>
                            <p>
                                This is some additional paragraph placeholder content. It has been
                                written to fill the available space and show how a longer snippet of
                                text affects the surrounding content. We'll repeat it often to keep
                                the demonstration flowing, so be on the lookout for this exact same
                                string of text.
                            </p>
                            <h3>Example lists</h3>
                            <p>
                                This is some additional paragraph placeholder content. It's a
                                slightly shorter version of the other highly repetitive body text
                                used throughout. This is an example unordered list:
                            </p>
                            <ul>
                                {sampleListItems.map(item => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                            <p>And this is an ordered list:</p>
                            <ol>
                                {sampleListItems.map(item => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ol>
                            <p>And this is a definition list:</p>
                            <dl>
                                {(
                                    [
                                        {
                                            term: 'HyperText Markup Language (HTML)',
                                            definition:
                                                'The language used to describe and define the content of a Web page'
                                        },
                                        {
                                            term: 'Cascading Style Sheets (CSS)',
                                            definition:
                                                'Used to describe the appearance of Web content'
                                        },
                                        {
                                            term: 'JavaScript (JS)',
                                            definition:
                                                'The programming language used to build advanced Web sites and applications'
                                        }
                                    ] as const
                                ).map(({ term, definition }) => (
                                    <Fragment key={term}>
                                        <dt>{term}</dt>
                                        <dd>{definition}</dd>
                                    </Fragment>
                                ))}
                            </dl>
                            <h2>Inline HTML elements</h2>
                            <p>
                                HTML defines a long list of available inline tags, a complete list
                                of which can be found on the{' '}
                                <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element">
                                    Mozilla Developer Network
                                </a>
                                .
                            </p>
                            <ul>
                                <li>
                                    <strong>To bold text</strong>, use{' '}
                                    <code className="language-plaintext highlighter-rouge">
                                        &lt;strong&gt;
                                    </code>
                                    .
                                </li>
                                <li>
                                    <em>To italicize text</em>, use{' '}
                                    <code className="language-plaintext highlighter-rouge">
                                        &lt;em&gt;
                                    </code>
                                    .
                                </li>
                                <li>
                                    Abbreviations, like{' '}
                                    <abbr title="HyperText Markup Language">HTML</abbr> should use{' '}
                                    <code className="language-plaintext highlighter-rouge">
                                        &lt;abbr&gt;
                                    </code>
                                    , with an optional{' '}
                                    <code className="language-plaintext highlighter-rouge">
                                        title
                                    </code>{' '}
                                    attribute for the full phrase.
                                </li>
                                <li>
                                    Citations, like <cite>— Mark Otto</cite>, should use{' '}
                                    <code className="language-plaintext highlighter-rouge">
                                        &lt;cite&gt;
                                    </code>
                                    .
                                </li>
                                <li>
                                    <del>Deleted</del> text should use{' '}
                                    <code className="language-plaintext highlighter-rouge">
                                        &lt;del&gt;
                                    </code>{' '}
                                    and <ins>inserted</ins> text should use{' '}
                                    <code className="language-plaintext highlighter-rouge">
                                        &lt;ins&gt;
                                    </code>
                                    .
                                </li>
                                <li>
                                    Superscript <sup>text</sup> uses{' '}
                                    <code className="language-plaintext highlighter-rouge">
                                        &lt;sup&gt;
                                    </code>{' '}
                                    and subscript <sub>text</sub> uses{' '}
                                    <code className="language-plaintext highlighter-rouge">
                                        &lt;sub&gt;
                                    </code>
                                    .
                                </li>
                            </ul>
                            <p>
                                Most of these elements are styled by browsers with few modifications
                                on our part.
                            </p>
                            <h2>Heading</h2>
                            <p>
                                This is some additional paragraph placeholder content. It has been
                                written to fill the available space and show how a longer snippet of
                                text affects the surrounding content. We'll repeat it often to keep
                                the demonstration flowing, so be on the lookout for this exact same
                                string of text.
                            </p>
                            <h3>Sub-heading</h3>
                            <p>
                                This is some additional paragraph placeholder content. It has been
                                written to fill the available space and show how a longer snippet of
                                text affects the surrounding content. We'll repeat it often to keep
                                the demonstration flowing, so be on the lookout for this exact same
                                string of text.
                            </p>
                            <pre>
                                <code>Example code block</code>
                            </pre>
                            <p>
                                This is some additional paragraph placeholder content. It's a
                                slightly shorter version of the other highly repetitive body text
                                used throughout.
                            </p>
                        </article>

                        <article className="blog-post">
                            <h2 className="fs-4xl fw-light fg-emphasis-inverse mb-1">
                                Another blog post
                            </h2>
                            <p className="blog-post-meta">
                                December 23, 2020 by <a href="#">Jacob</a>
                            </p>

                            <p>
                                This is some additional paragraph placeholder content. It has been
                                written to fill the available space and show how a longer snippet of
                                text affects the surrounding content. We'll repeat it often to keep
                                the demonstration flowing, so be on the lookout for this exact same
                                string of text.
                            </p>
                            <blockquote>
                                <p>
                                    Longer quote goes here, maybe with some{' '}
                                    <strong>emphasized text</strong> in the middle of it.
                                </p>
                            </blockquote>
                            <p>
                                This is some additional paragraph placeholder content. It has been
                                written to fill the available space and show how a longer snippet of
                                text affects the surrounding content. We'll repeat it often to keep
                                the demonstration flowing, so be on the lookout for this exact same
                                string of text.
                            </p>
                            <h3>Example table</h3>
                            <p>And don't forget about tables in these posts:</p>
                            <Table>
                                <thead>
                                    <tr>
                                        {(['Name', 'Upvotes', 'Downvotes'] as const).map(label => (
                                            <th key={label}>{label}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {tableRows.map(row => (
                                        <tr key={row[0]}>
                                            {row.map((cell, index) => (
                                                <td key={index}>{cell}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        {(['Totals', '21', '23'] as const).map(cell => (
                                            <td key={cell}>{cell}</td>
                                        ))}
                                    </tr>
                                </tfoot>
                            </Table>

                            <p>
                                This is some additional paragraph placeholder content. It's a
                                slightly shorter version of the other highly repetitive body text
                                used throughout.
                            </p>
                        </article>

                        <article className="blog-post">
                            <h2 className="fs-4xl fw-light fg-emphasis-inverse mb-1">
                                New feature
                            </h2>
                            <p className="blog-post-meta">
                                December 14, 2020 by <a href="#">Chris</a>
                            </p>

                            <p>
                                This is some additional paragraph placeholder content. It has been
                                written to fill the available space and show how a longer snippet of
                                text affects the surrounding content. We'll repeat it often to keep
                                the demonstration flowing, so be on the lookout for this exact same
                                string of text.
                            </p>
                            <ul>
                                {sampleListItems.map(item => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                            <p>
                                This is some additional paragraph placeholder content. It's a
                                slightly shorter version of the other highly repetitive body text
                                used throughout.
                            </p>
                        </article>

                        <nav className="blog-pagination" aria-label="Pagination">
                            <Button
                                variant="outline"
                                theme="primary"
                                className="rounded-pill"
                                href="#"
                            >
                                Older
                            </Button>
                            <Button
                                variant="outline"
                                theme="secondary"
                                as="a"
                                className="rounded-pill disabled"
                                aria-disabled="true"
                            >
                                Newer
                            </Button>
                        </nav>
                    </Col>

                    <Col md={4}>
                        <div className="blog-sidebar position-sticky">
                            <div className="p-4 mb-3 bg-1 rounded">
                                <h4 className="fst-italic">About</h4>
                                <p className="mb-0">
                                    Customize this section to tell your visitors a little bit about
                                    your publication, writers, content, or something else entirely.
                                    Totally up to you.
                                </p>
                            </div>

                            <div>
                                <h4 className="fst-italic">Recent posts</h4>
                                <ul className="list-unstyled">
                                    {recentPosts.map(({ title, date }) => (
                                        <li key={title}>
                                            <a
                                                className="d-flex flex-column lg:flex-row gap-3 align-items-start lg:align-items-center py-3 theme-inverse text-decoration-none border-top"
                                                href="#"
                                            >
                                                <ExamplePlaceholder
                                                    width="100%"
                                                    height="96"
                                                    background="#777"
                                                    color="#777"
                                                />
                                                <Col lg={8}>
                                                    <h6 className="mb-0">{title}</h6>
                                                    <small className="fg-2">{date}</small>
                                                </Col>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-4">
                                <h4 className="fst-italic">Archives</h4>
                                <ol className="list-unstyled mb-0">
                                    {exampleLinks1.map(({ label }, index) => (
                                        <li key={index}>
                                            <a href="#">{label}</a>
                                        </li>
                                    ))}
                                </ol>
                            </div>

                            <div className="p-4">
                                <h4 className="fst-italic">Elsewhere</h4>
                                <ol className="list-unstyled">
                                    {(['GitHub', 'Social', 'Facebook'] as const).map(label => (
                                        <li key={label}>
                                            <a href="#">{label}</a>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>

            <footer className="py-5 text-center fg-2 bg-1">
                <p>
                    Blog template built for <a href="https://getbootstrap.com/">Bootstrap</a> by{' '}
                    <a href="https://x.com/mdo">@mdo</a>.
                </p>
                <p className="mb-0">
                    <a href="#">Back to top</a>
                </p>
            </footer>
        </BaseLayout>
    );
}
