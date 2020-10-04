import React from 'react';
import './MoodForm.scss';
import { getDateShort, getSaveTime } from './dateUtil'

export default class MoodForm extends React.PureComponent {
  // This updates the mood in our parent to keep the rating in-sync
  updateMoodNum (num) {
    this.props.updateMood({...this.props.mood, rating: num})
  }

  // Helper function for getting background classes if needed
  getBackground (num) {
    if (num === this.props.mood.rating) {
      return "background-" + num
    }
    return ""
  }

  // This updates our parent container to keep the mood description in-sync
  // Note this is called on every keystroke which is a performance hit, TODO abstract out
  // And access value through ref
  updateMoodDesc (event) {
    this.props.updateMood({...this.props.mood, description: event.target.value, savedDate: new Date()})
  }

  render () {
    return (
      <div className="card-form overflow-hidden">

        {/* Header of form */}
        <div className="card-form-header px-3 px-md-5 pt-2 pt-lg-4">
          <div className="large-text">
            How are you feeling today?
          </div>
          
          <div className="d-flex flex-row align-items-center pt-xl-3 pt-2 text-muted">
            <div className="d-none d-sm-flex">
              Awful
            </div>
            {/* Each number needs a specific type of background based on whether it's been clicked */}
            <div
              className={`circle-button ml-3 ${this.getBackground(1)}`}
              onClick={() => this.updateMoodNum(1)} >
              1
            </div>
            <div
              className={`circle-button ${this.getBackground(2)}`}
              onClick={() => this.updateMoodNum(2)} >
              2
              </div>
            <div
              className={`circle-button ${this.getBackground(3)}`}
              onClick={() => this.updateMoodNum(3)} >
              3
            </div>
            <div
              className={`circle-button ${this.getBackground(4)}`}
              onClick={() => this.updateMoodNum(4)} >
              4
            </div>
            <div
              className={`circle-button mr-3 ${this.getBackground(5)}`}
              onClick={() => this.updateMoodNum(5)} >
              5
            </div>
            <div className="d-none d-sm-flex">
              Awful
            </div>
          </div>
        </div>

        {/* Main text input of form */}
        <div className="card-form-body">
          <textarea
            placeholder="What made you feel that way?"
            className="h-100 w-100 border-0 overflow-auto px-3 px-md-5 pt-2 pt-md-3 pt-lg-4 pt-xl-5 large-text hide-styling"
            onChange={(event) => this.updateMoodDesc(event)}
            value={this.props.mood.description}
            />
        </div>

        {/* Footer of form */}
        <div className="card-form-footer pb-1 pb-md-3 mx-3 mx-md-5 d-flex align-items-center border-top text-muted justify-content-between">
          { getDateShort(this.props.mood.date) }

          {/* Show the save button if the form is dirty */}
          {this.props.mood.needsSave && 
            <div
              className="outline-button"
              onClick={this.props.saveMood}>
              Save
            </div>
          }

          {/* Otherwise show timestamp */}
          {!this.props.mood.needsSave &&
            <div>
              { getSaveTime(this.props.mood.savedDate) }
            </div>
          }
        </div>

      </div>
    );
  }
}