import { FC, Suspense, lazy } from 'react';

import { Loading } from '../Loading';
import type { OpenMapProps } from './core';

export type {
    CoordinateValue,
    Location,
    PossibleLocation as SearchItem,
    AddressLocation as ReverseItem
} from './model';

export type {
    LeafLetComponent,
    MapEvent,
    MarkerMeta,
    OpenMapProps
} from './core';

const Map = lazy(() => import('./core'));

export const OpenMap: FC<OpenMapProps> = props => (
    <Suspense fallback={<Loading />}>
        <Map {...props} />
    </Suspense>
);
OpenMap.displayName = 'OpenMap';
