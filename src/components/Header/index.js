import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const {history} = props

  const onLogout = () => {
    // const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-container">
      <div className="nav-content">
        <div>
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="header-logo"
            />
          </Link>
        </div>
        <ul className="icons-container">
          <Link to="/" className="link">
            <li>
              <AiFillHome color="white" size={20} />
            </li>
          </Link>
          <Link to="/jobs" className="link">
            <li>
              <BsBriefcaseFill color="white" size={20} />
            </li>
          </Link>
          <li>
            <button type="button" className="logout-icon" onClick={onLogout}>
              <FiLogOut color="white" size={20} />
            </button>
          </li>
        </ul>
        <div className="buttons-container">
          <div className="menu-container">
            <Link to="/" className="link">
              <p className="header-heading">Home</p>
            </Link>
            <Link to="/jobs" className="link">
              <p className="header-heading">Jobs</p>
            </Link>
          </div>
          <button type="button" className="logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default withRouter(Header)
