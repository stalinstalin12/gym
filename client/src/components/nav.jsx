import {Link} from 'react-router-dom'
import './style.css'
export default function Nav(){
    return(
        <>
        
         <nav className='flex text-white justify-between p-3'>
            <h1 className='brandname'>Flex Fitness</h1>
                <ul className='flex font-bold gap-5 '>
                    <li className='text-white menu_link'><Link to={'/Home'} >Home</Link></li>
                    <li className='text-white menu_link'><Link to={'/Signup'} >Categories</Link></li>
                    <li className='text-white menu_link'><Link to={'/Signup'} >Contact Us</Link></li>
                </ul>
                <ul className='flex font-bold gap-3'>
                <li className='text-white menu_link'><Link to={'/Signup'} >Signup</Link></li>
                <li className='text-white menu_link'><Link to={'/Signup'} ><img src="./images/cart.png" alt="" width={25}height={25}/></Link></li>

                </ul>
            </nav>
            
        </>
    )
}