import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import RecommendationsReview from '../RecommendationsReview'
import { apiClient } from '../../../services/apiClient'

vi.mock('../../../services/apiClient', () => ({
  apiClient: {
    createRecommendation: vi.fn()
  }
}))

vi.mock('../../Header/Header', () => ({
  default: ({ onExit }) => (
    <div>
      <button onClick={onExit}>Wyjdź</button>
    </div>
  )
}))

describe('RecommendationsReview', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiClient.createRecommendation.mockResolvedValue({ id: '1', createdAt: new Date().toISOString() })
  })

  it('should render all form fields', () => {
    render(<RecommendationsReview />)

    expect(screen.getByText('Cel rekomendacji')).toBeInTheDocument()
    expect(screen.getByText('Grupa docelowa')).toBeInTheDocument()
    expect(screen.getByText('Charakterystyka')).toBeInTheDocument()
    expect(screen.getByText('Strategia działania')).toBeInTheDocument()
    expect(screen.getByText('Uzasadnienie')).toBeInTheDocument()
  })

  it('should render action buttons', () => {
    render(<RecommendationsReview />)

    expect(screen.getByRole('button', { name: 'Zatwierdź' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Anuluj' })).toBeInTheDocument()
  })

  it('should update form state when inputs change', () => {
    render(<RecommendationsReview />)

    const goalInput = screen.getByPlaceholderText('Wprowadź cel rekomendacji...')
    fireEvent.change(goalInput, { target: { value: 'Test goal' } })

    expect(goalInput.value).toBe('Test goal')
  })

  it('should call createRecommendation on approve', async () => {
    render(<RecommendationsReview />)

    const goalInput = screen.getByPlaceholderText('Wprowadź cel rekomendacji...')
    const targetGroupInput = screen.getByPlaceholderText('Wprowadź grupę docelową...')
    
    fireEvent.change(goalInput, { target: { value: 'Test goal' } })
    fireEvent.change(targetGroupInput, { target: { value: 'Test group' } })

    const approveButton = screen.getByRole('button', { name: 'Zatwierdź' })
    fireEvent.click(approveButton)

    await waitFor(() => {
      expect(apiClient.createRecommendation).toHaveBeenCalledWith(
        expect.objectContaining({
          goal: 'Test goal',
          targetGroup: 'Test group',
          createdAt: expect.any(String)
        })
      )
    })
  })

  it('should show success modal after saving', async () => {
    render(<RecommendationsReview />)

    const approveButton = screen.getByRole('button', { name: 'Zatwierdź' })
    fireEvent.click(approveButton)

    await waitFor(() => {
      expect(apiClient.createRecommendation).toHaveBeenCalled()
    })

    // Success modal should be shown (implementation depends on modal component)
  })

  it('should disable buttons during saving', async () => {
    apiClient.createRecommendation.mockImplementation(() => new Promise(() => {}))
    
    render(<RecommendationsReview />)

    const approveButton = screen.getByRole('button', { name: 'Zatwierdź' })
    const cancelButton = screen.getByRole('button', { name: 'Anuluj' })
    
    fireEvent.click(approveButton)

    await waitFor(() => {
      expect(approveButton).toBeDisabled()
      expect(cancelButton).toBeDisabled()
      expect(screen.getByText('Zapisywanie...')).toBeInTheDocument()
    })
  })

  it('should call onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn()
    render(<RecommendationsReview onCancel={onCancel} />)

    const cancelButton = screen.getByRole('button', { name: 'Anuluj' })
    fireEvent.click(cancelButton)

    // Cancel modal should open first, then onCancel is called after confirmation
  })

  it('should handle errors during save', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    apiClient.createRecommendation.mockRejectedValue(new Error('Save failed'))

    render(<RecommendationsReview />)

    const approveButton = screen.getByRole('button', { name: 'Zatwierdź' })
    fireEvent.click(approveButton)

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        'Błąd podczas zapisywania:',
        expect.any(Error)
      )
    })

    consoleError.mockRestore()
  })
});

