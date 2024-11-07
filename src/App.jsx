import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from './pages/LandingPage.jsx';
import CampaignPage from './pages/CampaignPage.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
    return (
        <DndProvider backend={HTML5Backend}>
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/campaign" element={<CampaignPage />} />
            </Routes>
        </Router>
        </DndProvider>
    );
}

export default App;
