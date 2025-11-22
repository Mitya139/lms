import { cardCn, CardProps } from '@rescui/card'
import clsx from 'clsx';
import React from 'react';
import { PropsWithChildren } from 'react'

interface Props extends CardProps {
  className?: string
  href?: string
}

/**
 * Thin wrapper around the RescUI `Card` that optionally renders as a link.
 *
 * When `href` is provided the component renders as an anchor tag, otherwise
 * a plain `div` is used while preserving RescUI card styling.
 */
export default function Card(
  {
    className,
    children,
    href,
    ...cardProps
  }: PropsWithChildren<Props>,
) {
  const Tag = href ? 'a' : 'div';
  return <Tag
    className={clsx(cardCn(cardProps), className, 'resc-card')}
    href={href}
  >
    {children}
  </Tag>
}
