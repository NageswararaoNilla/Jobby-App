import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsBriefcaseFill} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {FiExternalLink} from 'react-icons/fi'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  inProgress: 'IN_PROGRESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetailsApi()
  }

  formattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    lifeAtCompanyDescription: data.life_at_company.description,
    lifeAtCompanyImageUrl: data.life_at_company.image_url,
    jobDescription: data.job_description,
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
    skills: data.skills.map(eachSkill => ({
      name: eachSkill.name,
      imageUrl: eachSkill.image_url,
    })),
  })

  getJobDetailsApi = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const jobsApiUrl = `https://apis.ccbp.in/jobs/${id}`
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
      console.log(data)
      const jobObj = this.formattedData(data.job_details)
      const similarJobsObj = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      //   console.log(jobsArray)
      this.setState({
        jobDetails: jobObj,
        similarJobs: similarJobsObj,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderJobDetails = () => {
    const {jobDetails} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      title,
      rating,
      location,
      jobDescription,
      packagePerAnnum,
      skills,
      lifeAtCompanyDescription,
      lifeAtCompanyImageUrl,
    } = jobDetails
    return (
      <div className="job-box-container">
        <div className="logo-title-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
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
        <hr className="line-job" />
        <div className="description-link-container">
          <h1 className="sub-heading">Description</h1>
          <a
            href={companyWebsiteUrl}
            target="_blank"
            rel="noreferrer"
            className="visit-link"
          >
            Visit
            <FiExternalLink className="link-icon" />
          </a>
        </div>

        <p>{jobDescription}</p>
        <h1 className="sub-heading">Skills</h1>
        <ul className="skills-container">
          {skills.map(eachSkill => (
            <li key={eachSkill.name} className="skill-container">
              <img
                src={eachSkill.imageUrl}
                alt={eachSkill.name}
                className="skill-img"
              />
              <p className="skill-name">{eachSkill.name}</p>
            </li>
          ))}
        </ul>
        <h1 className="sub-heading">Life at Company</h1>
        <div className="company-description-img-container">
          <p>{lifeAtCompanyDescription}</p>
          <img
            src={lifeAtCompanyImageUrl}
            // aria-hidden
            alt="life at company"
            className="company-img"
          />
        </div>
      </div>
    )
  }

  renderSimilarJobs = jobData => {
    const {
      companyLogoUrl,
      employmentType,
      title,
      rating,
      location,
      jobDescription,
    } = jobData
    return (
      <div>
        <div className="logo-title-container">
          <img
            src={companyLogoUrl}
            alt="similar job company logo"
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
        <h1 className="sub-heading">Description</h1>
        <p>{jobDescription}</p>
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
      </div>
    )
  }

  renderSuccessView = () => {
    const {similarJobs} = this.state
    return (
      <div>
        {this.renderJobDetails()}
        <h1 className="similar-jobs-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list">
          {similarJobs.map(eachJob => (
            <li className="job-card-container" key={eachJob.id}>
              {this.renderSimilarJobs(eachJob)}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  getRetryButton = () => (
    <button type="button" className="retry-btn" onClick={this.getJobDetailsApi}>
      Retry
    </button>
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
    return (
      <>
        <Header />
        <div className="job-item-container">
          <div className="render-view">{this.renderAllJobs()}</div>
        </div>
      </>
    )
  }
}
export default JobItemDetails
