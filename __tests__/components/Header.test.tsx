import { render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'
import Header from '@/components/Header'

// Next.js 훅 모킹
jest.mock('next/navigation', () => ({
  usePathname: jest.fn()
}))

// 폰트 모킹
jest.mock('@/styles/fonts', () => ({
  oswald: { className: 'oswald-font' }
}))

const menuActiveClass = 'text-[var(--color-primary)]'
const menuLinkActiveClass = 'text-inherit'

describe('<Header>', () => {
  beforeEach(() => {})

  afterEach(() => {
    jest.clearAllMocks()
  })

  // 헤더 기본 렌더링 확인
  test('헤더가 정상적으로 렌더링된다', () => {
    render(<Header />)
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  // 메뉴 항목들 올바른 렌더링 확인
  test('메뉴 항목들이 정상적으로 렌더링된다', () => {
    render(<Header />)

    expect(screen.getByText('🔍 Search')).toBeInTheDocument()
    expect(screen.getByText('📽️ Sample Movie')).toBeInTheDocument()
  })

  // 현재 경로에 따른 활성 메뉴 스타일 적용 확인
  test('현재 경로가 "/"일 때 Search 메뉴가 활성화된다', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/')
    render(<Header />)

    // li에 활성 클래스가 붙는지 확인
    const searchText = screen.getByText('🔍 Search')
    const searchLi = searchText.closest('li')
    expect(searchLi).toBeTruthy()
    expect(searchLi?.className).toContain(menuActiveClass)

    // 링크에는 'text-inherit'가 적용되는지 확인 (active시)
    const searchLink = screen.getByText('🔍 Search')
    expect(searchLink.className).toContain(menuLinkActiveClass)
  })

  test('현재 경로가 "/movies/tt4520988"일 때 Sample Movie 메뉴가 활성화된다', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/movies/tt4520988')
    render(<Header />)

    const sampleText = screen.getByText('📽️ Sample Movie')
    const sampleLi = sampleText.closest('li')
    expect(sampleLi).toBeTruthy()
    expect(sampleLi?.className).toContain(menuActiveClass)

    // Sample Movie 링크에 'text-inherit'가 적용되는지 확인
    const sampleLink = screen.getByText('📽️ Sample Movie')
    expect(sampleLink.className).toContain(menuLinkActiveClass)

    // Search는 비활성화 상태 (active 클래스 없음)
    const searchText = screen.getByText('🔍 Search')
    const searchLi = searchText.closest('li')
    expect(searchLi?.className).not.toContain(menuActiveClass)
    expect(searchText.className).not.toContain(menuLinkActiveClass)
  })

  test('알 수 없는 경로일 때 모든 메뉴가 비활성화된다', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/unknown/path')
    render(<Header />)

    const searchText = screen.getByText('🔍 Search')
    const searchLi = searchText.closest('li')
    expect(searchLi?.className).not.toContain(menuActiveClass)
    expect(searchText.className).not.toContain(menuLinkActiveClass)

    const sampleText = screen.getByText('📽️ Sample Movie')
    const sampleLi = sampleText.closest('li')
    expect(sampleLi?.className).not.toContain(menuActiveClass)
    expect(sampleText.className).not.toContain(menuLinkActiveClass)
  })
})
