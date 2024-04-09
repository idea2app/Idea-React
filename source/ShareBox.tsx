import html2canvas from 'html2canvas';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Component,createRef, MouseEvent, PropsWithChildren } from 'react';
import { Image } from 'react-bootstrap';
import { blobOf } from 'web-utility';

import { Loading } from './Loading';

export async function elementToImage(
    element: HTMLElement,
    type?: string,
    quality?: number
) {
    const canvas = await html2canvas(element, { useCORS: true });

    return new Promise<string>((resolve, reject) =>
        canvas.toBlob(
            blob => (blob ? resolve(URL.createObjectURL(blob)) : reject()),
            type,
            quality
        )
    );
}

export type ShareBoxProps = PropsWithChildren<ShareData>;

@observer
export class ShareBox extends Component<ShareBoxProps> {
    static displayName = 'ShareBox';

    root = createRef<HTMLDivElement>();

    @observable
    accessor loading = false;

    @observable
    accessor imageURI = '';

    componentDidMount() {
        globalThis.addEventListener?.('resize', this.generateImage);
    }

    componentWillUnmount() {
        globalThis.removeEventListener?.('resize', this.generateImage);
    }

    generateImage = async () => {
        if (this.imageURI) {
            URL.revokeObjectURL(this.imageURI);
            this.imageURI = '';
        }
        this.loading = true;
        this.imageURI = await elementToImage(this.root.current!);
        this.loading = false;
    };

    share = async (event: MouseEvent<HTMLImageElement>) => {
        event.stopPropagation();

        const image = await blobOf(this.imageURI);

        const file = new File([image], `${this.props.title}.png`, {
            type: image.type
        });
        await navigator.share?.({ files: [file], ...this.props });
    };

    render() {
        const { children } = this.props,
            { loading, imageURI } = this;

        return (
            <>
                {loading && <Loading />}

                <div
                    ref={this.root}
                    className="position-relative"
                    onMouseEnter={imageURI ? undefined : this.generateImage}
                    onTouchStart={imageURI ? undefined : this.generateImage}
                >
                    {children}

                    {imageURI && (
                        <Image
                            className="position-absolute start-0 top-0 w-100 h-100"
                            fluid
                            src={imageURI}
                            alt="Share Image"
                            onClick={this.share}
                        />
                    )}
                </div>
            </>
        );
    }
}
