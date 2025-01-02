import { InView } from '@/components/ui/in-view';
import React from 'react';

export enum InviewType {
    NORMAL,
    WITH_MARGIN,
    WITH_FADE_IN,
};

type InViewWrapperProps = {
    children: React.ReactNode;
    type: InviewType
}

export function InViewWrapper({ children, type }: InViewWrapperProps) {
    if (type === InviewType.NORMAL) {
        return (
            <InView
                variants={{
                    hidden: {
                        opacity: 0,
                        y: 30,
                        scale: 0.95,
                        filter: 'blur(4px)',
                    },
                    visible: {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: 'blur(0px)',
                    },
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                viewOptions={{ margin: '0px 0px -350px 0px' }}
            >
                {children}
            </InView>
        );
    }
    if (type === InviewType.WITH_MARGIN) {
        return (
            <InView
                variants={{
                    hidden: {
                        opacity: 0,
                        x: 100,
                    },
                    visible: {
                        opacity: 1,
                        x: 0,
                    },
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                viewOptions={{ margin: '0px 0px -350px 0px' }}
            >
                {children}
            </InView>
        )
    }
    if (type === InviewType.WITH_FADE_IN) {
        return (
            <InView
                variants={{
                    hidden: {
                        opacity: 0,
                        scale: 1.5,
                    },
                    visible: {
                        opacity: 1,
                        scale: 1,
                    },
                }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                viewOptions={{ margin: '0px 0px -350px 0px' }}
            >
                {children}
            </InView>
        );
    }
};