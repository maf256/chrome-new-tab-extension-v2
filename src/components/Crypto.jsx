import { useEffect, useState } from "react"

export default function Crypto() {
  const [coins, setCoins] = useState([])
  useEffect(() => {
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=4&page=1&sparkline=false')
      .then(res => res.json())
      .then(data => setCoins(data))
  }, [])
  return (
    <div className="flex h-full justify-center items-center bg-white rounded-lg">

      <div className="grid grid-cols-1 gap-2 w-fit h-fit">
        {
          coins.map((item, index) => 
             (
              <div key={item.id} className="flex p-0 m-0 items-center h-fit font-bold text-lg border">
                <img src={item.image} alt={item.name} className="w-7 h-7" />
                <span>{item.name}:</span>
                <span className=""> ${item.current_price.toLocaleString()} -  </span>
                {item.price_change_percentage_24h > 0 ? 
                  <span className="text-green-500 ">{item.price_change_percentage_24h.toLocaleString()}</span> : 
                  <span className="text-red-500 ">{item.price_change_percentage_24h}</span>}
              </div>
            )
          )
        }

        
      </div>
    </div>
  )
}