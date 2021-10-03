import './App.sass';
import DatePicker from './components/DatePicker';

const App = () => (
  <div className="App">
    <DatePicker unavailableWeekdays={[2, 5, 6]} />
  </div>
)

export default App
