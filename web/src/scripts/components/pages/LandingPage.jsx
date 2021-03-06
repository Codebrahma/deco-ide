/**
 *    Copyright (C) 2015 Deco Software Inc.
 *
 *    This program is free software: you can redistribute it and/or modify
 *    it under the terms of the GNU Affero General Public License, version 3,
 *    as published by the Free Software Foundation.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU Affero General Public License for more details.
 *
 *    You should have received a copy of the GNU Affero General Public License
 *    along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

import React, { Component, PropTypes } from 'react'
import path from 'path'

import EdgeLogo from '../display/EdgeLogo'
import NewIcon from '../display/NewIcon'
import LandingButton from '../buttons/LandingButton'
import ProjectListItem from '../buttons/ProjectListItem'
import GithubAuth from '../pages/GithubAuth'

const style = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backgroundColor: "#ffffff",
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  WebkitAppRegion: 'drag',
}

const header = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  minHeight: 0,
}

const body = {
  flex: 2,
  display: 'flex',
  flexDirection: 'column'
}

const bottomStyle = {
  display: 'flex',
  flex: '0 0 100px',
  backgroundColor: 'rgb(250,250,250)',
  borderTop: '1px solid #E7E7E7',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'stretch',
  padding: '0px 100px',
}

const projectListStyle = {
  flex: '1 1 auto',
  overflowY: 'auto',
}

const projectWrapperStyle = {
  margin: '0 100px',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
}

const logoWrapperStyle = {
  flex: '0 0 auto',
  padding: '35px 0px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: 25
}

const loginWrapper = {
  display: 'flex',
  flex: 3,
  aligItems: 'center',
  jsutifyContent: 'center',
  flexDirection: 'column'
}

const LandingPage = ({ onOpen, onCreateNew, recentProjects, auth, loginRequest }) => {
  return (
    <div className='vbox helvetica-smooth' style={style}>
      <div style={header}>
        <div style={logoWrapperStyle}>
          <EdgeLogo/>
        </div>
      </div>
      {auth.isAuth ? (
        <div style={body}>
          <div style={projectListStyle}>
            <div style={projectWrapperStyle}>
              <ProjectListItem
                onClick={onOpen.bind(null, null)}
                title={'Open Project...'}
              />
              {_.map(recentProjects, (projectPath) => {
                const base = path.basename(projectPath)
                const dir = path.dirname(projectPath)

                return (
                  <ProjectListItem
                    key={projectPath}
                    onClick={onOpen.bind(null, projectPath)}
                    title={base}
                    path={dir}
                  />
                )
              })}
            </div>
          </div>
          <div style={bottomStyle}>
            <LandingButton
              id={'new-project'}
              onClick={onCreateNew}
            >
              <NewIcon />
              New Project
            </LandingButton>
          </div>
        </div>
      ) : (
        <div style={loginWrapper}>
          {auth.isLoading? (
            <p>Loading...</p>
          ) : (
            <GithubAuth onLoginRequested={() => loginRequest()}  />
          )}
          {auth.error && <p style={{color: 'red', textAlign: 'center'}}>Error: {auth.error}</p>}
        </div>
      )}
    </div>
  )
}

LandingPage.propTypes = {
  onOpen: PropTypes.func.isRequired,
  onCreateNew: PropTypes.func.isRequired,
}

export default LandingPage
