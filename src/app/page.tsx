"use client";
import Image from "next/image";
// import { ReactIcon } from '@/components/icon';
// import { Button } from "@nextui-org/button";
// import { BiSearch } from "react-icons/bi";
import { useEffect, useState, useCallback } from "react";
import { getTickers, getKols } from "@/api";
import NextLink from "next/link";
import { Divider } from "@nextui-org/react";
import useDebounce from "@/hooks/useDebounce";
import Loading from "@/components/Loading";
import { shortenAddress } from "@/util/formatter"
import { TokenList } from "@/types"
import toast from "react-hot-toast";

export default function Home() {
  const [kolsList, setKolsList] = useState<string[]>([]);
  const [tokenList, setTokenList] = useState<TokenList[]>([]);
  const [searchText, setSearchText] = useState<string>(""); // 搜索文本

  const [filteredKols, setFilteredKols] = useState<string[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<TokenList[]>([]);
  const [filteredTokensAddress, setFilteredFilteredTokensAddress] = useState<TokenList[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 从缓存中读取数据
    const cachedKols = localStorage.getItem("kolsList")
    const cachedTicks = localStorage.getItem("tokenList");

    if (cachedKols?.length && cachedTicks?.length) {
      // 如果缓存中有数据，直接设置
      setKolsList(JSON.parse(cachedKols));
      setTokenList(JSON.parse(cachedTicks));
      if (searchText) {
        setLoading(true)
        checkfilter(searchText, kolsList, tokenList)
      }
    } else {
      setLoading(true)
      const getTickersApi = async () => {
        const [kols, ticks] = await Promise.all([getKols(), getTickers()]);
        setKolsList(kols.tickers);

        const filterList = Array.from(new Map(ticks.tickers.map(([name, address, num]) => [address, { name, address, num }])).values())
        setTokenList(filterList)
        if (searchText) {
          checkfilter(searchText, kols.tickers, filterList)
        }
        // 缓存到 localStorage
        localStorage.setItem("kolsList", JSON.stringify(kols.tickers));
        localStorage.setItem("tokenList", JSON.stringify(filterList));
      }
      getTickersApi();
    }
  }, [searchText])





  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const checkfilter = useDebounce((text, kolList: string[], TokenList: TokenList[]) => {
    console.log(kolList, TokenList)
    const kolsFiltered = kolList.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    const tokenFiltered = TokenList.filter((item) =>
      item.name.toLowerCase().includes(text.toLowerCase()) || 
      item.address.toLowerCase().includes(text.toLowerCase())
    );

    const filteredTokensAddress2 =  TokenList.filter((item) =>
    item.address.toLowerCase().includes(text.toLowerCase())
  );
    setTimeout(() => {
      setLoading(false);
      setFilteredKols(kolsFiltered);
      setFilteredTokens(tokenFiltered);
      setFilteredFilteredTokensAddress(filteredTokensAddress2)
    }, 1000);
  }, 1000)
  // useEffect(() => {
  //   checkfilter(searchText)
  // }, [searchText])

  return (
    <div
      className="flex justify-center items-center bg-[url('/bg.png')]"
      style={{
        height: "600px",
        backgroundImage: "url('/bg.png')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        display: "flex",
      }}
    >
      <div
        className="relative h-[262px] flex-col items-center flex rounded-full border-1 border-[rgba(255,255,255,.1)]"
        style={{ width: "1160px" }}
      >
        <Image
          className="mt-10"
          src={"/title.svg"}
          width={964}
          height={192}
          alt=""
        />
        <div
          className={`top-[170px] absolute flex flex-col w-[3/4]  bg-[#292543] rounded-[40px] ${searchText}?"h-[388px]":"h-[0]" `}
          style={{ width: "70%" }}
        >
          {/* 输入框 */}
          <input
            type="text"
            placeholder="Search your interest Kol or Token"
            className="border-[#7676E0] border-1 w-full text-center py-4 text-lg text-black bg-white from-gray-800 to-gray-900 rounded-full outline-none placeholder-[#8181E5]"
            value={searchText}
            onChange={handleInputChange}
          />
          {searchText && (
            <div
              className="p-5 px-6 overflow-y-auto flex flex-col"
              style={{ height: "300px" }}
            >
              {loading ? (
                <Loading></Loading>
              ) : (
                <div className="overflow-y-auto flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <span className="text-[#ccc]">Tokens</span>
                    <div className="flex flex-col gap-2">
                      {filteredTokens.length > 0 ? (
                        filteredTokens.map((item, index) => {
                          return (
                            <NextLink
                              href={`/token/${item.name.toLowerCase()}`}
                              key={index}
                            >
                              <div className="flex gap-2 items-center">
                                {/* <Image src={"/token.svg"} width={28} height={28} alt=""></Image> */}
                                <span className="font-bold">{item.name}</span>
                                <span className="text-xs text-zinc-400 opacity-2">{shortenAddress(item.address)}</span>
                              </div>
                            </NextLink>
                          );
                        })
                      ) : (
                        <div>No results found in Kols</div>
                      )}
                    </div>
                  </div>
                  <Divider></Divider>
                  <div className="flex flex-col gap-4">
                    <span className="text-[#ccc]">Kol</span>
                    <div className="flex flex-col gap-2">
                      {filteredKols.length > 0 ? (
                        filteredKols.map((item, index) => {
                          return (
                            <NextLink href={`/detail/${item}`} key={index}>
                              <div className="flex gap-2">
                                {/* <Image src={"/kol.svg"} width={28} height={28} alt=""></Image> */}
                                <span className="font-bold">{item}</span>
                              </div>
                            </NextLink>
                          );
                        })
                      ) : (
                        <div>No results found in kol</div>
                      )}
                    </div>
                  </div>
                  {/* <Divider></Divider>
                  <div className="flex flex-col gap-4">
                    <span className="text-[#ccc]">Address</span>
                    <div className="flex flex-col gap-2">
                      {filteredTokensAddress.length > 0 ? (
                        filteredTokensAddress.map((item, index) => {
                          return (
                            <NextLink
                              href={`/token/${item.address}`}
                              key={index}
                            >
                              <div className="flex gap-2 items-center">
                                <span className="font-bold">{shortenAddress(item.address)}</span>
                              </div>
                            </NextLink>
                          );
                        })
                      ) : (
                        <div>No results found in Kols</div>
                      )}
                    </div>
                  </div> */}
                </div>
                
              )}
            </div>
          )}

          {/* <NextLink href="detail/1243" className="absolute" style={{ right: 0 }}>
          <Button className="rounded-full flex justify-center items-center" style={{ width: "56px", height: "56px", backgroundColor: "#8181E5"}}>
            <ReactIcon icon={BiSearch} style={{ fontSize: '24px' }}></ReactIcon>
          </Button>
              </NextLink>*/}
        </div>
      </div>
    </div>
  );
}
