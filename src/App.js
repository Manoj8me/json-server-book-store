import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BooksDisplay from "./components/BooksDisplay";
import UserRegistration from "./components/UserRegistration";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import UserLogin from "./components/UserLogin";
import Cart from "./components/Cart";
import Orderplaced from "./components/Orderplaced";
import "./common-styles.css";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <div className="common-styles">
      <ToastContainer></ToastContainer>
      <Router>
        <Routes>
          <Route path="/" element={<UserLogin></UserLogin>}></Route>
          <Route
            path="/registration"
            element={<UserRegistration></UserRegistration>}
          ></Route>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <BooksDisplay></BooksDisplay>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart></Cart>
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/orderplaced"
            element={
              <ProtectedRoute>
                <Orderplaced></Orderplaced>
              </ProtectedRoute>
            }
          ></Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
