// import { Timestamp } from "firebase/firestore";
import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// export interface ProjectData {
//   daoName: string;
//   tokenName: string;
//   tokenTicker: string;
//   minDonation: number;
//   startTime: string;
//   period: string;
//   logoUrl: string;
//   createdAt: Timestamp;
//   totalTokens?: number;
//   fundingRaised: number;
//   mission?: string;
//   teamMembers?: Array<{
//     name: string;
//     role: string;
//     image: string;
//     credentials: string;
//   }>;
//   fundAllocation?: Array<{
//     title: string;
//     value: number;
//     color: string;
//   }>;
//   description?: string;
//   // Add other new fields as needed
// }


export type Params = {
  name: string;
};

export type Follower = {
  common_count: number,
  total_count: number
}

export type FollowTokens = {
  first_created_at: string,
  pair_name_1: string
}

export type ChartData = {
  [key in FollowTokens["pair_name_1"]]: number | string;
}


export type TokenList = {
  name: string,
  address: string,
  num: string
}

export type KolDetail = {
  FollowerNum:number,
  Following:string,
  profile_image_url:string,
  user:string
}

export interface Tweet {
  created_at: string;
  followers_count: number;
  id: number;
  impact: number;
  pair_name_1: string;
  profile_image_url: string;
  screen_name: string;
  text: string;
  tweet_id: number;
  user: string;
}

export interface PriceHistory {
  close: string;
  download_time: string;
  name: string;
  volume: string;
}