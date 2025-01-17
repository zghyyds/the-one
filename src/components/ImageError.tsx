import { useState } from "react";
import Image from "next/image";
function ImageError({ url, alt }: { url: string,alt: string }) {
  const [newUrl, setNewUrl] = useState(url)
  const handleError = () => {
    setNewUrl("https://abs.twimg.com/favicons/twitter.ico")
  };
  return <Image
      src={newUrl}
      alt={alt}
      width={32}
      height={32}
      className="rounded-full border-2 border-white hover:border-blue-500 transition-all"
      onError={handleError}
    />
}

export default ImageError