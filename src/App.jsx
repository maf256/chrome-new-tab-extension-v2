import Bookmarks from "./components/Bookmarks";
import Calendar from "./components/Calendar";
import Crypto from "./components/Crypto";
import RedditNews from "./components/TechNews";
import Weather from "./components/Weather";
import Football from "./components/Football";

function App() {
  return (
    <div className="grid grid-cols-6 gap-2 overflow-y-hidden h-screen max-w-[1920px] mx-auto bg-bg">
      <div className=" col-span-2 min-h-[50vh] ">
        <Crypto />
      </div>
      <div className=" col-span-4 min-h-[50vh]">
        <Calendar />
      </div>
      <div className="col-span-2 min-h-[40vh]">
        <Weather />
      </div>
      <div className="col-span-2 min-h-[40vh]">
        <RedditNews />
      </div>
      <div className="col-span-2 min-h-[40vh]">
        <Football />
      </div>
      <div className="col-span-6 min-h-[4vh]">
        <Bookmarks />
      </div>
    </div>
  );
}

export default App;
