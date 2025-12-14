import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Automatyczne czyszczenie po każdym teście
afterEach(() => {
  cleanup()
})

