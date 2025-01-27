import React from 'react'
import './footer.css'
import { LinkedIn, GitHub, Home } from '@mui/icons-material'

const Footer = () => {
    return (
      <footer>
          <div className="footer__socials">
            <a href="https://www.bsharpcb.com">
                <Home
                    sx={{
                        fontSize:'3rem'
                    }} />
            </a>
            <a href="https://www.linkedin.com/in/bradley-shaffer-9a8b5772/">
                <LinkedIn 
                    sx={{
                        fontSize:'3rem'
                    }} />
            </a>
            <a href="https://github.com/bSharpCb">
                <GitHub 
                    sx={{
                        fontSize:'3rem'
                    }}
                />
            </a>
          </div>
          <div className="footer__copyright">
              <small>&copy; Bradley Shaffer. All rights reserved.</small>
          </div>
      </footer>
    )
  }
  
  export default Footer