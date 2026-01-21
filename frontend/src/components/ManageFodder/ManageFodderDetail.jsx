import React from 'react'
import './ManageFodderDetail.css'
/* eslint-disable react/prop-types */

// feeds: [{ name, producer, price }]
function FeedRow({ feed, isSelected, onChoose }) {
  return (
    <div className={`mf-feed-row ${isSelected ? 'selected' : ''}`}>
      <div className="mf-feed-label">PASZA</div>
      <div className="mf-feed-name">{feed.name}</div>
      <button className="mf-choose" onClick={() => onChoose(feed)}>Wybierz</button>
    </div>
  )
}

export default function ManageFodderDetail({ cow, feeds, selectedFeed, onSelectFeed, onAccept}) {
  return (
    <div className="mf-detail">
      <div className="mf-detail-columns">
        <div className="mf-left">
          <div className="mf-id">ID KROWY {cow.id}</div>

          <div className="mf-current-row">
            <div className="mf-current-label">Aktualna pasza:</div>
            <div className="mf-current-value">{cow.feed}</div>
          </div>

          <div className="mf-chosen-box">
            <div className="mf-chosen-label">Wybrana pasza:</div>
            <div className="mf-chosen-list">
              <div>{selectedFeed ? selectedFeed.name : ''}</div>
              <div>{selectedFeed ? selectedFeed.producer : ''}</div>
              <div>{selectedFeed ? selectedFeed.price : ''}</div>
            </div>
            <button className="mf-accept" onClick={() => onAccept(selectedFeed)} disabled={!selectedFeed}>Akceptuj</button>
          </div>
        </div>

        <div className="mf-right">
          {feeds.map((f) => (
            <FeedRow key={f.name} feed={f} isSelected={selectedFeed && selectedFeed.name === f.name} onChoose={onSelectFeed} />
          ))}
        </div>
      </div>
    </div>
  )
}
