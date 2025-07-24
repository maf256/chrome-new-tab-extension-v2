import Bookmarks from './components/Bookmarks'
import Calendar from './components/Calendar'

function App() {

  return (
    <div className="grid grid-cols-6 gap-2 overflow-y-hidden h-screen">
      <div className="bg-red-500 col-span-2 min-h-[50vh] ">Item 1</div>
      <div className="bg-red-500 col-span-4 min-h-[50vh]"><Calendar /></div>
      <div className="bg-red-500 col-span-2 min-h-[40vh]">Item 3</div>
      <div className="bg-red-500 col-span-2 min-h-[40vh]">Item 4</div>
      <div className="bg-red-500 col-span-2 min-h-[40vh]">Item 5</div>
      <div className="col-span-6 min-h-[4vh]"><Bookmarks/></div>


      {/* <Calendar />
      <Calendar />
      <Calendar /> */}
    </div>
  )
}

export default App
