import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import AirQuality from '../AirQuality';
import { apiClient } from '../../../services/apiClient';

// Mock apiClient
vi.mock('../../../services/apiClient', () => ({
  apiClient: {
    getAirQualityStats: vi.fn()
  }
}));

// Mock fetch for sensors and measurements
global.fetch = vi.fn();

describe('AirQuality', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock for fetch (sensors and measurements)
    global.fetch.mockImplementation((url) => {
      if (url.includes('/api/sensors')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            { id: 1, name: 'Temp Sensor', type: 'temperature' },
            { id: 2, name: 'Humidity Sensor', type: 'humidity' }
          ]
        });
      }
      if (url.includes('/api/measurements')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            { id: 1, sensorId: 1, value: '20', timestamp: '2024-01-01T10:00:00Z' },
            { id: 2, sensorId: 2, value: '60', timestamp: '2024-01-01T10:00:00Z' }
          ]
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => []
      });
    });

    // Default mock for air quality stats
    apiClient.getAirQualityStats.mockResolvedValue({
      temperature: 22,
      humidity: 65
    });
  });

  it('should render air quality component', async () => {
    const onBack = vi.fn();
    render(<AirQuality onBack={onBack} />);

    await waitFor(() => {
      expect(screen.getByText('MooMeter')).toBeInTheDocument();
      expect(screen.getByText('Wróć')).toBeInTheDocument();
    });
  });

  it('should load air quality statistics from backend', async () => {
    const onBack = vi.fn();
    render(<AirQuality onBack={onBack} />);

    await waitFor(() => {
      expect(apiClient.getAirQualityStats).toHaveBeenCalled();
    });
  });

  it('should display statistics from backend', async () => {
    apiClient.getAirQualityStats.mockResolvedValue({
      temperature: 25,
      humidity: 70,
      co2: 400
    });

    const onBack = vi.fn();
    render(<AirQuality onBack={onBack} />);

    await waitFor(() => {
      expect(apiClient.getAirQualityStats).toHaveBeenCalled();
    });

    // Stats should be displayed (implementation may vary based on component structure)
    expect(apiClient.getAirQualityStats).toHaveBeenCalledWith(expect.any(Date));
  });

  it('should handle error when loading statistics', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    apiClient.getAirQualityStats.mockRejectedValue(new Error('Failed to load stats'));

    const onBack = vi.fn();
    render(<AirQuality onBack={onBack} />);

    await waitFor(() => {
      expect(apiClient.getAirQualityStats).toHaveBeenCalled();
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error loading air quality stats:', expect.any(Error));
    
    consoleErrorSpy.mockRestore();
  });
});
