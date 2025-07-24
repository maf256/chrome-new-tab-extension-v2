import Data from '../assets/Data.json'
export default function Bookmarks() {
  console.log(Data);
  
  return (
    <div className="flex gap-2 h-[100%] items-center justify-center">
      {
        Data.map((item, index) => {
          return (
            <a href={item.url} key={index} className="flex gap-2 items-center">
              <img src={item.icon} alt={item.name} className="w-7 h-7" />
            </a >
          )
        })
      }
    </div>
  )
}