import { RefCallback } from 'react';

export function animate(name: string): RefCallback<Element> {
    return element =>
        element &&
        new IntersectionObserver(([{ isIntersecting, target }], observer) => {
            if (!isIntersecting) return;

            const classes = ['animate__animated', `animate__${name}`];

            target.classList.add(...classes);

            (target as HTMLElement).addEventListener(
                'animationend',
                () => target.classList.remove(...classes),
                { once: true }
            );
            observer.disconnect();
        }).observe(element);
}
