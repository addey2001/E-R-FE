
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Listings from './components/Listings';
import Wishlist from './components/Wishlist';
import Checkout from './components/Checkout';
import PublishListing from './components/PublishListing';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<><HeroSection /><Listings /></>} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/publish" element={<PublishListing />} />
      </Routes>
    </Router>
  );
}

export default App;
