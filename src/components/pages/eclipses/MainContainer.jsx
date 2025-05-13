import React from "react"
import Sidebar from "../Sidebar"
import BottomBar from "../BottomBar"
import EclipsesContent from "./EclipsesContent"

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localSolarEclipseList: [],
      globalSolarEclipseList: [],
      lunarEclipseList: [],
      areLocalSolarEclipseListLoading: true,
      areGlobalSolarEclipseListLoading: true,
      areLunarEclipseListLoading: true
    }
  }

  componentDidMount() {
    this.createLocalSolarEclipseList()
    this.createGlobalSolarEclipseList()
    this.createLunarEclipseList()
  }

  componentDidUpdate(prevProps) {
    if (prevProps.monthsInSetYear !== this.props.monthsInSetYear || prevProps.latitude !== this.props.latitude || prevProps.longitude !== this.props.longitude || prevProps.inputDate !== this.props.inputDate || prevProps.inputTime !== this.props.inputTime) {
      this.createLocalSolarEclipseList()
      this.createGlobalSolarEclipseList()
      this.createLunarEclipseList()
    }
  }

  createLocalSolarEclipseList = async () => {
    const results = []
    let date = this.props.formattedDateTime
    for (let index = 0; index <= 5; index++) {
      try {
        const result = await this.props.generateLocalSolarEclipseInfo(date)
        results.push(result)
        if (result.partialEndTime) {
          date = result.nextDate
        } else {
          this.setState({ areLocalSolarEclipseListLoading: false })
          break
        }
        this.setState({ areLocalSolarEclipseListLoading: index != 5 })
      } catch (error) {
        this.setState({ areLocalSolarEclipseListLoading: false })
        break
      }
    }
    this.setState({ areLocalSolarEclipseListLoading: false, localSolarEclipseList: results })
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
    for (let index = 0; index <= 7; index++) {
      try {
        const result = await this.generateGlobalSolarEclipseInfo(date)
        results.push(result)
        if (result.peak) {
          date = result.nextDate
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
    this.setState({ areGlobalSolarEclipseListLoading: false, globalSolarEclipseList: results })
  }

  createLunarEclipseList = async () => {
    const results = []
    let date = this.props.formattedDateTime
    for (let index = 0; index < 5; index++) {
      try {
        const result = await this.props.generateLunarEclipseInfo(date)
        results.push(result)
        if (result.peak) {
          date = result.nextDate
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
    this.setState({ areLunarEclipseListLoading: false, lunarEclipseList: results })
  }
  
  render() {
    return (
      <main className="eclipses-page-main h-0 flex-auto flex-nowrap bg-green-100 dark:bg-gray-800 duration-200">
        {innerWidth > 1024 ? (
          <div className="eclipses-container flex flex-nowrap w-full h-full pb-10">
            <Sidebar t={this.props.t} isSidebarExpanded={this.props.isSidebarExpanded} />
            <EclipsesContent
              t={this.props.t}
              selectedLanguage={this.props.selectedLanguage}
              selectedTimeZone={this.props.selectedTimeZone}
              areLocalSolarEclipseListLoading={this.state.areLocalSolarEclipseListLoading}
              areGlobalSolarEclipseListLoading={this.state.areGlobalSolarEclipseListLoading}
              areLunarEclipseListLoading={this.state.areLunarEclipseListLoading}
              localSolarEclipseList={this.state.localSolarEclipseList}
              globalSolarEclipseList={this.state.globalSolarEclipseList}
              lunarEclipseList={this.state.lunarEclipseList}
            />
          </div>
        ) : (
          <div className="eclipses-container flex flex-col w-full h-full">
            <EclipsesContent
              t={this.props.t}
              selectedLanguage={this.props.selectedLanguage}
              selectedTimeZone={this.props.selectedTimeZone}
              areLocalSolarEclipseListLoading={this.state.areLocalSolarEclipseListLoading}
              areGlobalSolarEclipseListLoading={this.state.areGlobalSolarEclipseListLoading}
              areLunarEclipseListLoading={this.state.areLunarEclipseListLoading}
              localSolarEclipseList={this.state.localSolarEclipseList}
              globalSolarEclipseList={this.state.globalSolarEclipseList}
              lunarEclipseList={this.state.lunarEclipseList}
            />
            <BottomBar t={this.props.t} />
          </div>
        )}
      </main>
    )
  }
}

export default MainContainer