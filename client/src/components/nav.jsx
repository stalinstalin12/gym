import {Link} from 'react-router-dom'
import './style.css'
import { useNavigate } from 'react-router-dom';
export default function Nav(){
    const navigate=useNavigate();
const logout=()=>{
        localStorage.removeItem("authToken");
        navigate('/Signin')
        
}

    return(
        <>
        
         <nav className='flex text-white justify-between p-3'>
            <h1 className='brandname'>Flex Fitness</h1>
                <ul className='flex font-bold gap-5 '>
                    <li className='text-white menu_link'><Link to={'/Home'} >Home</Link></li>
                    <li className='text-white menu_link'><Link to={'/Signup'} >Categories</Link></li>
                    <li className='text-white menu_link'><Link to={'/Signup'} >Contact Us</Link></li>
                    <li className='text-white menu_link'><Link to={'/addProduct'} >Sell</Link></li>

                </ul>
                <ul className='flex font-bold gap-3'>
                {/* <li className='text-white menu_link'><Link to={'/Signup'} >Signup</Link></li> */}
                <div className="relative group">
            <button className='text-white menu_link font-bold'>
            <img src="./images/profile.png" alt="" width={25}height={25}/>
            </button>
            <div className="absolute  hidden group-hover:flex flex-col bg-white text-black right-0 mt-0 p-2 rounded shadow-lg">
                <Link to={'/Signup'} className=' text-black  px-4 py-2 hover:bg-gray-200'>Signup</Link>
                <Link to={'/Signin'} className='text-black  px-4 py-2 hover:bg-gray-200'>Signin</Link>
                <button onClick={logout} className=' text-black  px-4 py-2 hover:bg-gray-200 '>Logout</button>
            </div>
        </div>
                <li className='text-white menu_link'><Link to={''} ><img src="./images/cart.png" alt="" width={25}height={25}/></Link></li>

                </ul>
            </nav>
            
        </>
    )
}