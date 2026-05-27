import { HugeiconsIcon } from "@hugeicons/react";
import {
  BookOpen01Icon,
  ChampionIcon,
  CrownIcon,
  Download04Icon,
  GiftIcon,
  GitForkIcon,
  GlobeIcon,
  Layers01Icon,
  Link01Icon,
  LinkSquare02Icon,
  Loading03Icon,
  MultiplicationSignIcon,
  PaintBoardIcon,
  SkullIcon,
  StarIcon as HugeStarIcon,
  Sword02Icon,
  Sword03Icon,
  Tick02Icon,
  UserAdd01Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";

type HugeIconProps = React.ComponentProps<typeof HugeiconsIcon>;
type IconProps = Omit<HugeIconProps, "icon">;

function makeIcon(displayName: string, icon: HugeIconProps["icon"]) {
  const Component = (props: IconProps) => (
    <HugeiconsIcon icon={icon} {...props} />
  );
  Component.displayName = displayName;
  return Component;
}

export const BookOpen = makeIcon("BookOpen", BookOpen01Icon);
export const Check = makeIcon("Check", Tick02Icon);
export const Crown = makeIcon("Crown", CrownIcon);
export const Download = makeIcon("Download", Download04Icon);
export const ExternalLink = makeIcon("ExternalLink", LinkSquare02Icon);
export const Gift = makeIcon("Gift", GiftIcon);
export const GitFork = makeIcon("GitFork", GitForkIcon);
export const Globe = makeIcon("Globe", GlobeIcon);
export const Layers = makeIcon("Layers", Layers01Icon);
export const Link2 = makeIcon("Link2", Link01Icon);
export const Loader2Icon = makeIcon("Loader2", Loading03Icon);
export const Palette = makeIcon("Palette", PaintBoardIcon);
export const Skull = makeIcon("Skull", SkullIcon);
export const Star = makeIcon("Star", HugeStarIcon);
export const Sword = makeIcon("Sword", Sword02Icon);
export const Swords = makeIcon("Swords", Sword03Icon);
export const Trophy = makeIcon("Trophy", ChampionIcon);
export const UserPlus = makeIcon("UserPlus", UserAdd01Icon);
export const Users = makeIcon("Users", UserGroupIcon);
export const X = makeIcon("X", MultiplicationSignIcon);
export const XIcon = X;
