import logo from './logo.svg';
import './App.css';
import D3BarChart from './Charts/BarChart';
import LineChart from './Charts/LineChart';
import MilestoneChart from './Charts/MileStone';
import D3GanttChart from './Charts/GanttChart';

function App() {
  return (
    <div className="App">
      
      <D3GanttChart />
    </div>
  );
}

export default App;
