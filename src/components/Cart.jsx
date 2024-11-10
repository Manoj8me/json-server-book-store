import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';  // Import for navigation
import "./cart.css";
function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [booksData, setBooksData] = useState([]);
  const [subtotal, setSubtotal] = useState(0);  // For storing subtotal
  const [totalQuantity, setTotalQuantity] = useState(0);  // For storing total quantity
  const navigate = useNavigate();  // Hook to navigate to different pages
  const apiUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetchCartItems();
  }, []);
  const handleLogout = () => {
    sessionStorage.clear()
    navigate("/")
  }
  const fetchCartItems = () => {
    axios.get(`${apiUrl}/orderedbooks`)
    axios.get(`http://localhost:3001/orderedbooks`)
      .then(response => {
        const orderedBooks = response.data || [];
        console.log("ordered books: ", orderedBooks);
        axios.get(`${apiUrl}/books`)
        axios.get(`http://localhost:3001/books`)
          .then(res => {
            const books = res.data;
            setBooksData(books);
            console.log("books: ", books);
            // Combine cart items with book details (locally only for display purposes)
            const combinedData = orderedBooks.map(cartItem => {
              const book = books.find(book => book.bookid === cartItem.bookid);
              if (book) {
                return {
                  ...cartItem,
                  bookname: book.bookname,
                  author: book.author,
                  imgUrl: book["img-url"],  // Adding imgUrl just for UI display
                  price: cartItem.price || book.price // Price fetched from orderedBooks or fallback to books
                };
              }
              return cartItem;
            });

            setCartItems(combinedData);
            console.log("combined cart items: ", combinedData);
            updateCartState(combinedData);  // Update subtotal and quantity
          })
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  };

  // Function to calculate subtotal and total quantity
  const updateCartState = (items) => {
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const quantity = items.reduce((acc, item) => acc + item.quantity, 0);
    setSubtotal(total);
    setTotalQuantity(quantity);


    const orderedBooks = items.map(item => ({
      bookid: item.bookid,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity // Calculate the total for each book
    }));


    // After calculating subtotal, update subtotal in the orderedbooks JSON
    items.forEach(item => {
      axios.put(`${apiUrl}/orderedbooks/${item.id}`, {
        bookid: item.bookid,
        quantity: item.quantity,
        price: item.price,  // Use the item's price, not the book's
        wtotal: item.price * item.quantity  // Calculate subtotal for each item
      })
      axios.put(`http://localhost:3001/orderedbooks/${item.id}`, {
        bookid: item.bookid,
        quantity: item.quantity,
        price: item.price,  // Use the item's price, not the book's
        wtotal: item.price * item.quantity  // Calculate subtotal for each item
      })
        .then(() => console.log('Subtotal updated for item:', item.bookid))
        .catch(err => console.error(err));
    });
  };

  const updateQuantity = (bookId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent decrementing to zero

    const cartItem = cartItems.find(item => item.bookid === bookId);
    if (cartItem) {
      axios.put(`${apiUrl}/orderedbooks/${cartItem.id}`, {
        bookid: cartItem.bookid,
        quantity: newQuantity,
        price: cartItem.price,  // Keeping only necessary fields
        // total: cartItem.price * newQuantity,
        subtotal: cartItem.price * newQuantity  // Update subtotal here
      })
      axios.put(`http://localhost:3001/orderedbooks/${cartItem.id}`, {
        bookid: cartItem.bookid,
        quantity: newQuantity,
        price: cartItem.price,  // Keeping only necessary fields
        // total: cartItem.price * newQuantity,
        subtotal: cartItem.price * newQuantity  // Update subtotal here
      })
        .then(() => {
          fetchCartItems();  // Fetch updated cart items after changing quantity
        })
        .catch(err => console.error(err));
    }
  };

  const removeItem = (bookId) => {
    const cartItem = cartItems.find(item => item.bookid === bookId);
    if (cartItem) {
      axios.delete(`${apiUrl}/orderedbooks/${cartItem.id}`)
      axios.delete(`http://localhost:3001/orderedbooks/${cartItem.id}`)
        .then(() => {
          fetchCartItems();  // Fetch updated cart after removal
        })
        .catch(err => console.error(err));
    }
  };

  // Function to handle placing the order (dummy function for now)
  const placeOrder = () => {
    alert('Order placed successfully!');
    navigate("/orderplaced");
  };

  // Handle back button to navigate to BookDisplay page
  const goBackToBookDisplay = () => {
    navigate('/home');  // Adjust the route as per your app's routing
  };

  return (
    <div className='cart-page'>
      <nav className='navbar'>
        <div className="navbar-brand">
          <Link className='logo-design'>BookParadise</Link>
        </div>
        <ul className="navbar-links8">
          <li>
            <button onClick={handleLogout} className='cart-btn'>LogOut</button>
          </li>
        </ul>
      </nav>
      <h2>Your Cart</h2>
      <div className='books-container'>
        {
          <table className='table table-bordered'>
            <thead className='bg-dark text-white'>
              <tr>
                <td>serial no</td>
                <td>book image</td>
                <td>book title</td>
                <td>book author</td>
                <td>price</td>
                <td>quantity</td>
                <td>total</td>
              </tr>
            </thead>
            <tbody>
              {
                cartItems.map((item, index) => (
                  <tr key={item.bookid}>
                    <td>{index + 1}</td>
                    <td>
                      {item.imgUrl && <img src={item.imgUrl} alt={item.bookname} className='card-img-top' />}
                      <h5>Quantity:{item.quantity}</h5>
                      <button onClick={() => updateQuantity(item.bookid, item.quantity - 1)}>-</button>
                      <button onClick={() => updateQuantity(item.bookid, item.quantity + 1)}>+</button>
                      <button onClick={() => removeItem(item.bookid)}>Remove</button>
                    </td>
                    <td>{item.bookname}</td>
                    <td>{item.author}</td>
                    <td>{item.price}</td>
                    <td>{item.quantity}</td>
                    <td>{item.quantity * item.price}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        }
        <div className='cart-summary'>
          <h4>Total Quantity: {totalQuantity}</h4>
          <h4>Subtotal: ₹{subtotal.toFixed(2)}</h4>
          <button onClick={placeOrder} className='place-order-btn'>Place Order</button>
          <button onClick={goBackToBookDisplay} className='home-btn'>Back to HomePage</button>
        </div>
      </div>
    </div>
  );
}
export default CartPage;













