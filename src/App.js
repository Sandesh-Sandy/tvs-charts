import logo from "./logo.svg";
import "./App.css";
import BarChart from "./Charts/BarChart";
import LineChart from "./Charts/LineChart";
import MilestoneChart from "./Charts/MileStone";
import GanttChart from "./Charts/GanttChart";
import RetailMarketShareChart from "./Charts/MarketShareChart";
import EmployeeExperienceChart from "./Charts/BarLineChart";

function App() {
  return (
    <div className='App'>
      <EmployeeExperienceChart />
    </div>
  );
}

export default App;
