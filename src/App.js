import React from 'react';
import './App.scss';
import MoodForm from './MoodForm';
import MoodCardList from './MoodCardList'
import { sameDate, getMonth } from './dateUtil'
import cloneDeep from 'lodash/cloneDeep'

// This is our main app container.
// Here we keep track of our data (daily mood entries), handle background color, and
// render sub-components such as mood cards and mood entry forms
export default class App extends React.Component {
  constructor () {
    super()
    let moods
    // load previously saved data
    try {
      let storedData = localStorage.getItem("MoodTrackerData-SimpleJournal")
      if (storedData) {
        moods = JSON.parse(storedData)
        moods.forEach(mood => {
          mood.date = new Date(mood.date)
          mood.savedDate = new Date(mood.savedDate)
        })
      }
    }
    catch (e) {
      console.error(e)
    }

    // no saved data, start from scratch
    if (!moods) {
      // Note we use an array for storing our data because we don't have a requirement to
      // add/remove moods (except for the current day, aka the end of the array)
      // As such an array will offer advantages for lookup time and keeping the data ordered
      moods = []
    }

    // check to see if we need to make an entry for today
    if (!(moods.length && sameDate(moods[0].date, new Date()))) {
      moods.unshift({
        date: new Date(),
        description: "",
        rating: 0,
        needsSave: true,
        // technically we dont need a value here
        savedDate: new Date()
      })
    }

    // check to see if we need to make an entry for yesterday
    let yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (!(moods.length > 1 && sameDate(moods[1].date, yesterday))) {
      moods.splice(1, 0, {
        date: yesterday,
        description: "",
        rating: 0,
        needsSave: true,
        // technically we dont need a value here
        savedDate: yesterday
      })
    }
    
    // initialize our app
    this.state = {
      moods,
      // we always make a clone of the mood card we're going to modify, so we can keep
      // the form from affecting the list until we save
      curMood: cloneDeep(moods[0]),
      curIndex: 0,
      curMonth: getMonth(new Date())
    }
    this.updateMood = this.updateMood.bind(this)
    this.saveMood = this.saveMood.bind(this)
    this.selectCard = this.selectCard.bind(this)
    this.scrollPercent = this.scrollPercent.bind(this)
  }

  updateMood (newMood) {
    this.setState(state => ({curMood: {...newMood, needsSave: true}}))
  }

  saveMood () {
    // this forces our mood list to rerender
    this.setState(state => {
      // it no longer needs to be saved until dirtied
      let newMood = {...state.curMood, needsSave: false}
      // replace the formerly saved copy with a new copy
      // this is redundant given how shallow our properties are for moods, but
      // in the future they may be deeper, so this is safer.
      let moods = [...state.moods]
      moods[this.state.curIndex] = cloneDeep(newMood)
      return {
        moods,
        curMood: newMood
      }
    },
    // callback function for setState
    () => {
      // this saves our data to local storage
      localStorage.setItem("MoodTrackerData-SimpleJournal", JSON.stringify(this.state.moods))
    })
  }

  selectCard (index) {
    this.setState(state => ({curIndex: index, curMood: cloneDeep(state.moods[index])}))
  }
  
  // This is called whenever the user scrolls through the cards so we can update
  // the month at the bottom
  scrollPercent (percent) {
    // find the relative date for the given scroll position
    // note this works very well when we have enough elements to take up the full
    // scroll view width, unsure otherwise
    let index = Math.floor(percent * this.state.moods.length)
    // when we get to the very end of the scroll, index == length so just return
    if (index >= this.state.moods.length) return
    // convert date to month and set it
    let month = getMonth(this.state.moods[index].date)
    this.setState({curMonth: month})
  }

  // Dev utility function to fill up our past with mood cards
  devSetup () {
    let moods = [...this.state.moods]
    // generate a mood card for most days this year
    for (let month = 8; month > -1; month--) {
      for (let day = 26; day > 0; day--) {
        moods.push(this.devGetMood(day, month))
      }
    }
    this.setState({moods})
  }

  // Dev helper function to make mood cards
  devGetMood (day, month) {
    let date = new Date()
    date.setMonth(month)
    date.setDate(day)
    return {
      date,
      description: "this is a test script lalala",
      rating: Math.ceil(Math.random() * 5),
      needsSave: false,
      savedDate: date
    }
  }

  render () {
    // if the rating is undefined, we default to 0
    const moodRating = this.state.curMood.rating ? this.state.curMood.rating : 0
    // lookup the appropriate gradient class based on the mood rating
    const gradient = "gradient-" + moodRating
    return (
      <div className={`main-container ${gradient} d-flex flex-column`}>

        {/* SimpleJournal title in top right */}
        {/* You can click the SimpleJournal to generate a bunch of mood cards */}
        <div
          className="title-segment text-white d-flex justify-content-end h5 p-4"
          onClick={() => this.devSetup()}>
          SimpleJournal
        </div>

        {/* The large mood form in the center */}
        <div className="card-segment d-flex justify-content-center align-items-center">
          <MoodForm
            mood={this.state.curMood}
            updateMood={this.updateMood}
            saveMood={this.saveMood} />
        </div>

        {/* The list of mood cards at the bottom */}
        <div className="list-segment">
          <MoodCardList
            moods={this.state.moods}
            curIndex={this.state.curIndex}
            selectCard={this.selectCard}
            scrollPercent={this.scrollPercent}
             />
        </div>

        {/* The current month at the bottom */}
        <div className="month-segment d-flex justify-content-center align-items-center text-white">
          { this.state.curMonth + " 2020" }
        </div>

      </div>
    );
  }
}