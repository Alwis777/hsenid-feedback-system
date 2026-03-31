import { render, screen } from '@testing-library/react'
import AdminPage from '../app/admin/page'
import '@testing-library/jest-dom'

// @ts-ignore - Bypassing TypeScript strictness for the global fetch mock
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({
      headerText: "Test Header",
      headerDescription: "Test Desc",
      footerText: "Test Footer",
      ratingLabels: ["1", "2", "3", "4", "5"],
      thankYouText: "Thanks",
      invalidReplyText: "Invalid",
      expiredReplyText: "Expired",
      skipForChannels: ["WEB"]
    }),
  })
);

describe('AdminPage', () => {
  it('renders the loading state initially', () => {
    render(<AdminPage />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })
})