import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Github from 'react-feather/dist/icons/github'
import Mail from 'react-feather/dist/icons/mail'
import Minus from 'react-feather/dist/icons/minus'
import Slack from 'react-feather/dist/icons/slack'
import Twitter from 'react-feather/dist/icons/twitter'
import { getSlackDataAsync } from '../utils/slack'

const Footer = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
  margin-top: 100px;
  background-color: transparent;
  min-height: 100px;
  z-index: 1000;
  text-align: center;
`

const LinkStyl = styled.a`
  color: #fff;
  display: flex;
  text-decoration-line: none;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 50px;
  &:visited: {
    color: #fff;
  }
`

const Stats = styled.div`
  color: #fff,
  text-decoration-line: 'none';
  font-size: 10px;
`

const Link = ({ href, children }) => (
  <LinkStyl href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </LinkStyl>
)
Link.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ]).isRequired
}

const HorizontalSeparator = () => (
  <Minus
    style={{
      color: '#fff',
      opacity: 0.5
    }}
  />
)

const GITHUB = 'https://github.com/ReactNativeGallery/reactnative-gallery-web'

class Foot extends React.Component {
  state = { slackActive: 0, slackTotal: 0 }
  componentDidMount() {
    this.getSlackInfo()
  }
  getSlackInfo = async () => {
    const { total: slackTotal, active: slackActive } = await getSlackDataAsync()
    this.setState({ slackTotal, slackActive })
  }
  render() {
    const { slackActive, slackTotal } = this.state
    return (
      <Footer>
        <Link href={GITHUB}>
          <Github />
        </Link>
        <HorizontalSeparator />
        <Link href="https://twitter.com/rn_gallery">
          <Twitter />
        </Link>
        <HorizontalSeparator />
        <Link href={process.env.SLACK_IN}>
          <Slack />
          <Stats>
            {slackActive}/{slackTotal}
          </Stats>
        </Link>
        <HorizontalSeparator />
        <Link href="https://spectrum.chat/reactnative-gallery">
          <img
            style={{ maxWidth: 18 }}
            src="/static/images/spectrum.svg"
            alt="Join the community on Spectrum"
          />
        </Link>
        <HorizontalSeparator />
        <Link href="mailto:xcapetir+rng@gmail.com">
          <Mail />
        </Link>
      </Footer>
    )
  }
}

export default Foot
