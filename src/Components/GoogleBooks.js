import React, { useEffect, useState } from 'react'
import axios from 'axios'
import search from "../Images/Search.png"
import bell from "../Images/bell.png"
import diamond from "../Images/diamond.png"
import fav from "../Images/fav.png"
import user from "../Images/user.png"
import text from "../Images/KeazoNBOOKS.png"
import logo from "../Images/Logo.png"

let headerArr = [];
let colors = ["#415f71","#573f71","#733f54"]
let totalBooks = [];

const GoogleBooks = () => {

    let [landing1,setLanding1] = useState([]);
    let [landing2,setLanding2] = useState([]);
    let [searchArray,setSearchArray] = useState([]);
    let [bookClicked,setBookClicked] = useState([])
    let selectedBook = "";

    if(landing1){
        headerArr = [];
        for (let i = 0; i < 3; i++) {
            headerArr.push(landing1[i])
        }
    }

    if(landing1 && landing2){
        totalBooks = [];
        for (let i = 0; i < landing1.length; i++) {
            totalBooks.push(landing1[i])            
        }
        for (let i = 0; i < landing2.length; i++) {
            totalBooks.push(landing2[i])            
        }
    }

    useEffect(()=>{
        fetchBooks();
    },[])
    
    //Fetching books on Landing page -->
    const fetchBooks = () =>{
        axios.get('https://www.googleapis.com/books/v1/volumes?q=harry+potter')
        .then((response)=>setLanding1(response.data.items))
        .catch((error)=>console.log("Error occured ",error))

        axios.get('https://www.googleapis.com/books/v1/volumes?q=Sherlock+Holmes')
        .then((response)=>setLanding2(response.data.items))
        .catch((error)=>console.log("Error occured ",error))
    }

    // Searchbar Results -->
    function searchBook(event){
        event.preventDefault();
        let searchTerm = (event.target[0].value);
        if(searchTerm){
            axios.get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`)
            .then((response)=>{setSearchArray(response.data.items)})
            .catch((error)=>console.log("Error occured -> ", error))
        }
    }
    console.log(searchArray);


    //Getting link of clicked book -->
    function getBook(e){
        selectedBook = (e.target.getAttribute('urllink'));
        selectedBookUrl(selectedBook);
    }

    // clicked Book details --> 
    function selectedBookUrl(searchedBook){
        axios.get(searchedBook)
        .then((response)=>setBookClicked(response.data.volumeInfo))
        .catch((error)=>console.log("Error-> ",error))
    }

  return (
    <div className=''>
        <nav id='navbar'>
            <div className='left'>
                <img src={logo} alt='logo' />
                <img className='text' src={text} alt='Text' />
            </div>
            <div className='middle'>
                <form onSubmit={(event)=>searchBook(event)}>
                    <input type='search' placeholder='Search Books'/>
                    <button className='btn' type='submit'>Search</button>
                </form>
            </div>
            <div className='right'>
                <div className='asa'><img src={fav} alt="logos" /></div>
                <div className='asa'><img src={bell} alt="logos" /></div>
                <div className='asa'><img src={diamond} alt="logos" /></div>
                <div className=''><img src={user} alt="logos" /></div>
            </div>
        </nav>

        {
            totalBooks && bookClicked.title == undefined && searchArray[0] == undefined &&
            <main>
            <div className='cards-container'>
                {
                    headerArr[0]!== undefined && headerArr.map((book,index)=>(
                        <div id={index} className='card'>
                            <img src={book.volumeInfo.imageLinks.thumbnail} alt='poster'/>
                            <div className='desc'  style={{backgroundColor:colors[index]}}>
                                <h3>{book.volumeInfo.title}</h3>
                                <p>{book.volumeInfo.description}</p>
                                <div className='btn'>
                                    <button>Read Now..!</button>
                                </div>
                            </div>
                        </div>
                    ))
                }
            </div>
            <div className='more-books'>
                <h1>More Books</h1>
                <div className='books-contianer'>
                    {
                        totalBooks && totalBooks.map((book,index)=>(
                            <div id={index} key={index} className='book' onClick={(e)=>getBook(e)}>
                                <img  src={book.volumeInfo.imageLinks.thumbnail} alt='image' urllink={book.selfLink}/>
                            </div>
                        ))
                    }
                </div>
            </div>
            </main>
        }

        {
            bookClicked.title !== undefined && searchArray[0] == undefined &&
            <div className='selected-book'>
                <div className='card1'>
                    <img src={bookClicked.imageLinks.thumbnail} alt='poster'/>
                    <div className='desc1'  style={{backgroundColor:colors[0]}}>
                        <div className='heading'>
                            <h3>{bookClicked.title}</h3>
                            <b className='publish'>Published on: {bookClicked.publishedDate}</b>
                        </div>
                        <p>{bookClicked.description}</p>
                        <div className='details'>
                            <b>Avg Rating : {bookClicked.averageRating}</b>
                            <b>Rating Count : {bookClicked.ratingsCount}</b>
                            <b>Publisher : {bookClicked.publisher}</b>
                            <b>Language : {bookClicked.language}</b>
                        </div>
                        <div className='btn1'>
                            <button><a href={bookClicked.previewLink} target='_blank'>Read Now!</a></button>
                            <button><a href={bookClicked.infoLink} target='_blank'>More Info!</a></button>
                        </div>
                    </div>
                </div>
                {
                    totalBooks && 
                    <div className='books'>
                        <h1>More Books Like this</h1>
                        <div className='more-books1'>
                            <div className='books-contianer'>
                                {
                                    totalBooks && totalBooks.map((book,index)=>(
                                        <div id={index} key={index} className='book' onClick={(e)=>getBook(e)}>
                                            <a href='#'><img  src={book.volumeInfo.imageLinks.thumbnail} alt='image' urllink={book.selfLink}/></a>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                }
            </div>
        }

        {
            searchArray && 
            <div className='more-books-search'>
                <div className='books-contianer-search'>
                    {
                        searchArray && searchArray.map((book,index)=>(
                            <div id={index} key={index} className='book' onClick={(e)=>getBook(e)}>
                                <img  src={book.volumeInfo.imageLinks.thumbnail} alt='image' urllink={book.selfLink}/>
                            </div>
                        ))
                    }
                </div>
            </div>
        }
    </div>
  )
}

export default GoogleBooks