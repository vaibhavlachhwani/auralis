import React from "react";
import { useTimeField, useDateSegment } from "@react-aria/datepicker";
import { useLocale } from "@react-aria/i18n";
import { useTimeFieldState } from "@react-stately/datepicker";
import { createCalendar } from "@internationalized/date";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";

const segmentStyles = cva(
  "focus:outline-none focus:bg-accent focus:text-accent-foreground rounded-md p-1",
  {
    variants: {
      isPlaceholder: {
        true: "text-muted-foreground",
      },
    },
  }
);

function Segment({ segment, state }: { segment: any; state: any }) {
  let ref = React.useRef(null);
  let { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={cn(segmentStyles({ isPlaceholder: segment.isPlaceholder }))}
    >
      {segment.text}
    </div>
  );
}

const timeFieldStyles = cva(
  "inline-flex h-10 w-full flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
);

export function TimeField(props: any) {
  let { locale } = useLocale();
  let state = useTimeFieldState({
    ...props,
    locale,
    createCalendar,
  });

  let ref = React.useRef(null);
  let { labelProps, fieldProps } = useTimeField(props, state, ref);

  return (
    <div className="flex flex-col items-start">
      <label {...labelProps} className="text-sm font-medium mb-1">
        {props.label}
      </label>
      <div {...fieldProps} ref={ref} className={cn(timeFieldStyles())}>
        {state.segments.map((segment, i) => (
          <Segment key={i} segment={segment} state={state} />
        ))}
      </div>
    </div>
  );
}
