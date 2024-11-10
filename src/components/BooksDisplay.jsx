import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import "./books-display.css";
function BooksDisplay() {
    const [booksData, setBooksData] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [filters, setFilters] = useState({
        minPrice: "0",
        maxPrice: "10000",
        author: "",
        genre: "",
    })
    const [cart, setCart] = useState([]);
    const [addedBook, setAddedBook] = useState(null);
    const genres = ["fiction", "non-fiction", "comedy", "thriller", "fantasy", "romance"];
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_API_URL;
    useEffect(() => {
        axios.get(`${apiUrl}/books`)
        axios.get(`http://localhost:3001/books`)
            .then(res => {
                setBooksData(res.data);
                setFilteredBooks(res.data);
            }).catch(err => {
                console.log(err.messgae);
            })
    }, [])
    useEffect(() => {
        updateCartState();
    }, [cart])
    const handleLogout = () => {
        sessionStorage.clear()
        navigate("/")
    }
    const handleSearch = (e) => {
        const search = e.target.value.toLowerCase();
        const filteredSearch = booksData.filter(book => book.bookname.toLowerCase().includes(search));
        setFilteredBooks(filteredSearch)
    };
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
        console.log(filters)
    };
    const applyFilters = () => {
        let filtered = booksData;
        if (parseFloat(filters.minPrice) > parseFloat(filters.maxPrice)) {
            alert("Min Price cannot be greater than Max Price.");
            return;
        }
        if (filters.minPrice) {
            filtered = filtered.filter(book => parseFloat(book.price) >= parseFloat(filters.minPrice));
        }
        if (filters.maxPrice) {
            filtered = filtered.filter(book => parseFloat(book.price) <= parseFloat(filters.maxPrice));
        }
        if (filters.author) {
            filtered = filtered.filter(book => book.author.toLowerCase().includes(filters.author.toLowerCase()));
        }
        if (filters.genre) {
            filtered = filtered.filter(book => book.genre.toLowerCase().includes(filters.genre.toLowerCase()));
        }
        setFilteredBooks(filtered);
    }
    const addToCart = (book, action = 'add') => {
        axios.get(`${apiUrl}/orderedbooks`)
        axios.get(`http://localhost:3001/orderedbooks`)
            .then(response => {
                const cartData = response.data;
                const existingBook = cartData.find(order => order.bookid === book.bookid);
                if (existingBook) {
                    // Update quantity if book already in cart
                    const newQuantity = action === 'add' ? existingBook.quantity + 1 : existingBook.quantity - 1;
                    if (newQuantity > 0) {
                        axios.put(`${apiUrl}orderedbooks/${existingBook.id}`, {
                            ...existingBook,
                            quantity: newQuantity
                        })
                        axios.put(`http://localhost:3001/orderedbooks/${existingBook.id}`, {
                            ...existingBook,
                            quantity: newQuantity
                        })
                            .then(() => {
                                setAddedBook(book);
                                updateCartState();
                            })
                            .catch(error => console.error(error));
                    } else {
                        removeBookFromCart(existingBook.id);
                    }
                } else {
                    // Add new book to cart
                    axios.post(`${apiUrl}/orderedbooks`, {
                        bookid: book.bookid,
                        quantity: 1,
                        price: book.price
                    })
                    axios.post(`http://localhost:3001/orderedbooks`, {
                        bookid: book.bookid,
                        quantity: 1,
                        price: book.price
                    })
                        .then(() => {
                            setAddedBook(book);
                            updateCartState();
                        })
                        .catch(error => console.error(error));
                }
            })
            .catch(error => console.error(error));
    };


    const removeBookFromCart = (id) => {
        axios.delete(`${apiUrl}/orderedbooks/${id}`)
        axios.delete(`http://localhost:3001/orderedbooks/${id}`)
            .then(() => {
                updateCartState();
            })
            .catch(error => console.error(error));
    };

    const updateCartState = () => {
        axios.get(`${apiUrl}/orderedbooks`)
        axios.get(`http://localhost:3001/orderedbooks`)
            .then(response => {
                setCart(response.data || []);
            })
            .catch(error => console.error(error));
    };
    const handleGoToCart = () => {
        navigate("/cart")
    }
    return (
        <div className='books-display'>
            <nav className='navbar'>
                <div className="navbar-brand">
                    <Link className='logo-design'>BookParadise</Link>
                </div>
                <div className="navbar-search8">
                    <input
                        type="text"
                        placeholder='Search for books....'
                        onChange={handleSearch} />
                </div>
                <ul className="navbar-links8">
                    <li>
                        <button onClick={handleGoToCart} className='cart-btn'>Cart({cart.length})</button>
                    </li>
                    <li>
                        <button onClick={handleLogout} className='cart-btn'>LogOut</button>
                    </li>
                </ul>
            </nav>
            <div className="d-flex">
                <div className="flex-shrink-0">
                    <h4>Filters</h4>
                    <div className="form-group mb-3">
                        <label className='form-label'>Price Range</label>
                        <input
                            type="range"
                            className="form-range"
                            min="0"
                            max="10000"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                        />
                        <input
                            type="range"
                            className="form-control"
                            min="0"
                            max="10000"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                        />
                        <div>Min: {filters.minPrice}, Max: {filters.maxPrice}</div>
                    </div>
                    <div className="form-group mb-3">
                        <label className='form-label'>Author</label>
                        <input
                            type="text"
                            className="form-control"
                            id="author"
                            name="author"
                            value={filters.author}
                            onChange={handleFilterChange}
                        />
                    </div>
                    <div className="form-group">
                        <label className='form-label'>Genre</label>
                        {
                            genres.map(genre => (
                                <div key={genre}>
                                    <input
                                        type="radio"
                                        className='app-check'
                                        name="genre"
                                        value={genre}
                                        checked={filters.genre === genre}
                                        onChange={handleFilterChange}
                                    />
                                    <label className='form-label radio-label'>{genre}</label>
                                </div>
                            ))
                        }
                    </div>
                    <button className='btn btn-primary' onClick={applyFilters}>Apply filters</button>
                </div>
                <div className='d-flex flex-wrap'>
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map(item => (
                            <div key={item.bookid}>
                                <div className="card m-5">
                                    <img src={item["img-url"]} alt={item.bookname} className='card-img-top'></img>
                                    <div className="card-body">
                                        <h5 className='card-title'>{item.bookname}</h5>
                                        <p className='card-text'>Author: {item.author}</p>
                                        <p className='card-text'>Price: {item.price}</p>

                                        {cart.some(cartItem => cartItem.bookid === item.bookid) ? (
                                            <div>
                                                <button
                                                    className='increment-decrment'
                                                    onClick={() => addToCart(item, 'remove')}
                                                >
                                                    -
                                                </button>
                                                <span className='mx-2'>
                                                    {cart.find(cartItem => cartItem.bookid === item.bookid).quantity}
                                                </span>
                                                <button
                                                    className='increment-decrment'
                                                    onClick={() => addToCart(item, 'add')}
                                                >
                                                    +
                                                </button>
                                                <button className='go-to-cart' onClick={handleGoToCart}>
                                                    Go To Cart
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className='add-cart'
                                                onClick={() => addToCart(item)}
                                            >
                                                Add to cart
                                            </button>
                                        )}

                                    </div>
                                </div>
                            </div>
                        ))
                    )
                        : (
                            <div className='no-books-found'>
                                <h3>No books found matching the criteria.</h3>
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default BooksDisplay;