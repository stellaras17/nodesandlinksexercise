import ActivityDegreeChart from './components/ActivityDegreeChart';
import ActivityNetworkChart from './components/ActivityNetworkChart';
import GanttChart from './components/GanttChart';

function App() {

  return (
    <div className='w-full flex flex-col gap-4 max-w-[800px] m-auto'>
      <GanttChart />
      <ActivityNetworkChart />
      <ActivityDegreeChart />
    </div>
  )
}

export default App
