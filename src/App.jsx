import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Listings from './components/Listings';
import Favorites from './components/Wishlist';
import Checkout from './components/Checkout';
import PublishListing from './components/PublishListing';
import SignInSignUp from './components/SignInSignUp';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<><HeroSection /><Listings /><Favorites /></>} />
          <Route path="/wishlist" element={<Favorites />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/publish" element={<PublishListing />} />
          <Route path="/auth" element={<SignInSignUp />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
