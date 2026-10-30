import { PropsWithChildren } from 'react';

import { ComponentsLayout } from '../../component/Documentation/Components/Layout';

export default function ComponentsRouteLayout({ children }: Readonly<PropsWithChildren>) {
    return <ComponentsLayout>{children}</ComponentsLayout>;
}
