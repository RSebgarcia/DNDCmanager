import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LandingPage from './pages/LandingPage.jsx';
import CampaignPage from './pages/CampaignPage.jsx';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Container } from 'react-bootstrap';
import './app.css'

function App() {
    return (
        <Container fluid className='text-center master'>
            <DndProvider backend={HTML5Backend}>
                <Router >
                    <Routes>
                        <Route path="/DNDcmanager" element={<LandingPage />} />
                        <Route path="/DNDcmanager/campaign" element={<CampaignPage />} />
                    </Routes>
                </Router>
            </DndProvider>
        </Container>
    );
}

export default App;
