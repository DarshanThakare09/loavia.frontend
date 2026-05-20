import "react";
import type React from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      marquee: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          scrollamount?: string;
        },
        HTMLElement
      >;
    }
  }
}

