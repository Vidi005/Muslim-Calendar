import React from "react"
import Sidebar from "../Sidebar"
import BottomBar from "../BottomBar"
import HomeContent from "./HomeContent"

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <main className="home-page h-full flex-auto grow flex-nowrap bg-green-100 dark:bg-gray-800">
        {innerWidth > 1024
          ? (
              <div className="home-container flex flex-nowrap w-full h-full overflow-y-auto">
                <Sidebar
                  t={this.props.t}
                  isSidebarExpanded={this.props.state.isSidebarExpanded}
                />
                <HomeContent t={this.props.t} collapseSidebar={this.props.collapseSidebar}/>
              </div>
              )
          : (
              <BottomBar
                t={this.props.t}
              />
            )
        }
      </main>
    )
  }
}

export default MainContainer