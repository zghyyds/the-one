import { forwardRef } from 'react';
import type { ForwardRefRenderFunction } from 'react';
import type { IconType } from 'react-icons';

type ReactIconProps = React.HTMLAttributes<HTMLElement> & {
  icon: IconType;
};

const ReactIcon: ForwardRefRenderFunction<HTMLElement, ReactIconProps> = (
  { icon: IconType, style, ...props },
  ref
) => (
  <i {...props} style={{ display: 'inline-flex', ...style }} ref={ref}>
    <span style={{ height: 'unset', lineHeight: 'unset' }}>
      <IconType />
    </span>
  </i>
);

const ForwardedReactIcon = forwardRef(ReactIcon);

export { ForwardedReactIcon as ReactIcon };