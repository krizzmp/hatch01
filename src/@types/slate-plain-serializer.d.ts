declare module "slate-plain-serializer" {
  const t: {
    deserialize: any;
    serialize: any;
  };
  export default t;
}
declare module "slate-react" {
  import { HTMLProps } from "react";
  export const Editor: React.ComponentType<
    HTMLProps<HTMLDivElement> & {
      value: any;
      onChange: any;
      renderNode: any;
    }
  > & { blur: any; focus: any; change: any };
}
