import React from 'react'
import './ManageFodder.css'
import Header from '../Header/Header' 

const FEEDS = ['PASZA1', 'PASZA2', 'PASZA', 'MIX']

function CowRow({ cow }) {
  return (
    <div className="cow-row">
      <div className="cow-id">ID KROWY {cow.id}</div>
      <div className="cow-body">
        <div className="cow-inner">
          <div className="cow-feed">{cow.feed}</div>
          <button className="cow-change">Zmień</button>
        </div>
      </div>
    </div>
  )
}

function ManageFodder({ onBack }) {
  const cows = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    feed: FEEDS[i % FEEDS.length]
  }))

  return (
    <div className="manage-fodder">
      <Header onBack={onBack} />
      <div className="content">
        <div className="cow-grid">
          {cows.map((c) => (
            <CowRow key={c.id} cow={c} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ManageFodder
