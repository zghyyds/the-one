import { Timestamp } from "firebase/firestore";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface ProjectData {
  daoName: string;
  tokenName: string;
  tokenTicker: string;
  minDonation: number;
  startTime: string;
  period: string;
  logoUrl: string;
  createdAt: Timestamp;
  totalTokens?: number;
  fundingRaised: number;
  mission?: string;
  teamMembers?: Array<{
    name: string;
    role: string;
    image: string;
    credentials: string;
  }>;
  fundAllocation?: Array<{
    title: string;
    value: number;
    color: string;
  }>;
  description?: string;
  // Add other new fields as needed
}
