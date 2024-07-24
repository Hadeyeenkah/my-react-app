import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import FeaturesDashboard from './FeaturesDashboard';
import AddBill from './AddBill';
import ManageBills from './ManageBills';
import ViewCategories from './ViewCategories';
import PayBills from './PayBills';
import SignUp from './SignUp';
import SignIn from './SignIn';
import HomePage from './HomePage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/features" component={FeaturesDashboard} />
        <Route path="/add-bill" component={AddBill} />
        <Route path="/manage-bills" component={ManageBills} />
        <Route path="/view-categories" component={ViewCategories} />
        <Route path="/pay-bills" component={PayBills} />
        <Route path="/signup" component={SignUp} />
        <Route path="/signin" component={SignIn} />
        <Route path="/" component={HomePage} />
        {/* Add other routes as needed */}
      </Switch>
    </Router>
  );
}

export default App;
