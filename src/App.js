import logo from "./logo.svg";
import "./App.css";
import BarChart from "./Charts/BarChart";
import LineChart from "./Charts/LineChart";
import MilestoneChart from "./Charts/MileStone";
import GanttChart from "./Charts/GanttChart";
import RetailMarketShareChart from "./Charts/MarketShareChart";

function App() {
  return (
    <div className='App'>
      <RetailMarketShareChart />
    </div>
  );
}

export default App;
