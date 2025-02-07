import logo from "./logo.svg";
import "./App.css";
import BarChart from "./Charts/BarChart";
import LineChart from "./Charts/LineChart";
import MilestoneChart from "./Charts/MileStone";
import GanttChart from "./Charts/GanttChart";

function App() {
  return (
    <div className='App'>
      <BarChart />
    </div>
  );
}

export default App;
