import React from 'react';
import './MoodCardList.scss';
import { getDateShort } from './dateUtil'

{/* By making this and MoodForm pure components, we don't have to re-render this whener something changes in the form, unless it's saved*/}
export default class MoodCardList extends React.PureComponent {
  constructor (props) {
    super(props)
    this.scrollRef = React.createRef()
  }

  moodCard (item, index) {
    return (
      <div
        key={getDateShort(item.date)}
        className={`mood-card ${this.props.curIndex === index ? 'selected-border' : ''}`}
        onClick={() => this.props.selectCard(index)}>
        <div className="py-1 py-lg-2 my-md-1 px-1 px-md-2 px-lg-3">
          {/* Rating at top of card */}
          {/* This rating check is just incase an undefined snuck in, which shouldn't be possible */}
          <div className={`circle-rating rating-${item.rating ? item.rating : 0}`}>
            {/* This rating check, on the other hand, is checking for 0 or undefined */}
            { item.rating ? item.rating : "" }
          </div>

          {/* Date in middle of card */}
          <div className="mt-1 mt-md-2">
            { index > 1 ? getDateShort(item.date) :
                index === 0 ? "Today" : "Yesterday" }
          </div>

          {/* Description at bottom of card */}
          <div className="font-small text-muted mt-1 mt-md-2">
              { item.description }
          </div>
        </div>
      </div>
    )
  }

  // whenever we scroll, calculate our position in the scroll and tell our parent
  onScroll () {
    const totalWidth = this.scrollRef.current.scrollWidth - this.scrollRef.current.offsetWidth
    const currentPosition = this.scrollRef.current.scrollLeft
    this.props.scrollPercent( Math.abs( currentPosition / totalWidth ) )
  }

  render () {
    // A scrolling horizontal list of all cards
    return (
      <div
        className="overflow-special flex-row-reverse d-flex px-2 px-md-3 px-lg-4 h-100"
        ref={this.scrollRef}
        onScroll={() => this.onScroll()}>
        {/* TODO make this not render oof-screen elements */}
        { this.props.moods.map((item, index) => this.moodCard(item, index))}
      </div>
    );
  }
}