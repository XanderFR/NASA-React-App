import { useEffect, useState } from "react"
import Footer from "./components/Footer"
import Main from "./components/Main"
import Sidebar from "./components/Sidebar"

// NOTES
/*
-Boolean variable showModal determines sidebar visibility, default value = false = hidden
-props allows for communication between components
-useEffect for working with APIs
*/

function App() {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState(false)

    function handleToggleModal() {
        setShowModal(!showModal) // Change boolean variable showModal to hold the opposite of its current value (true <=> false)
    }

    useEffect(() => {
        async function fetchAPIData() {
            const NASA_KEY = import.meta.env.VITE_NASA_API_KEY
            const url = 'https://api.nasa.gov/planetary/apod' + `?api_key=${NASA_KEY}`

            // Caching Information
            const today = (new Date()).toDateString()
            const localKey = `NASA-${today}`
            if (localStorage.getItem(localKey)) { //If key already exists
                const apiData = JSON.parse(localStorage.getItem(localKey)) // Fetch data from local storage
                setData(apiData) // Turn data into variable
                console.log('Fetched from cache today')
                return // Return out of the function
            }
            localStorage.clear() // Clear out local storage

            try {
                const response = await fetch(url) // Get the NASA pic data
                const apiData = await response.json()
                localStorage.setItem(localKey, JSON.stringify(apiData)) // Save API data to local storage
                setData(apiData) // Set apiData to data from NASA API
                console.log('Fetched from API today')
            } catch(err) {
                console.log(err.message)
            }
        }
        fetchAPIData()
    }, []) // [] = Run function when page loads

  return (
    <>
        {data ? (<Main data={data}/>) : (
            <div className="loadingState">
                <i className="fa-solid fa-gear"></i>
            </div>
        )}
        {showModal && (
            <Sidebar data={data} handleToggleModal={handleToggleModal}/>
        )}
        {data && (
        <Footer data={data} handleToggleModal={handleToggleModal}/>
        )}
    </>
  )
}

export default App
