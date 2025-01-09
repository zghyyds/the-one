export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "IXO Protocol: Guaranteed Protection for Token Trading",
  description:
    "IXO Protocol offers a revolutionary DeFi platform where token trading is safeguarded by guarantors, ensuring loss protection and maximizing profit opportunities for buyers and sellers.",
  og: {
    title: "IXO Protocol: Guaranteed Protection for Token Trading",
    description:
      "IXO Protocol offers a revolutionary DeFi platform where token trading is safeguarded by guarantors, ensuring loss protection and maximizing profit opportunities for buyers and sellers.",
  },
  ixoItems: [
    {
      label: "In",
      href: "/assets",
      desc: "Invest",
      className: "hover:text-active",
      activeClassName: "text-active",
      activePath: [/\/\w+\/assets/, /\/\w+\/pools/],
      descClassName: "bg-primary group-hover:opacity-100",
      descActiveClassName: "bg-primary group-hover:opacity-100",
    },
    {
      label: "X",
      href: "/x",
      desc: "Social",
      className:
        "group font-arial hover:text-black hover:drop-shadow-[0px_0px_2px_rgba(129,252,232,1)]",
      activeClassName:
        "relative text-black drop-shadow-[0px_0px_2px_rgba(129,252,232,1)]",
      descClassName: "bg-[rgba(129,252,232,1)]",
      activePath: [/\/\w+\/x/],
    },
    {
      label: "Out",
      href: "/out",
      desc: "Outcome",
      className: "hover:text-[rgb(237,110,45)]",
      activeClassName: "text-[rgb(237,110,45)]",
      descClassName: "bg-[rgb(237,110,45)]",
      activePath: [/\/\w+\/out/],
    },
  ],
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Assets",
      href: "/assets",
    },
    {
      label: "Launch Asset",
      href: "/pools/create",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "/",
    twitter: "/",
    docs: "/",
    discord: "/",
    sponsor: "/",
  },
};
