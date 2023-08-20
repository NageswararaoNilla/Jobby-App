import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch, BsBriefcaseFill} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

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

const profileConstants = {
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
    selectedOptions: [],
    selectedSalary: '',
    profileStatus: profileConstants.initial,
  }

  componentDidMount() {
    this.getProfileApi()
    this.getJobsApi()
  }

  getProfileApi = async () => {
    this.setState({profileStatus: profileConstants.inProgress})
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
        profileStatus: profileConstants.success,
      })
    } else {
      this.setState({
        profileStatus: profileConstants.failure,
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
    const {searchInput, selectedOptions, selectedSalary} = this.state
    const employmentTypes = selectedOptions.join()
    console.log(selectedSalary)
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${employmentTypes}&minimum_package=${selectedSalary}&search=${searchInput}`
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

  //   getRetryButton = api => (
  //     <button type="button" className="retry-btn" onClick={api}>
  //       Retry
  //     </button>
  //   )

  renderProfileFailureView = () => (
    <div className="retry-btn-container">
      <button type="button" className="retry-btn" onClick={this.getProfileApi}>
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {profileDetailsObj} = this.state
    const {name, profileImageUrl, shortBio} = profileDetailsObj
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  handleOptionsChange = event => {
    const optionValue = event.target.value
    const {selectedOptions} = this.state

    if (selectedOptions.includes(optionValue)) {
      this.setState(
        {
          selectedOptions: selectedOptions.filter(
            option => option !== optionValue,
          ),
        },
        this.getJobsApi,
      )
    } else {
      this.setState(
        {
          selectedOptions: [...selectedOptions, optionValue],
        },
        this.getJobsApi,
      )
    }
    //  this.getJobsApi()
  }

  renderTypesOfEmployment = () => {
    const {selectedOptions} = this.state
    return (
      <div className="form-container">
        <h1 className="sub-heading">Type of Employment</h1>
        <ul className="employment-types-list">
          {employmentTypesList.map(eachLabel => (
            <li key={eachLabel.employmentTypeId}>
              <input
                type="checkbox"
                id={eachLabel.employmentTypeId}
                name="types"
                value={eachLabel.employmentTypeId}
                checked={selectedOptions.includes(eachLabel.employmentTypeId)}
                onChange={this.handleOptionsChange}
              />
              <label
                htmlFor={eachLabel.employmentTypeId}
                className="label-text"
              >
                {eachLabel.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  handleSalaryChange = event => {
    this.setState({selectedSalary: event.target.value}, this.getJobsApi)
  }

  renderSalaryRange = () => {
    const {selectedSalary} = this.state
    return (
      <div className="form-container">
        <h1 className="sub-heading">Salary Range</h1>
        <ul className="salary-range-list">
          {salaryRangesList.map(eachLabel => (
            <li key={eachLabel.salaryRangeId}>
              <input
                type="radio"
                id={eachLabel.salaryRangeId}
                name="salary"
                value={eachLabel.salaryRangeId}
                checked={selectedSalary === eachLabel.salaryRangeId}
                onChange={this.handleSalaryChange}
              />
              <label htmlFor={eachLabel.salaryRangeId} className="label-text">
                {eachLabel.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onChangeSearchInput = event => {
    this.setState({
      searchInput: event.target.value,
    })
  }

  renderJobBox = jobDetails => {
    // const {searchInput} = this.state
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
      <li className="job-box-container" key={id}>
        <Link to={`/jobs/${id}`} className="link">
          <div className="logo-title-container">
            <img
              src={companyLogoUrl}
              alt="company logo"
              className="company-logo"
            />
            <div>
              <h1 className="job-title">{title}</h1>
              <p className="job-rating">
                <AiFillStar className="star" />
                {rating}
              </p>
            </div>
          </div>
          <div className="location-lpa-container">
            <div className="type-container">
              <p className="location-text">
                <MdLocationOn className="location-icon" />
                {location}
              </p>
              <p className="location-text">
                <BsBriefcaseFill className="location-icon" />
                {employmentType}
              </p>
            </div>
            <p className="location-text">{packagePerAnnum}</p>
          </div>

          <hr className="line" />
          <h1 className="description-heading">Description</h1>
          <p>{jobDescription}</p>
        </Link>
      </li>
    )
  }

  renderNoJobsView = () => (
    <>
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1>No Jobs Found</h1>
      <p>We could not find any jobs. Try other filters</p>
    </>
  )

  renderSuccessView = () => {
    const {jobsArray} = this.state
    if (jobsArray.length === 0) {
      return this.renderNoJobsView()
    }
    return (
      <ul className="jobs-list">
        {jobsArray.map(eachJob => this.renderJobBox(eachJob))}
      </ul>
    )
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
      <button type="button" className="retry-btn" onClick={this.getJobsApi}>
        Retry
      </button>
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

  renderProfile = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case profileConstants.success:
        return this.renderProfileView()
      case profileConstants.inProgress:
        return this.renderLoadingView()
      case profileConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  renderSearchContainer = () => {
    const {searchInput} = this.state
    return (
      <>
        <input
          type="search"
          placeholder="Search"
          className="search-input"
          onChange={this.onChangeSearchInput}
          value={searchInput}
        />
        <button
          type="button"
          className="search-button"
          data-testid="searchButton"
          onClick={this.getJobsApi}
        >
          <BsSearch className="search-icon" />
        </button>
      </>
    )
  }

  render() {
    // const {apiStatus} = this.state
    // console.log(apiStatus)
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="responsive-container">
            <div className="filters-container">
              <div className="mobile search-container">
                {this.renderSearchContainer()}
              </div>
              {this.renderProfile()}
              <hr className="line" />
              {this.renderTypesOfEmployment()}
              <hr className="line" />
              {this.renderSalaryRange()}
            </div>
            <div className="render-view">
              <div className="desktop search-container">
                {this.renderSearchContainer()}
              </div>
              {this.renderAllJobs()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
