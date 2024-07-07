import logo from '../../asset/logo.png';
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const { pathname } = location;

  const linkClass = "flex items-center justify-start py-2 px-4 text-lg font-light text-colors-white1 rounded-lg hover:text-white hover:bg-blue-700 transition-all duration-200";
  const activeLinkClass = "flex items-center justify-start py-2 px-4 text-lg font-light text-white rounded-lg bg-blue-800 transition-all duration-200";

  return (
      <div className='w-1/6 bg-blue-900 h-screen flex flex-col justify-between px-4 py-8'>
        <nav className="flex flex-col space-y-4">
          <Link to="/" className={pathname === '/' ? activeLinkClass : linkClass}>
            <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
            <span className="pl-4">Dashboard</span>
          </Link>
          <Link to="/Users" className={pathname === '/Users' ? activeLinkClass : linkClass}>
            <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span className="pl-4">Users</span>
          </Link>
          <Link to="/Tokens" className={pathname === '/Tokens' ? activeLinkClass : linkClass}>
            <svg className='w-5 h-5 border group-hover:border-white rounded-full p-0.5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            <span className="pl-4">Tokens</span>
          </Link>
          {/* <Link to="/Fees" className={pathname === '/Fees' ? activeLinkClass : linkClass}>
          <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M7 15h0M2 9.5h20" /></svg>
          <span className="pl-4">Fees</span>
        </Link> */}
          <Link to="/Admins" className={pathname === '/Admins' ? activeLinkClass : linkClass}>
            <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span className="pl-4">Admins</span>
          </Link>
          {/*<Link to="/Pending" className={pathname === '/Pending' ? activeLinkClass : linkClass}>
          <svg className='w-5 h-5' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"> <path d="M2.5 2v6h6M21.5 22v-6h-6" /><path d="M22 11.5A10 10 0 0 0 3.2 7.2M2 12.5a10 10 0 0 0 18.8 4.2" /></svg>
          <span className="pl-4">Pending txs</span>
        </Link>*/}
        </nav>
        <Link to="/" className="flex items-center justify-center mb-8">
          <img src={logo} alt="logo" className="w-16 h-16 object-cover" />
          <label className="text-2xl font-semibold text-white ml-2">DeSwap Admin</label>
        </Link>
      </div>
  );
}

export default Navbar;
