import { ComponentPropsWithoutRef, ComponentPropsWithRef, ElementType, FC, ReactNode } from 'react';

export interface AsProps<T extends ElementType = ElementType> {
    as?: T;
}

type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

type TargetProps<T, P extends object> = T extends unknown
    ? Omit<T, keyof P | 'as'> & Pick<T, Extract<RequiredKeys<T>, keyof P>>
    : never;

type ReadonlyTargetProps<T, P extends object> = T extends unknown
    ? Readonly<TargetProps<T, P>>
    : never;

type PolymorphicRef<T extends ElementType> = T extends unknown
    ? 'ref' extends keyof ComponentPropsWithRef<T>
        ? ComponentPropsWithRef<T>['ref']
        : never
    : never;

export type PolymorphicProps<T extends ElementType, P extends object = {}> = P extends unknown
    ? Omit<P, 'as' | 'ref'> &
          TargetProps<ComponentPropsWithRef<T>, P> & {
              ref?: NoInfer<PolymorphicRef<T>>;
          } & AsProps<T>
    : never;

export type PolymorphicClassProps<
    T extends ElementType | undefined,
    P extends object = {}
> = P extends unknown
    ? Readonly<Omit<P, 'as' | 'ref'> & { as?: T }> &
          NoInfer<
              [T] extends [undefined]
                  ? {}
                  : ReadonlyTargetProps<ComponentPropsWithoutRef<Exclude<T, undefined>>, P>
          >
    : never;

export interface PolymorphicComponent<P extends object> {
    <T extends ElementType | undefined>(
        props: { as: T } & ([T] extends [undefined]
            ? P
            : NoInfer<PolymorphicProps<Exclude<T, undefined>, P>>)
    ): ReactNode;
    (props: P & { as?: never }): ReactNode;
    displayName?: string;
}

// Preserve the component's identity and lifecycle; only its public call signature changes.
export const polymorphic = <P extends object>(
    component: FC<P & AsProps>
): PolymorphicComponent<P> => component as PolymorphicComponent<P>;
