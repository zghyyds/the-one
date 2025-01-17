"use client"
import { Chip } from "@nextui-org/chip";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Avatar, Divider } from "@nextui-org/react";
import { Image } from "@nextui-org/image";
import toast from 'react-hot-toast';
import ReactECharts from "echarts-for-react";
import { getFollowNum, getFollowList, getFollowTime, getTickerOne } from "@/api"

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation'
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";
import Loading from "@/components/Loading";
import { getColorByIndex, processHistory, mergeData } from "@/util"
import { Params, Follower, FollowTokens, ChartData, KolDetail } from "@/types"
import NextLink from "next/link";

export default function Detail() {
  const [followerList, setFollowerList] = useState<Follower[] | undefined>()
  // const [tickerName, setTickerName] = useState<string>()
  const params = useParams<Params>()
  const [followTokens, setFollowTokens] = useState<FollowTokens[]>()
  const [option, setOption] = useState({})
  const [graphData, setGraphData] = useState<{ data: any[]; links: any[] }>({
    data: [],
    links: [],
  });
  const [chartData, setChartData] = useState<ChartData[]>()
  const [Xlist, setXList] = useState<string[]>()
  const [loading, setLoading] = useState(false)
  const [loadship, setLoadShip] = useState(false)
  const [KolDetail, setKolDetail] = useState<KolDetail>()
  const [tweetsList,setTweetsList] = useState<KolDetail[]>()

  useEffect(() => {
    getFollow()
    relationship()
    getFollowToken()
  }, [params.name])

  const getFollow = async () => {
    try {
      const res = await getFollowNum(params.name)
      setFollowerList(res['following data'])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "error");
    }
  }

  const getFollowToken = async () => {
    try {
      setLoading(true)
      const res = await getFollowTime(params.name)
      setFollowTokens(res.tweets)
      setXList(res.tweets.map(time => time.pair_name_1))
      fetchAllTokens(res.tweets)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "error");
    } finally {
      setLoading(false)
    }
  }

  const fetchAllTokens = async (followTokens: FollowTokens[]) => {
    if (followTokens?.length) {
      const res = await Promise.all(
        followTokens.map(async (token) => {
          try {
            return await getTickerOne(token.pair_name_1);
          } catch (error) {
            toast.error(error instanceof Error ? error.message : "error");
            return null
          }
        })
      );
  
      // 过滤掉返回 null 的结果
      const validRes = res.filter(item => item !== null);

      const list = validRes.map((item, index) => {
        const filterTime = followTokens.filter((v) => v.pair_name_1 === item.ticker_name)[0]?.first_created_at;
        return processHistory(item.history, filterTime);
      });

      const merged = mergeData(list);
      setChartData(merged);
    }
  }

  const relationship = async () => {
    try {
      setLoadShip(true)
      const res = await getFollowList(params.name)
      setTweetsList(res.tweets)
      const _data = res.tweets.filter(v => v.Following === params.name)[0] ?? {}
      // console.log(_data);
      
      // setKolDetail(_data)

      const nodes = res.tweets

      const centerNode = {
        name: _data?.user,
        symbolSize: 30, // 设置中心点大小
        symbol: `image://${_data?.profile_image_url}`, // 可自定义样式
      };


      const formattedData = nodes.map((node: any, index: number) => ({
        name: node.user + index,
        symbolSize: node.size || 20,
        symbol: node.profile_image_url
          ? `image://${node.profile_image_url}`
          : "circle", // 如果有图片，使用图片节点
      }))
      formattedData.push(centerNode);
      // 格式化链接数据
      const formattedLinks = nodes.map((node: any, index: number) => ({
        source: centerNode.name, // 中心节点作为 source
        target: node.user + index, // 指向每个节点
        value: node.relationship || 1, // 可自定义关系值
      }));

      setGraphData({
        data: formattedData,
        links: formattedLinks,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "error");
    } finally {
      setLoadShip(false)
    }
  }

  useEffect(()=>{
    if(tweetsList?.length){
      const _data = tweetsList.filter(v => v.Following === params.name)[0] ?? {}
      console.log(_data);
      
      setKolDetail(_data)
    }
  },[tweetsList])

  useEffect(() => {
    setOption({
      series: [
        {
          type: "graph",
          layout: "force", // 使用力导向布局
          force: {
            repulsion: 50, // 节点之间的斥力
            edgeLength: [50, 150], // 边的长度范围
          },
          data: graphData.data,
          links: graphData.links,
          emphasis: {
            focus: "adjacency",
            lineStyle: {
              width: 10,
            },
          },
          label: {
            show: false,
            position: "right",
          },
          lineStyle: {
            color: "source", // 边的颜色与源节点一致
            curveness: 0.3, // 弯曲度
          },
          toolbox: {
            feature: {
              dataZoom: {
                show: true,
                yAxisIndex: "none",
              },
            },
          },
        },
      ],
    })
  }, [graphData])


  return <div className="flex flex-col gap-4">
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        <Avatar size="lg" src={KolDetail?.profile_image_url}  ></Avatar>
        {/* <Image src={KolDetail?.profile_image_url}  ></Image> */}
        <div className="flex flex-col">
          <div className="flex gap-2">
            <span className="font-bold">{KolDetail?.user}</span>
            {/* <Chip radius="sm" size="sm" style={{ backgroundColor: "#7574CB" }}>relevant tag</Chip> */}
          </div>
          <span className="text-sm">@{params.name}</span>
        </div>
      </div>
      {/* <div>
        <span className="text-[#8181E5] text-2xl pr-1 ">67,899</span>
        <span>smart followers</span>
      </div> */}
    </div>
    <Divider></Divider>
    <div className="flex gap-4 " style={{ height: "750px" }} >
      <div style={{ width: "60%" }} className="flex flex-col gap-4 h-full">
        <Card className="flex flex-col bg-[#1f1b23] p-2 px-4" style={{ backgroundColor: "#1f1b23E1" }}>
          <CardBody className="overflow-x-auto p-2">
            <span className="font-bold">Token</span>
            <div className="flex gap-3" >
              {
                followTokens?.map((token, index) =>
                  <NextLink href={`/token/${token.pair_name_1.toLowerCase()}`} key={index}>
                    <Button >
                      {token.pair_name_1}
                    </Button>
                  </NextLink>
                )
              }
            </div>
          </CardBody>
        </Card>
        <Card className="flex flex-col bg-[#1f1b23] flex-1" style={{ backgroundColor: "#1f1b23E1" }}>
          <CardBody className="p-4">
            <span className="font-bold">Price Change</span>
            {
              loading ? <Loading /> : <ResponsiveContainer width="100%" >
                <LineChart data={chartData}
                  margin={{ top: 15, right: 30, left: 20, bottom: 5 }}>
                  <Legend />
                  {
                    Xlist?.map((v, index) => {
                      return <Line type="monotone" dataKey={v} stroke={getColorByIndex(index)} dot={false} key={index} />
                    })
                  }
                  <XAxis dataKey="download_time" stroke="#8c8c8c" tick={{ fill: "#8c8c8c" }}
                    tickLine={false} />
                  <YAxis
                    stroke="#8c8c8c"
                    tick={{ fill: "#8c8c8c" }}
                    tickLine={false}
                    tickFormatter={(value) => `${value}%`} // 格式化为百分比
                  />
                  {/* <Tooltip contentStyle={{
                    backgroundColor: "#312d4c",
                    border: "1px solid #333",
                    borderRadius: "8px",
                    color: "#fff",
                  }} /> */}
                  
                  <Tooltip content={<CustomTooltip />} />
                </LineChart>
              </ResponsiveContainer>
            }
          </CardBody>
        </Card>
      </div>
      <Card style={{ width: "40%", backgroundColor: "#1f1b23E1" }} >
        <CardBody className="p-4">
          <div className="flex justify-between mb-2">
            <div className="flex flex-col gap-1">
              <span className="font-bold">Followers</span>
              <span className="text-xl text-customblue">{followerList?.[0].common_count ?? 0}</span>
              {/* <div>
              <span className="text-xs">Highest rank</span>
              <div>
                <span className="text-xl text-[#8181E5]">7,765</span>
                <span className="text-xs">(Today)</span>
              </div>
            </div> */}
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-bold">Kol Followers</span>
              <span className="text-xl text-[#8181E5]">{followerList?.[0].total_count ?? 0}</span>
            </div>
            {/* <div className="" style={{ height: "86px", width: "220px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                width={200}
                height={60}
                data={data1}
                margin={{
                  top: 5,
                  right: 0,
                  left: 0,
                  bottom: 5,
                }}
              >
                <defs>
                  <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="url(#colorClose)" />
              </AreaChart>
            </ResponsiveContainer>
          </div> */}
          </div>
          <Divider></Divider>
          <div className="w-full flex-1" style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%", // 父容器宽度
          }}>
            {/* 
          <Graph
            id="relationship-graph" // 必须是唯一值
            data={graphData}
            config={graphConfig}
            onMouseOverNode={onMouseOverNode}
          /> */}
            {
              loadship ? <Loading /> : <ReactECharts option={option} style={{ height: "100%", width: "100%" }} />
            }
          </div>
        </CardBody>
      </Card>
    </div>
  </div>
}


const CustomTooltip = ({ payload, label }: any) => {
  if (!payload || payload.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: "#312d4c",
        // border: "1px solid #333",
        borderRadius: "8px",
        color: "#fff",
        padding: "10px",
      }}
    >
      <p>{label}</p>
      {payload.map((entry: any, index: number) => {
        const value = entry.value;
        return (
          <p key={index}>
            <strong>{entry.name}:</strong> {value}%
          </p>
        );
      })}
    </div>
  );
};