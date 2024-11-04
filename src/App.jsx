import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from './pages/LandingPage.jsx';
import CampaignPage from './pages/CampaignPage.jsx';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/campaign" element={<CampaignPage />} />
            </Routes>
        </Router>
    );
}

export default App;
