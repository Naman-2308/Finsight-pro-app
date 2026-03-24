declare module "lucide-react-native" {
  import { ComponentType } from "react";
  import { SvgProps } from "react-native-svg";

  export interface LucideProps extends SvgProps {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }

  export const Chrome: ComponentType<LucideProps>;
  /** Classic home icon (same underlying glyph as `Home` in lucide) */
  export const House: ComponentType<LucideProps>;
  export const Home: ComponentType<LucideProps>;
  export const PlusCircle: ComponentType<LucideProps>;
  export const ScanLine: ComponentType<LucideProps>;
  export const History: ComponentType<LucideProps>;
  export const User: ComponentType<LucideProps>;
  export const ChartPie: ComponentType<LucideProps>;
  export const Sparkles: ComponentType<LucideProps>;
  export const BarChart3: ComponentType<LucideProps>;
}