import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiOutlineHome} from 'react-icons/ai'
import {BsBriefcase} from 'react-icons/bs'
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
        <div className="icons-container">
          <Link to="/">
            <AiOutlineHome color="white" size={20} />
          </Link>
          <Link to="/jobs">
            <BsBriefcase color="white" size={20} />
          </Link>
          <button type="button" className="logout-icon" onClick={onLogout}>
            <FiLogOut color="white" size={20} />
          </button>
        </div>
        <div className="buttons-container">
          <div className="menu-container">
            <Link to="/">
              <p className="header-heading">Home</p>
            </Link>
            <Link to="/jobs">
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
