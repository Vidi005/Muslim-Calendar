import React from "react"
import Sidebar from "../Sidebar"
import BottomBar from "../BottomBar"
import EclipsesContent from "./EclipsesContent"

class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      localSolarEclipseList: [],
      upcomingSolarEclipseMap: {},
      globalSolarEclipseList: [],
      upcomingLunarEclipseMap: {},
      lunarEclipseList: [],
      areLocalSolarEclipseListLoading: true,
      isUpcomingSolarEclipseMapLoading: true,
      areGlobalSolarEclipseListLoading: true,
      isUpcomingLunarEclipseMapLoading: true,
      areLunarEclipseListLoading: true
    }
  }

  componentDidMount() {
    this.createLocalSolarEclipseList()
    this.createGlobalSolarEclipseList().then(() => this.createUpcomingSolarEclipseMap())
    this.createLunarEclipseList().then(() => this.createUpcomingLunarEclipseMap())
  }

  componentDidUpdate(prevProps) {
    if (prevProps.monthsInSetYear !== this.props.monthsInSetYear || prevProps.latitude !== this.props.latitude || prevProps.longitude !== this.props.longitude || prevProps.inputDate !== this.props.inputDate || prevProps.inputTime !== this.props.inputTime) {
      this.createLocalSolarEclipseList()
      this.createGlobalSolarEclipseList().then(() => this.createUpcomingSolarEclipseMap())
      this.createLunarEclipseList().then(() => this.createUpcomingLunarEclipseMap())
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

  generateUpcomingSolarEclipseMap = globalSolarEclipseDate => new Promise((resolve, reject) => {
    let upcomingSolarEclipseMapWorker = new Worker(new URL('./../../../utils/worker.js', import.meta.url), { type: 'module' })
    upcomingSolarEclipseMapWorker.postMessage({
      type: 'createUpcomingSolarEclipse',
      globalSolarEclipseDate: globalSolarEclipseDate
    })
    upcomingSolarEclipseMapWorker.onmessage = workerEvent => {
      if (workerEvent.data.type === 'createUpcomingSolarEclipse') {
        upcomingSolarEclipseMapWorker.terminate()
        resolve(workerEvent.data.result)
        upcomingSolarEclipseMapWorker = null
      }
    }
    upcomingSolarEclipseMapWorker.onerror = error => {
      upcomingSolarEclipseMapWorker.terminate()
      console.error(error.message)
      reject(error.message)
      upcomingSolarEclipseMapWorker = null
    }
  })

  createUpcomingSolarEclipseMap = async () => {
    this.setState({ isUpcomingSolarEclipseMapLoading: true })
    try {
      const result = await this.generateUpcomingSolarEclipseMap(this.props.formattedDateTime)
      this.setState({ isUpcomingSolarEclipseMapLoading: false, upcomingSolarEclipseMap: result })
    } catch (error) {
      this.setState({ isUpcomingSolarEclipseMapLoading: false })
    }
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
    for (let index = 0; index <= 6; index++) {
      try {
        const result = await this.generateGlobalSolarEclipseInfo(date)
        results.push(result)
        if (result.peak) {
          date = result.nextDate
        } else {
          this.setState({ areGlobalSolarEclipseListLoading: false })
          break
        }
        this.setState({ areGlobalSolarEclipseListLoading: index != 6 })
      } catch (error) {
        this.setState({ areGlobalSolarEclipseListLoading: false })
        break
      }
    }
    this.setState({ areGlobalSolarEclipseListLoading: false, globalSolarEclipseList: results })
  }

  generateUpcomingLunarEclipseMap = lunarEclipseDate => new Promise((resolve, reject) => {
    let upcomingLunarEclipseMapWorker = new Worker(new URL('./../../../utils/worker.js', import.meta.url), { type: 'module' })
    upcomingLunarEclipseMapWorker.postMessage({
      type: 'createUpcomingLunarEclipse',
      lunarEclipseDate: lunarEclipseDate
    })
    upcomingLunarEclipseMapWorker.onmessage = workerEvent => {
      if (workerEvent.data.type === 'createUpcomingLunarEclipse') {
        upcomingLunarEclipseMapWorker.terminate()
        resolve(workerEvent.data.result)
        upcomingLunarEclipseMapWorker = null
      }
    }
    upcomingLunarEclipseMapWorker.onerror = error => {
      upcomingLunarEclipseMapWorker.terminate()
      console.error(error.message)
      reject(error.message)
      upcomingLunarEclipseMapWorker = null
    }
  })

  createUpcomingLunarEclipseMap = async () => {
    this.setState({ isUpcomingLunarEclipseMapLoading: true })
    try {
      const result = await this.generateUpcomingLunarEclipseMap(this.props.formattedDateTime)
      this.setState({ isUpcomingLunarEclipseMapLoading: false, upcomingLunarEclipseMap: result })
    } catch (error) {
      this.setState({ isUpcomingLunarEclipseMapLoading: false })
    }
  }

  createLunarEclipseList = async () => {
    const results = []
    let date = this.props.formattedDateTime
    for (let index = 0; index <= 6; index++) {
      try {
        const result = await this.props.generateLunarEclipseInfo(date)
        results.push(result)
        if (result.peak) {
          date = result.nextDate
        } else {
          this.setState({ areLunarEclipseListLoading: false })
          break
        }
        this.setState({ areLunarEclipseListLoading: index != 6 })
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
        {innerWidth >= 1280 ? (
          <div className="eclipses-container flex flex-nowrap w-full h-full pb-10">
            <Sidebar t={this.props.t} isSidebarExpanded={this.props.isSidebarExpanded} />
            <EclipsesContent
              t={this.props.t}
              selectedLanguage={this.props.selectedLanguage}
              selectedTimeZone={this.props.selectedTimeZone}
              areLocalSolarEclipseListLoading={this.state.areLocalSolarEclipseListLoading}
              isUpcomingSolarEclipseMapLoading={this.state.isUpcomingSolarEclipseMapLoading}
              areGlobalSolarEclipseListLoading={this.state.areGlobalSolarEclipseListLoading}
              isUpcomingLunarEclipseMapLoading={this.state.isUpcomingLunarEclipseMapLoading}
              areLunarEclipseListLoading={this.state.areLunarEclipseListLoading}
              localSolarEclipseList={this.state.localSolarEclipseList}
              globalSolarEclipseList={this.state.globalSolarEclipseList}
              upcomingSolarEclipseMap={this.state.upcomingSolarEclipseMap}
              lunarEclipseList={this.state.lunarEclipseList}
              upcomingLunarEclipseMap={this.state.upcomingLunarEclipseMap}
            />
          </div>
        ) : (
          <div className="eclipses-container flex flex-col w-full h-full">
            <EclipsesContent
              t={this.props.t}
              selectedLanguage={this.props.selectedLanguage}
              selectedTimeZone={this.props.selectedTimeZone}
              areLocalSolarEclipseListLoading={this.state.areLocalSolarEclipseListLoading}
              isUpcomingSolarEclipseMapLoading={this.state.isUpcomingSolarEclipseMapLoading}
              areGlobalSolarEclipseListLoading={this.state.areGlobalSolarEclipseListLoading}
              isUpcomingLunarEclipseMapLoading={this.state.isUpcomingLunarEclipseMapLoading}
              areLunarEclipseListLoading={this.state.areLunarEclipseListLoading}
              localSolarEclipseList={this.state.localSolarEclipseList}
              upcomingSolarEclipseMap={this.state.upcomingSolarEclipseMap}
              globalSolarEclipseList={this.state.globalSolarEclipseList}
              lunarEclipseList={this.state.lunarEclipseList}
              upcomingLunarEclipseMap={this.state.upcomingLunarEclipseMap}
            />
            <BottomBar t={this.props.t} />
          </div>
        )}
      </main>
    )
  }
}

export default MainContainer