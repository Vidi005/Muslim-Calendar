import React from "react"
import Sidebar from "../Sidebar"
import BottomBar from "../BottomBar"
import EclipsesContent from "./EclipsesContent"

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      globalSolarEclipseList: [],
      localSolarEclipseList: [],
      lunarEclipseList: [],
      areGlobalSolarEclipseListLoading: true,
      areLocalSolarEclipseListLoading: true,
      areLunarEclipseListLoading: true
    }
  }

  componentDidMount() {
    this.createLocalSolarEclipseList()
    this.createGlobalSolarEclipseList()
    this.createLunarEclipseList()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.monthInSetYear !== this.props.monthInSetYear || prevProps.latitude !== this.props.latitude || prevProps.longitude !== this.props.longitude || prevProps.inputDate !== this.props.inputDate || prevProps.inputTime !== this.props.inputTime) {
      this.createLocalSolarEclipseList()
      this.createGlobalSolarEclipseList()
      this.createLunarEclipseList()
    }
  }

  createLocalSolarEclipseList = async () => {
    const results = []
    let date = this.props.formattedDateTime
    for (let index = 0; index < 5; index++) {
      try {
        const result = await this.props.generateLocalSolarEclipseInfo(date)
        results.push(result)
        if (result.partialEndTime) {
          date = result.partialEndTime
        } else {
          this.setState({ areLocalSolarEclipseListLoading: false })
          break
        }
        this.setState({ areLocalSolarEclipseListLoading: index != 4 })
      } catch (error) {
        this.setState({ areLocalSolarEclipseListLoading: false })
        break
      }
    }
    this.setState({ areLocalSolarEclipseListLoading: false, localSolarEclipseList: results }, () => console.log("localSolarEclipseList", this.state.localSolarEclipseList))
  }

  generateGlobalSolarEclipseInfo = globalSolarEclipseDate => new Promise((resolve, reject) => {
    let globalSolarEclipseInfoWorker = new Worker(new URL('./../../../utils/worker.js', import.meta.url), { type: 'module' })
    globalSolarEclipseInfoWorker.postMessage({
      type: 'createGlobalSolarEclipse',
      globalSolarEclipseDate: globalSolarEclipseDate,
      latitude: this.props.latitude,
      longitude: this.props.longitude,
      elevation: this.props.elevation
    })
    globalSolarEclipseInfoWorker.onmessage = workerEvent => {
      if (workerEvent.data.type === 'createGlobalSolarEclipse') {
        globalSolarEclipseInfoWorker.terminate()
        resolve(workerEvent.data.result)
        globalSolarEclipseInfoWorker = null
      }
    }
    globalSolarEclipseInfoWorker.onerror = error => {
      globalSolarEclipseInfoWorker.terminate()
      console.error(error.message)
      reject(error.message)
      globalSolarEclipseInfoWorker = null
    }
  })

  createGlobalSolarEclipseList = async () => {
    const results = []
    let date = this.props.formattedDateTime
    for (let index = 0; index < 5; index++) {
      try {
        const result = await this.generateGlobalSolarEclipseInfo(date)
        results.push(result)
        if (result.peak) {
          date = result.peak
        } else {
          this.setState({ areGlobalSolarEclipseListLoading: false })
          break
        }
        this.setState({ areGlobalSolarEclipseListLoading: index != 4 })
      } catch (error) {
        this.setState({ areGlobalSolarEclipseListLoading: false })
        break
      }
    }
    this.setState({ areGlobalSolarEclipseListLoading: false, globalSolarEclipseList: results }, () => console.log("globalSolarEclipseList", this.state.globalSolarEclipseList))
  }

  createLunarEclipseList = async () => {
    const results = []
    let date = this.props.formattedDateTime
    for (let index = 0; index < 5; index++) {
      try {
        const result = await this.props.generateLunarEclipseInfo(date)
        results.push(result)
        if (result.peak) {
          date = result.peak
        } else {
          this.setState({ areLunarEclipseListLoading: false })
          break
        }
        this.setState({ areLunarEclipseListLoading: index != 4 })
      } catch (error) {
        this.setState({ areLunarEclipseListLoading: false })
        break
      }
    }
    this.setState({ areLunarEclipseListLoading: false, lunarEclipseList: results }, () => console.log("lunarEclipseList", this.state.lunarEclipseList))
  }
  
  render() {
    return (
      <main className="eclipses-page-main h-0 flex-auto flex-nowrap bg-green-100 dark:bg-gray-800 duration-200">
        {innerWidth > 1024 ? (
          <div className="eclipses-container flex flex-nowrap w-full h-full">
            <Sidebar t={this.props.t} isSidebarExpanded={this.props.isSidebarExpanded} />
            <EclipsesContent t={this.props.t} />
          </div>
        ) : (
          <div className="eclipses-container flex flex-col w-full h-full">
            <EclipsesContent t={this.props.t} />
            <BottomBar t={this.props.t} />
          </div>
        )}
      </main>
    )
  }
}

export default MainContainer