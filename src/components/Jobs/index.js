import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileDetailsObj: {},
    searchInput: '',
    jobsArray: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProfileApi()
    this.getJobsApi()
  }

  getProfileApi = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(profileUrl, options)
    // console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      const profileDetails = data.profile_details
      const updatedData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }

      this.setState({
        profileDetailsObj: updatedData,
        // profileError: false,
      })
    }
  }

  formattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getJobsApi = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput} = this.state
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=FULLTIME,PARTTIME&minimum_package=1000000&search=${searchInput}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsApiUrl, options)
    // console.log(response)
    if (response.ok === true) {
      const data = await response.json()
      //   console.log(data.jobs)
      const jobsArray = data.jobs.map(eachJob => this.formattedData(eachJob))
      //   console.log(jobsArray)
      this.setState({
        jobsArray,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getRetryButton = () => (
    <button type="button" className="retry-btn" onClick={this.getJobsApi}>
      Retry
    </button>
  )

  renderProfile = () => {
    const {profileDetailsObj} = this.state
    const {name, profileImageUrl, shortBio} = profileDetailsObj
    // console.log(profileDetailsObj !== {})
    if (profileDetailsObj !== {}) {
      return (
        <div className="profile-container">
          <img src={profileImageUrl} alt="profile" className="profile-img" />
          <h1>{name}</h1>
          <p>{shortBio}</p>
        </div>
      )
    }
    return <div className="retry-btn-container">{this.getRetryButton()}</div>
  }

  renderTypesOfEmployment = () => (
    <form className="form-container">
      <h1 className="sub-heading">Types of Employment</h1>
      {employmentTypesList.map(eachLabel => (
        <div key={eachLabel.employmentTypeId}>
          <input
            type="checkbox"
            id={eachLabel.employmentTypeId}
            name="options[]"
          />
          <label htmlFor={eachLabel.employmentTypeId} className="label-text">
            {eachLabel.label}
          </label>
        </div>
      ))}
    </form>
  )

  renderSalaryRange = () => (
    <form className="form-container">
      <h1 className="sub-heading">Salary Range</h1>
      {salaryRangesList.map(eachLabel => (
        <div key={eachLabel.salaryRangeId}>
          <input type="radio" id={eachLabel.salaryRangeId} />
          <label htmlFor={eachLabel.salaryRangeId} className="label-text">
            {eachLabel.label}
          </label>
        </div>
      ))}
    </form>
  )

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  renderJobBox = jobDetails => {
    const {
      id,
      companyLogoUrl,
      employmentType,
      title,
      rating,
      location,
      jobDescription,
      packagePerAnnum,
    } = jobDetails
    return (
      <div className="job-box-container">
        <Link to={`/jobs/${id}`} className="link">
          <div>
            <img src={companyLogoUrl} alt="company logo" />
            <div>
              <h1>{title}</h1>
              <p>{rating}</p>
            </div>
          </div>
          <div>
            <div>
              <p>{location}</p>
              <p>{employmentType}</p>
            </div>
            <p>{packagePerAnnum}LPA</p>
          </div>
          <ht className="line" />
          <p>Description</p>
          <p>{jobDescription}</p>
        </Link>
      </div>
    )
  }

  renderSuccessView = () => {
    const {jobsArray} = this.state
    return jobsArray.map(eachJob => this.renderJobBox(eachJob))
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      {this.getRetryButton()}
    </>
  )

  renderAllJobs = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="filters-container">
            <div className="mobile search-container">
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                onChange={this.onChangeSearchInput}
                value={searchInput}
              />
              <button
                type="button"
                className="search-button"
                data-testid="searchButton"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderProfile()}
            <hr className="line" />

            {this.renderTypesOfEmployment()}
            <hr className="line" />
            {this.renderSalaryRange()}
          </div>
          <div className="render-view">{this.renderAllJobs()}</div>
        </div>
      </>
    )
  }
}

export default Jobs
