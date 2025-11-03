import {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ForwardedRef,
  MutableRefObject,
  forwardRef,
  useEffect,
  useRef,
} from "react";

export const useReducedMotion = (): boolean => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

type MotionStyle = CSSProperties | undefined;

type MotionProps<T extends ElementType> = ComponentPropsWithoutRef<T> & {
  initial?: MotionStyle;
  animate?: MotionStyle;
  whileInView?: MotionStyle;
  whileHover?: MotionStyle;
  transition?: {
    duration?: number;
    delay?: number;
  };
  viewport?: {
    once?: boolean;
    amount?: number;
  };
};

const assignRef = <T,>(ref: ForwardedRef<T>, value: T) => {
  if (!ref) {
    return;
  }

  if (typeof ref === "function") {
    ref(value);
  } else {
    (ref as MutableRefObject<T>).current = value;
  }
};

const applyStyles = (node: HTMLElement | null, styles?: MotionStyle) => {
  if (!node || !styles) {
    return;
  }

  Object.assign(node.style, styles);
};

const createMotionComponent = <T extends ElementType>(Tag: T) => {
  const MotionComponent = forwardRef<HTMLElement, MotionProps<T>>(
    (
      { initial, animate, whileInView, whileHover, transition, viewport, style, onMouseEnter, onMouseLeave, ...rest },
      ref
    ) => {
      const nodeRef = useRef<HTMLElement | null>(null);
      const reducedMotion = useReducedMotion();

      useEffect(() => {
        const node = nodeRef.current;
        if (!node) {
          return;
        }

        if (transition) {
          const duration = transition.duration ?? 0.2;
          const delay = transition.delay ?? 0;
          node.style.transition = `all ${duration}s ease ${delay}s`;
        }

        if (reducedMotion) {
          applyStyles(node, animate ?? whileInView);
          return;
        }

        if (initial) {
          applyStyles(node, initial);
          requestAnimationFrame(() => {
            applyStyles(node, animate ?? whileInView);
          });
        } else if (animate || whileInView) {
          applyStyles(node, animate ?? whileInView);
        }

        if (!whileInView) {
          return;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                applyStyles(node, whileInView);
                if (viewport?.once) {
                  observer.disconnect();
                }
              } else if (!viewport?.once && initial) {
                applyStyles(node, initial);
              }
            });
          },
          { threshold: viewport?.amount ?? 0.2 }
        );

        observer.observe(node);
        return () => observer.disconnect();
      }, [animate, initial, reducedMotion, transition, viewport, whileInView]);

      const handleMouseEnter: ComponentPropsWithoutRef<T>["onMouseEnter"] = (event) => {
        if (!reducedMotion && whileHover) {
          applyStyles(nodeRef.current, { ...(animate ?? whileInView ?? {}), ...whileHover });
        }
        onMouseEnter?.(event);
      };

      const handleMouseLeave: ComponentPropsWithoutRef<T>["onMouseLeave"] = (event) => {
        if (!reducedMotion) {
          applyStyles(nodeRef.current, animate ?? whileInView ?? initial);
        }
        onMouseLeave?.(event);
      };

      return (
        <Tag
          ref={(value: HTMLElement | null) => {
            nodeRef.current = value;
            assignRef(ref, value);
          }}
          style={style}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          {...(rest as ComponentPropsWithoutRef<T>)}
        />
      );
    }
  );

  MotionComponent.displayName = `Motion(${typeof Tag === "string" ? Tag : "Component"})`;
  return MotionComponent as unknown as (props: MotionProps<T>) => JSX.Element;
};

export const motion = {
  div: createMotionComponent("div"),
  section: createMotionComponent("section"),
  article: createMotionComponent("article"),
  header: createMotionComponent("header"),
  main: createMotionComponent("main"),
};

export type MotionValue = never;
export default motion;
