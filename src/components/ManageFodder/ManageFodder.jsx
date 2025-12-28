import React, { useState } from 'react'
import './ManageFodder.css'
import Header from '../Header/Header'
import ErrorModal from '../AlarmThresholds/ErrorModal'
import ManageFodderDetail from './ManageFodderDetail' 

const FEEDS = [
  { name: 'PASZA1', producer: 'PRODUCENT A', price: '10 PLN' },
  { name: 'PASZA2', producer: 'PRODUCENT B', price: '12 PLN' },
  { name: 'PASZA', producer: 'PRODUCENT C', price: '8 PLN' },
  { name: 'MIX', producer: 'PRODUCENT MIX', price: '15 PLN' }
]

function CowRow({ cow, onChange }) {
  return (
    <div className="cow-row">
      <div className="cow-id">ID KROWY {cow.id}</div>
      <div className="cow-body">
        <div className="cow-inner">
          <div className="cow-feed">{cow.feed}</div>
          <button className="cow-change" onClick={() => onChange(cow)}>Zmień</button>
        </div>
      </div>
    </div>
  )
}

function ManageFodder({ onBack }) {
  const [cows, setCows] = useState(
    Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      feed: FEEDS[i % FEEDS.length].name
    }))
  )

  const [selectedCow, setSelectedCow] = useState(null)
  const [selectedFeed, setSelectedFeed] = useState(null)

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false)
  const [isNoChangeModalOpen, setIsNoChangeModalOpen] = useState(false)

  function handleOpenChange(cow) {
    setSelectedCow(cow)
    const current = FEEDS.find(f => f.name === cow.feed)
    setSelectedFeed(current || null)
  }

  function handleSelectFeed(feed) {
    setSelectedFeed(feed)
  }

  function handleAccept(feed) {
    if (!feed || !selectedCow) return

    // BRAK ZMIAN
    if (feed.name === selectedCow.feed) {
      setIsNoChangeModalOpen(true)
      return
    }

    // ZMIANA
    setCows(prev =>
      prev.map(c =>
        c.id === selectedCow.id ? { ...c, feed: feed.name } : c
      )
    )

    setSelectedCow(null)
    setSelectedFeed(null)
    setIsAcceptModalOpen(true)
  }

  function showCancelModal() {
    setIsCancelModalOpen(true)
  }

  function onCancelModalContinue() {
    setIsCancelModalOpen(false)
    setSelectedCow(null)
    setSelectedFeed(null)
  }

  function onCancelModalClose() {
    onCancelModalContinue()
  }

  const headerBack = selectedCow ? showCancelModal : onBack

  return (
    <div className="manage-fodder">
      <Header onBack={headerBack} />

      <div className="content">
        {!selectedCow && (
          <div className="cow-grid">
            {cows.map(c => (
              <CowRow key={c.id} cow={c} onChange={handleOpenChange} />
            ))}
          </div>
        )}

        {selectedCow && (
          <ManageFodderDetail
            cow={selectedCow}
            feeds={FEEDS}
            selectedFeed={selectedFeed}
            onSelectFeed={handleSelectFeed}
            onAccept={handleAccept}
          />
        )}

        {/*ANULOWANIE */}
        <ErrorModal
          isOpen={isCancelModalOpen}
          onClose={onCancelModalClose}
          headerLabel="Komunikat"
          centerAction
          confirmAction={{ label: 'Dalej', onClick: onCancelModalContinue }}
        >
          <div>Zmiana została anulowana.</div>
        </ErrorModal>

        {/*ZAPIS */}
        <ErrorModal
          isOpen={isAcceptModalOpen}
          onClose={() => setIsAcceptModalOpen(false)}
          headerLabel="Komunikat"
          centerAction
          confirmAction={{ label: 'Dalej', onClick: () => setIsAcceptModalOpen(false) }}
        >
          <div>Zmiany zostały zapisane.</div>
        </ErrorModal>

        {/*BRAK ZMIAN */}
        <ErrorModal
          isOpen={isNoChangeModalOpen}
          onClose={() => setIsNoChangeModalOpen(false)}
          headerLabel="Komunikat"
          centerAction
          confirmAction={{ label: 'Dalej', onClick: () => setIsNoChangeModalOpen(false) }}
        >
          <div>Brak zmian, proszę wybrać inną paszę.</div>
        </ErrorModal>
      </div>
    </div>
  )
}

export default ManageFodder
